import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence } from "framer-motion";

interface PortalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose?: () => void;
  container?: HTMLElement;
}

export const Portal = ({ children, isOpen, onClose, container }: PortalProps) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Use provided container or create portal container if it doesn't exist
    let element = container || document.getElementById("portal-root");
    if (!element && !container) {
      element = document.createElement("div");
      element.id = "portal-root";
      // Append to document root instead of body
      document.documentElement.appendChild(element);
    }
    setPortalRoot(element || null);

    // Prevent body scroll when portal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "unset";
      // Only cleanup if we created the portal container
      if (!container && element?.childNodes.length === 0) {
        element.remove();
      }
    };
  }, [isOpen, container]);

  if (!portalRoot) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[4200] bg-black/60 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget && onClose) {
              onClose();
            }
          }}
        >
          <div className="bg-white rounded-lg">
            {children}
          </div>
        </div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};
