import React from 'react';

const ErrorModal = ({ isOpen, onClose, message, title = "Error" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
        <h3 className="text-xl font-bold text-brown-900 mb-4">{title}</h3>
        
        <p className="text-brown-600 mb-6">{message}</p>
        
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
