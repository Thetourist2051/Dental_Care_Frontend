import React, { createContext, useContext, useState } from "react";

type ToasterType = "success" | "warning" | "error" | "info";

type PositionType = "top-right" | "top-left" | "bottom-right" | "bottom-left";

type Toast = {
    message: string;
    type: "success" | "warning" | "error" | "info";
    summary?:string | undefined | null;
    duration?: number;
    position? : PositionType;
    id: number;
};

type ToasterContextType = {
  toasts: Toast[];
  addToast: (message: string, type: ToasterType, summary?:string|undefined|null, duration?:number, position?: PositionType) => void;
  removeToast: (id: number) => void;
};

const ToasterContext = createContext<ToasterContextType | undefined>(undefined);

export const useToaster = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error("useToaster must be used within a ToasterProvider");
  }
  return context;
};

export const ToasterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToasterType, summary?:string|undefined|null, duration?:number, position?: PositionType) => {
    const id = Date.now();
    duration = duration ?? 5000;
    position = position ?? "top-right";
    setToasts((prevToasts) => [...prevToasts, { id, message, type , summary, duration, position}]);
    setTimeout(() => removeToast(id), duration);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToasterContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToasterContext.Provider>
  );
};
