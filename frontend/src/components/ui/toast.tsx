import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = {
  success: (message: string) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 3000, // 3 seconds
    });
  },
  error: (message: string) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 3000,
    });
  },
};

const ToastComponent = () => (
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
  />
);

export { Toast, ToastComponent };
