import { createPortal } from "react-dom";
import { useRef, useEffect } from "react";

export default function Modal({ children, open, className = "", onClose }) {
  const dialog = useRef();

  useEffect(() => {
    const modal = dialog.current;

    if (open) {
      modal.showModal();
    }

    return () => {
      modal.close();
    };
  }, [open]);

  return createPortal(
    <dialog
      ref={dialog}
      className={` modal bg-[#f9ebda] rounded-lg border-none shadow-lg p-4 w-4/5 max-w-2xl animate-fade-slide-up ${className}`}
      onClose={onClose}
    >
      {children}
    </dialog>,
    document.getElementById("modal")
  );
}
