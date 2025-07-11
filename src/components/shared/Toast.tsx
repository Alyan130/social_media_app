import toast from "react-hot-toast";

function successToast(message:string) {
    toast.success(message, {
      className:
        "bg-primary text-foreground dark:bg-secondary dark:text-secondary-foreground border-2 border-border dark:border-border",
    });
  }


function errorToast(message:string) {
    toast.error(message, {
      className:
        "bg-primary text-foreground dark:bg-secondary dark:text-secondary-foreground border-2 border-border dark:border-border",
    });
  }


export {
  successToast,
  errorToast
}