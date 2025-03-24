const Swal = require("sweetalert2");

export const SweetAlertService = {
  confirm() {
    Swal.fire({
      title: "Error!",
      text: "Do you want to continue ?",
      icon: "error",
      confirmButtonText: "Cool",
    });
  },
};
