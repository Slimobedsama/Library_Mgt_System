// public/javascript/admin/otp.js
document.addEventListener("DOMContentLoaded", () => {
  const inputs = Array.from(document.querySelectorAll(".otp-input"));
  if (!inputs.length) return;

  const form = inputs[0].closest("form");

  // Hidden combined-OTP field (created if missing)
  let hiddenOtp = document.querySelector('input[name="otp"]');
  if (!hiddenOtp) {
    hiddenOtp = document.createElement("input");
    hiddenOtp.type = "hidden";
    hiddenOtp.name = "otp";
    form.appendChild(hiddenOtp);
  }

  const sanitize = (s = "") => s.toString().replace(/\D/g, "");
  const updateHidden = () => {
    hiddenOtp.value = inputs.map(i => i.value || "").join("");
  };
  const focusInput = (i) => {
    if (i >= 0 && i < inputs.length) {
      inputs[i].focus();
      inputs[i].select();
    }
  };

  // small flag to avoid input-handler clobbering paste distribution
  let pasteProcessing = false;

  inputs.forEach((input, idx) => {
    // input handler: typing or browser autofill per-box
    input.addEventListener("input", (e) => {
      if (pasteProcessing) return; // don't interfere with paste distribution

      const val = sanitize(input.value);

      if (!val) {
        input.value = "";
        updateHidden();
        return;
      }

      if (val.length > 1) {
        // user pasted into a single box or typed multiple characters — distribute
        for (let i = 0; i < val.length && idx + i < inputs.length; i++) {
          inputs[idx + i].value = val.charAt(i);
        }
        focusInput(Math.min(idx + val.length, inputs.length - 1));
      } else {
        input.value = val;
        if (idx < inputs.length - 1) focusInput(idx + 1);
      }

      updateHidden();
    });

    // paste handler
    input.addEventListener("paste", async (e) => {
      e.preventDefault();
      pasteProcessing = true;

      // try clipboardData first, fallback to navigator.clipboard
      let pasteText = "";
      try {
        pasteText = (e.clipboardData && e.clipboardData.getData("text")) || "";
      } catch (err) {
        pasteText = "";
      }

      if (!pasteText && navigator.clipboard && navigator.clipboard.readText) {
        try {
          pasteText = await navigator.clipboard.readText();
        } catch (err) {
          // ignore
        }
      }

      pasteText = sanitize(pasteText);
      if (!pasteText) {
        // release on next tick
        Promise.resolve().then(() => (pasteProcessing = false));
        return;
      }

      // distribute digits across inputs starting at current index
      for (let i = 0; i < pasteText.length && idx + i < inputs.length; i++) {
        inputs[idx + i].value = pasteText.charAt(i);
      }

      const landing = Math.min(idx + pasteText.length - 1, inputs.length - 1);
      focusInput(landing);
      updateHidden();

      // release the lock on the next microtask so any browser input event won't overwrite
      Promise.resolve().then(() => {
        pasteProcessing = false;
        // ensure hidden is correct after microtask
        updateHidden();
      });
    });

    // keydown handler for navigation, deletion and Enter
    input.addEventListener("keydown", (e) => {
      const key = e.key;

      if (key === "Enter") {
        // ensure hidden is up to date
        updateHidden();
        if (hiddenOtp.value.length === inputs.length) {
          form.submit();
        }
        return;
      }

      if (key === "Backspace") {
        // if current has value, clear it (consume)
        if (input.value) {
          input.value = "";
          updateHidden();
          e.preventDefault();
          return;
        }
        // if empty, move to previous and clear
        if (idx > 0) {
          e.preventDefault();
          inputs[idx - 1].value = "";
          focusInput(idx - 1);
          updateHidden();
        }
      } else if (key === "Delete") {
        input.value = "";
        updateHidden();
        e.preventDefault();
      } else if (key === "ArrowLeft") {
        if (idx > 0) {
          e.preventDefault();
          focusInput(idx - 1);
        }
      } else if (key === "ArrowRight") {
        if (idx < inputs.length - 1) {
          e.preventDefault();
          focusInput(idx + 1);
        }
      } else if (/^[0-9]$/.test(key)) {
        // numeric key: allow default — 'input' handler will move focus
      } else if (key === "Tab") {
        // allow tab
      } else {
        // block non-digit printing keys
        // (keypress handler below also blocks, but keep here to be safe)
        e.preventDefault();
      }
    });

    // block letters on keypress (older browsers)
    input.addEventListener("keypress", (e) => {
      if (!/[0-9]/.test(e.key)) e.preventDefault();
    });
  });

  // initial sync
  updateHidden();

  // ensure hidden updated right before submission
  if (form) form.addEventListener("submit", updateHidden);
});
