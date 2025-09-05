import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const Modal = ({ isOpen, onClose, title, children, actions }) => {
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4 animate-slide-up">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100">
          <div className="px-6 pt-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4 text-gray-600">
              {children}
            </div>
          </div>
          {actions && (
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.node,
  children: PropTypes.node,
  actions: PropTypes.node,
};


