import { CircleCheck, CircleAlert, Info, X } from "lucide-react";
import LoadingIcon from "../state/loading";
import { cn } from "../../lib/utils";
import { ReactNode } from "react";

interface AlertProps {
  title?: string;
  message: string;
  onClose?: () => void;
  style?: {
    backgroundColor: string;
    borderColor: string;
    textColorTitle: string;
    textColorContent: string;
    btnTextColor: string;
    iconColor: string;
    btnHoverBackgroundColor: string;
    btnFocusRingColor: string;
  };
  icon?: ReactNode;
  dataTestId?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const Alert = ({
  title,
  message,
  onClose,
  style,
  icon,
  dataTestId,
  actionLabel,
  onAction,
}: AlertProps) => {
  const alertStyle = style || {
    borderColor: "border-blue-400",
    backgroundColor: "bg-blue-50",
    textColorTitle: "text-blue-800",
    textColorContent: "text-blue-700",
    btnTextColor: "text-blue-400",
    iconColor: "text-blue-400",
    btnHoverBackgroundColor: "hover:bg-blue-100",
    btnFocusRingColor: "focus:ring-blue-600",
  };

  return (
    <div
      className={cn(
        "w-full rounded-md border-l-4 p-4 shadow-lg sm:w-96",
        alertStyle.backgroundColor,
        alertStyle.borderColor,
      )}
      data-testid={dataTestId || "alert"}
    >
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3">
          <h3 className={cn("text-sm font-medium", alertStyle.textColorTitle)}>
            {title}
          </h3>
          <div className={cn("mt-2 text-sm", alertStyle.textColorContent)}>
            <p>{message}</p>
          </div>
          {actionLabel && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  type="button"
                  className={cn(
                    "rounded-md border bg-blue-100 px-4 py-1.5 text-sm font-medium hover:bg-blue-100/50 focus:outline-none focus:ring-2 focus:ring-offset-2",
                    alertStyle.textColorTitle,
                  )}
                  onClick={() => {
                    if (onAction) onAction();
                    if (onClose) onClose();
                  }}
                >
                  {actionLabel}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5 flex">
            <button
              type="button"
              className={cn(
                "inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2",
                alertStyle.btnHoverBackgroundColor,
                alertStyle.btnTextColor,
                alertStyle.btnFocusRingColor,
              )}
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ErrorAlert = ({
  title,
  message,
  onClose,
  style,
  dataTestId,
  actionLabel,
  onAction,
}: AlertProps) => {
  return (
    <Alert
      title={title || "Error"}
      message={message}
      onClose={onClose}
      style={
        style || {
          borderColor: "border-red-400",
          backgroundColor: "bg-red-50",
          textColorTitle: "text-red-800",
          textColorContent: "text-red-700",
          btnTextColor: "text-red-400",
          iconColor: "text-red-400",
          btnHoverBackgroundColor: "hover:bg-red-100",
          btnFocusRingColor: "focus:ring-red-600",
        }
      }
      icon={<CircleAlert className="h-5 w-5 text-red-400" aria-hidden="true" />}
      dataTestId={dataTestId}
      actionLabel={actionLabel}
      onAction={onAction}
    />
  );
};

export const SuccessAlert = ({
  title,
  message,
  onClose,
  style,
  dataTestId,
  actionLabel,
  onAction,
}: AlertProps) => {
  return (
    <Alert
      title={title || "Success"}
      message={message}
      onClose={onClose}
      style={
        style || {
          borderColor: "border-green-400",
          backgroundColor: "bg-green-50",
          textColorTitle: "text-green-800",
          textColorContent: "text-green-700",
          btnTextColor: "text-green-400",
          iconColor: "text-green-400",
          btnHoverBackgroundColor: "hover:bg-green-100",
          btnFocusRingColor: "focus:ring-green-600",
        }
      }
      icon={
        <CircleCheck className="h-5 w-5 text-green-400" aria-hidden="true" />
      }
      dataTestId={dataTestId}
      onAction={onAction}
      actionLabel={actionLabel}
    />
  );
};

export const InfoAlert = ({
  title,
  message,
  onClose,
  style,
  dataTestId,
  onAction,
  actionLabel,
}: AlertProps) => {
  return (
    <Alert
      title={title}
      message={message}
      onClose={onClose}
      style={style}
      icon={<Info className="h-5 w-5 text-blue-400" aria-hidden="true" />}
      dataTestId={dataTestId}
      onAction={onAction}
      actionLabel={actionLabel}
    />
  );
};

export const ProgressAlert = ({
  title,
  message,
  onClose,
  style,
  dataTestId,
  onAction,
  actionLabel,
}: AlertProps) => {
  return (
    <Alert
      title={title}
      message={message}
      onClose={onClose}
      style={style}
      icon={<LoadingIcon />}
      dataTestId={dataTestId}
      onAction={onAction}
      actionLabel={actionLabel}
    />
  );
};
