'use client';

import { ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  title: string;
  content: ReactNode;
  onClose?: () => void;
};

export function Dialog({ title, content, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="w-full max-w-lg rounded-2xl border bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="dialog-title" className="text-lg font-semibold">
            {title}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="rounded-md px-2 py-1 text-sm hover:bg-neutral-100"
              aria-label="Cerrar"
            >
              <X />
            </button>
          )}
        </div>
        {content}
      </div>
    </div>

  );
}