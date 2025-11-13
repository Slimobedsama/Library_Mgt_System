document.addEventListener("DOMContentLoaded", function () {
    // Toastr config
    toastr.options = {
      closeButton: true,
      // progressBar: true,
      positionClass: "toast-bottom-center",
      preventDuplicates: true,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "3000",
      extendedTimeOut: "1000",
      showMethod: "fadeIn",
      hideMethod: "fadeOut"
    };
  
    // Grab data from <script id="toast-data">
    const toastDataTag = document.getElementById("toast-data");
   
    if (!toastDataTag) return;
  
    let toastData = {};
    try {
      toastData = JSON.parse(toastDataTag.textContent);
    } catch (e) {
      console.error("Failed to parse toast data:", e);
      return;
    }
   
    const { success, error } = toastData;

    if(success && success.length > 0) {
      toastr.success(success);
    }

    if (error && error.length > 0) {
      toastr.error(error);
    }
    
  });
  