import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode, useCallback } from "react";

interface ModalProps {
  /**
   * Controls the visibility of the modal
   */
  isOpen: boolean;

  /**
   * Callback function when modal is closed
   */
  onClose: () => void;

  /**
   * Content to be rendered inside the modal
   */
  children: ReactNode;

  /**
   * Optional title for the modal
   */
  title?: string;

  /**
   * Whether to show the close button
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Maximum width class for the modal
   * @default "max-w-3xl"
   */
  maxWidth?: string;

  /**
   * Additional CSS classes to apply to the modal
   */
  className?: string;

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  maxWidth = "max-w-3xl",
  className = "",
  ariaLabel = "Modal dialog",
}: ModalProps) => {
  /**
   * Close button element for the modal header
   */
  const renderCloseButton = useCallback(
    () => (
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white 
          transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 
          focus:ring-gray-400 focus:ring-offset-2"
        aria-label="Close modal"
      >
        <i className="fa-solid fa-xmark text-xl" aria-hidden="true"></i>
      </button>
    ),
    [onClose]
  );

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="section"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={onClose}
        aria-label={ariaLabel}
      >
        <div className="flex min-h-screen items-center justify-center p-4">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-300 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              aria-hidden="true"
            />
          </Transition.Child>

          {/* Modal Panel */}
          <Transition.Child
            as={Fragment}
            enter="transition-transform duration-300 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition-transform duration-200 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              className={`relative w-full ${maxWidth} transform bg-white dark:bg-[#15181E] 
                rounded-xl shadow-xl transition-all h-auto ${className}`}
              role="dialog"
              aria-modal="true"
            >
              <article>
                {/* Modal Header */}
                {(title || showCloseButton) && (
                  <header className="flex justify-between items-start px-8 pt-8">
                    {title && (
                      <Dialog.Title className="text-lg font-semibold text-gray-800">
                        {title}
                      </Dialog.Title>
                    )}
                    {showCloseButton && renderCloseButton()}
                  </header>
                )}

                {/* Modal Content */}
                <div className="max-h-[70vh] overflow-y-auto p-8">
                  {children}
                </div>
              </article>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
