"use client";

import React from "react";
import { createPortal } from "react-dom";

interface BackDropProps {
  onClose: () => void;
}

const BackDrop: React.FC<BackDropProps> = ({ onClose }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-40"
    ></div>
  );
};

interface ModalOverlayProps {
  children: React.ReactNode;
  className?: string;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white min-w-[500px] rounded-lg shadow-xl p-6 z-50 ${className}`}
    >
      <div className="w-full">{children}</div>
    </div>
  );
};

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  onClose,
  children,
  className,
}) => {
  const modalRoot = document.body.querySelector("#modal-root") as HTMLElement;

  React.useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return createPortal(
    <React.Fragment>
      <BackDrop onClose={onClose} />
      <ModalOverlay className={className}>{children}</ModalOverlay>
    </React.Fragment>,
    modalRoot
  );
};
