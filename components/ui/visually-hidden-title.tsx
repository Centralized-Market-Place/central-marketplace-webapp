import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "./dialog";
import React from "react";

interface VisuallyHiddenTitleProps {
  title: string;
}

export function VisuallyHiddenTitle({ title }: VisuallyHiddenTitleProps) {
  return (
    <VisuallyHidden>
      <DialogTitle>{title}</DialogTitle>
    </VisuallyHidden>
  );
}
