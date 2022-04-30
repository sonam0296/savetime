import { toast } from "react-toastify";
import moment from "moment";

export const successToaster = (message) => {
  return toast.success(message, {
    position: toast.POSITION.TOP_RIGHT
  });
};

export const errorToaster = (message) => {
  return toast.error(`⏰ ${message}`, {
    position: toast.POSITION.TOP_RIGHT
  });
};