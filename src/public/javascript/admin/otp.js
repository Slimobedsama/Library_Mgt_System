document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll(".otp-input");
  const form = document.querySelector("#form");

  inputs.forEach((input, index) => {

    input.addEventListener("input", () => {
      const value = input.value.replace(/\D/g, "");
      input.value = value;

      if (value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && input.value === "" && index > 0) {
        inputs[index - 1].focus();
      }
    });

    input.addEventListener("paste", (e) => {
      e.preventDefault();

      const pasteData = (e.clipboardData || window.clipboardData)
        .getData("text")
        .trim()
        .replace(/\D/g, "");

      pasteData.split("").forEach((char, i) => {
        if (index + i < inputs.length) {
          inputs[index + i].value = char;
        }
      });
    });

  });

  // JOIN OTP BEFORE SUBMIT
  form.addEventListener("submit", () => {
    const otp = [...inputs].map(input => input.value).join("");

    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = "otp";
    hidden.value = otp;

    form.appendChild(hidden);
  });

});