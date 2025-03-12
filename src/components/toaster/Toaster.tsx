import React from "react";
import { useToaster } from "../../context/toaster-context/ToasterContext";
import toasterstyle from "./Toaster.module.scss";

const Toaster: React.FC = () => {
  const { toasts, removeToast } = useToaster();

  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`${toasterstyle.toast_class} ${
            toasterstyle[`toaster_${toast.type}`]
          } ${toasterstyle[`${toast.position ?? "top-right"}-position`]}`}
          style={{
            [toast.position?.includes("top") ? "top" : "bottom"]: `calc(${
              index * 80
            }px + 1.25rem)`,
          }}
        >
          <div className={toasterstyle.toast_content}>
            <div className={toasterstyle.toast_icon}>
              <i
                className={`pi ${
                  toast.type === "success"
                    ? "pi-check"
                    : toast.type === "warning"
                    ? "pi-exclamation-triangle"
                    : toast.type === "info"
                    ? "pi-exclamation-circle"
                    : toast.type === "error"
                    ? "pi-times-circle"
                    : ""
                }`}
              ></i>
            </div>
            <div className={toasterstyle.toast_message}>
              {toast?.summary && (
                <h6 className="font-semibold mb-1 mt-0 text-base">
                  {toast?.summary}
                </h6>
              )}
              <p className="font-medium mt-0 mb-0 text-[0.875rem] leading-4">
                {toast.message}
              </p>
            </div>
            <div
              className={toasterstyle.toast_close}
              onClick={() => removeToast(toast.id)}
            >
              <i className="pi pi-times"></i>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Toaster;
