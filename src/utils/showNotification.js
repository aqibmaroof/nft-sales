import { toast } from "react-toastify";

export const showNotitication = (msg, type) => {
  toast[type](msg, {
    position: "bottom-right",
    autoClose: 3000,
    progress: undefined,
    toastId: "selectcurrencymsg-1",
  });
};
