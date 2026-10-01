"use client";

import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";

export type SelectOption = { value: string; label: string };

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 12 8"
      aria-hidden
      className={clsx("h-2.5 w-3 shrink-0 fill-none stroke-[var(--color-muted)] stroke-[1.5] transition-transform", open && "rotate-180")}
    >
      <path d="M1 1l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A fully custom-styled single-select dropdown — unlike a plain
 * `<select>`, the open option list is our own markup (styled, scrollable,
 * keyboard-navigable), not the browser/OS's native popup. Submits through
 * a hidden input under `name`, so it drops into any existing
 * `new FormData(form)` flow exactly like a native select would. Follows
 * the ARIA combobox pattern: focus stays on the trigger button the whole
 * time, the active option is tracked via aria-activedescendant rather
 * than real DOM focus moving into the list. */
export function CustomSelect({
  name,
  options,
  value,
  onChange,
  placeholder,
  invalid,
  ariaLabel,
  className,
}: {
  name: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  invalid?: boolean;
  ariaLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);

  function openList() {
    setOpen(true);
    setActiveIndex(Math.max(0, options.findIndex((o) => o.value === value)));
  }

  function commit(index: number) {
    const opt = options[index];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(activeIndex);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid}
        aria-label={ariaLabel}
        aria-activedescendant={open && activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        className={clsx(
          "flex h-11 w-full items-center justify-between rounded-md border bg-surface-card px-3.5 text-left text-[15px] outline-none transition-colors focus:border-ink",
          invalid ? "border-[var(--color-error)]" : "border-hairline-strong",
          className
        )}
      >
        <span className={clsx("truncate", selected ? "text-ink" : "text-[var(--color-muted-soft)]")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronIcon open={open} />
      </button>

      {open ? (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute z-20 mt-1.5 max-h-60 w-full overflow-auto rounded-md border border-hairline-strong bg-surface-card py-1.5 shadow-[0_8px_24px_rgba(12,10,9,0.14)]"
        >
          {options.map((opt, i) => (
            <li
              key={opt.value}
              id={`${listId}-opt-${i}`}
              role="option"
              aria-selected={opt.value === value}
              onPointerEnter={() => setActiveIndex(i)}
              onClick={() => commit(i)}
              className={clsx(
                "cursor-pointer truncate px-3.5 py-2 text-[15px]",
                i === activeIndex ? "bg-[var(--color-primary-blue)] text-white" : "text-ink"
              )}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
