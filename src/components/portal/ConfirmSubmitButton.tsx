"use client";

import { useRef } from "react";

/** A submit button that asks for confirmation before actually submitting
 * the enclosing form — used for "Publish" everywhere in the portal, per
 * the standing rule: nothing goes live without an explicit "are you
 * sure" step, since this form's changes affect a public government site. */
export function ConfirmSubmitButton({
  children,
  confirmMessage,
  className,
  name,
  value,
}: {
  children: React.ReactNode;
  confirmMessage: string;
  className?: string;
  name?: string;
  value?: string;
}) {
  const formRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={formRef}
      type="submit"
      name={name}
      value={value}
      className={className}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
