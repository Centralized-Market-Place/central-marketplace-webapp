"use client";

import {
  ErrorAlert,
  InfoAlert,
  ProgressAlert,
  SuccessAlert,
} from "../components/alert/alert";
import { ReactNode, createContext, useContext, useState } from "react";
import toast, { ToastOptions, Toaster, Toast } from "react-hot-toast";

export interface AlertContextProps {
  remove: (id: string) => void;
  activeProgressAlerts: string[];
  success: (
    message: string,
    id?: string,
    dataTestId?: string,
    actionLabel?: string,
    onAction?: () => void,
  ) => void;
  error: (
    message: string,
    id?: string,
    dataTestId?: string,
    actionLabel?: string,
    onAction?: () => void,
  ) => void;
  info: (
    title: string,
    message: string,
    id?: string,
    dataTestId?: string,
    actionLabel?: string,
    onAction?: () => void,
  ) => void;
  progress: (
    title: string,
    message: string,
    id: string,
    dataTestId?: string,
    actionLabel?: string,
    onAction?: () => void,
  ) => void;
}

const AlertContext = createContext<AlertContextProps | null>(null);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [progressAlerts, setProgressAlerts] = useState<string[]>([]);

  const defaultOptions: ToastOptions = {
    duration: 3000,
  };

  const success = (
    message: string,
    id?: string,
    dataTestId?: string,
    actionLabel?: string,
    onAction?: () => void,
  ) => {
    const opts = id ? { ...defaultOptions, id: id } : defaultOptions;
    toast.custom(
      (t: Toast) => (
        <SuccessAlert
          message={message}
          onClose={() => toast.remove(t.id)}
          dataTestId={dataTestId}
          actionLabel={actionLabel}
          onAction={onAction}
        />
      ),
      opts,
    );
  };

  const error = (
    message: string,
    id?: string,
    dataTestId?: string,
    actionLabel?: string,
    onAction?: () => void,
  ) => {
    const opts = id ? { ...defaultOptions, id: id } : defaultOptions;
    toast.custom(
      (t: Toast) => (
        <ErrorAlert
          message={message}
          onClose={() => toast.remove(t.id)}
          dataTestId={dataTestId}
          actionLabel={actionLabel}
          onAction={onAction}
        />
      ),
      opts,
    );
  };

  const info = (
    title: string,
    message: string,
    id?: string,
    dataTestId?: string,
    actionLabel?: string,
    onAction?: () => void,
  ) => {
    const opts = id ? { ...defaultOptions, id: id } : defaultOptions;
    toast.custom(
      (t: Toast) => (
        <InfoAlert
          title={title}
          message={message}
          onClose={() => toast.remove(t.id)}
          dataTestId={dataTestId}
          actionLabel={actionLabel}
          onAction={onAction}
        />
      ),
      opts,
    );
  };

  const progress = (
    title: string,
    message: string,
    id: string,
    dataTestId?: string,
    actionLabel?: string,
    onAction?: () => void,
  ) => {
    addToProgressAlerts(id);
    toast.custom(
      (t: Toast) => (
        <ProgressAlert
          title={title}
          message={message}
          onClose={() => toast.remove(t.id)}
          dataTestId={dataTestId}
          actionLabel={actionLabel}
          onAction={onAction}
        />
      ),
      { id: id, duration: Infinity },
    );
  };

  const remove = (id: string) => {
    setProgressAlerts((prev) => prev.filter((d) => d !== id));
    toast.remove(id);
  };

  const addToProgressAlerts = (id: string) => {
    setProgressAlerts((prev) => [...prev, id]);
  };

  return (
    <AlertContext.Provider
      value={{
        success,
        error,
        info,
        progress,
        remove,
        activeProgressAlerts: progressAlerts,
      }}
    >
      {children}
      <Toaster toastOptions={{ position: "bottom-right" }} />
    </AlertContext.Provider>
  );
}

export const useAlert = () =>
  useContext<AlertContextProps | null>(AlertContext);
