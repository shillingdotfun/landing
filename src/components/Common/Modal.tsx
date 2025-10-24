// src/components/common/Modal.tsx
import React, { ReactNode, useState, forwardRef, useImperativeHandle, ForwardedRef, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  animation?: 'fade' | 'slide' | 'none';
  onClose?: () => void;
  closeOnOverlayClick?: boolean;
  animationDuration?: number;
  bgColor?: string;
  bgHeaderColor?: string;
  bgFooterColor?: string;
  modalBodyClass?: string;
}

export interface ModalHandles {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const Modal = forwardRef((props: ModalProps, ref: ForwardedRef<ModalHandles>) => {
  const { 
    title, 
    children, 
    footer,
    maxWidth = '2xl',
    animation = 'fade',
    onClose,
    closeOnOverlayClick = true,
    animationDuration = 300,
    bgColor,
    bgHeaderColor = 'bg-slate-200',
    modalBodyClass,
    bgFooterColor = 'bg-slate-200',
  } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle modal opening
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  // Function to close the modal
  const handleClose = () => {
    if (isClosing) return; // Prevent double closing
    
    setIsClosing(true);
    if (onClose) onClose();
    
    // Wait for animation to finish before hiding
    if (animation !== 'none') {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      
      closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
        setIsVisible(false);
        setIsClosing(false);
        closeTimeoutRef.current = null;
      }, animationDuration);
    } else {
      // No animation, close immediately
      setIsOpen(false);
      setIsVisible(false);
      setIsClosing(false);
    }
  };

  // Clean up timeout if component unmounts
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Expose methods to control the modal
  useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    },
    close: handleClose,
    isOpen
  }));

  // Handler for overlay click
  const handleOverlayClick = (_e: React.MouseEvent) => {
    if (closeOnOverlayClick && !isClosing) {
      handleClose();
    }
  };

  if (!isVisible) return null;

  const maxWidthClasses = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    'full': 'max-w-full',
  };

  // Determine animation class based on state
  const getAnimationClass = () => {
    if (animation === 'none') return '';
    
    if (isClosing) {
      return animation === 'fade' ? 'animate-fadeout' : 'animate-slideout';
    } else {
      return animation === 'fade' ? 'animate-fadein' : 'animate-slidein';
    }
  };

  // Determine animation class for overlay (always fade)
  const getOverlayAnimationClass = () => {
    if (isClosing) {
      return 'animate-fadeout';
    } else {
      return 'animate-fadein';
    }
  };

  /*
    We are using "createPortal" because:
    El problema que describes es muy común y está relacionado con el stacking context que crea la propiedad CSS backdrop-filter.
    Cuando usas backdrop-blur-lg en Tailwind, se traduce a backdrop-filter: blur(12px), y esta propiedad CSS crea un nuevo stacking context. 
    Esto hace que los elementos con position: fixed (como las modales) se posicionen relativamente a ese contenedor en lugar del
    viewport completo.
  */
  return createPortal(
    <div className='font-sans'> {/* This className is needed because of the use of createPortal */}
      {/* Overlay background with independent animation */}
      <div 
        className={`fixed inset-0 bg-slate-900 bg-opacity-75 z-40 ${getOverlayAnimationClass()}`}
        onClick={handleOverlayClick}
        style={{ animationDuration: `${animationDuration}ms` }}
      ></div>
      
      {/* Modal container with flexbox centering */}
      <div 
        tabIndex={-1} 
        aria-hidden="true" 
        className="overflow-y-auto overflow-x-hidden fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        <div className={`relative w-full ${maxWidthClasses[maxWidth]} max-h-full`}>
          {/* Modal content */}
          <div 
            className={`relative ${bgColor ? bgColor : 'bg-white'} rounded-lg shadow-lg ${getAnimationClass()}`}
            onClick={(e) => e.stopPropagation()}
            style={{ animationDuration: `${animationDuration}ms` }}
          >
            {/* Modal header */}
            {title.length > 1 &&
              <div className={`flex items-center justify-between bg-${bgHeaderColor} p-4 md:p-5 rounded-t border-gray-200`}>
                <h3 className="text-xl font-semibold font-anek-latin">
                  {title}
                </h3>
                <button 
                  onClick={handleClose} 
                  type="button" 
                  className="bg-transparent hover:bg-slate-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  disabled={isClosing}
                >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
            }
            
            {/* Modal body */}
            <div className={`p-4 md:p-5 space-y-4 overflow-y-auto ${modalBodyClass}`}>
              {children}
            </div>
            
            {/* Modal footer - conditionally rendered */}
            {footer && (
              <div className={`flex items-center gap-2 justify-end p-4 md:p-5 ${bgFooterColor} rounded-b-lg`}>
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
});

Modal.displayName = 'Modal';

export default Modal;