document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll(".otp-input");

  inputs.forEach((input, index) => {
    // BLOCK NON-NUMBER INPUTS
    input.addEventListener("input", (e) => {
      const value = input.value.replace(/\D/g, ""); // keep only digits
      input.value = value;

      if (value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

    // MOVE LEFT ON BACKSPACE
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && input.value === "" && index > 0) {
        inputs[index - 1].focus();
      }
    });

    // *** THIS IS THE FIXED PASTE HANDLER ***
    input.addEventListener("paste", (e) => {
      e.preventDefault();

      const pasteData = (e.clipboardData || window.clipboardData)
        .getData("text")
        .trim()
        .replace(/\D/g, "");

      if (!pasteData) return;

      pasteData.split("").forEach((char, i) => {
        if (index + i < inputs.length) {
          inputs[index + i].value = char;
        }
      });

      const lastFilled = Math.min(index + pasteData.length - 1, inputs.length - 1);
      inputs[lastFilled].focus();
    });
  });
});