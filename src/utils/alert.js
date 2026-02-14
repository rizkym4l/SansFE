import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: "font-cartoon",
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const showSuccess = (message) => {
  Toast.fire({
    icon: "success",
    title: message,
    background: "#fff7ed",
    color: "#1f2937",
    iconColor: "#f97316",
  });
};

export const showError = (message) => {
  Toast.fire({
    icon: "error",
    title: message,
    background: "#fff7ed",
    color: "#1f2937",
    iconColor: "#ef4444",
  });
};

export const showWarning = (message) => {
  Toast.fire({
    icon: "warning",
    title: message,
    background: "#fff7ed",
    color: "#1f2937",
    iconColor: "#f59e0b",
  });
};

export const showConfirm = async (title, text) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#f97316",
    cancelButtonColor: "#9ca3af",
    confirmButtonText: "Yes!",
    cancelButtonText: "Cancel",
    background: "#fff7ed",
    color: "#1f2937",
    customClass: {
      popup: "font-cartoon rounded-2xl",
      confirmButton: "rounded-xl font-bold",
      cancelButton: "rounded-xl font-bold",
    },
  });
  return result.isConfirmed;
};
