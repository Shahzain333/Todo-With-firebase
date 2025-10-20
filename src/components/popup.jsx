import React from 'react';

const Popup = ({ message, type = 'error', onClose, isOpen }) => {
    
    if (!isOpen) return null;

    const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
    
    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
            
            <div className={`${bgColor} text-white p-4 rounded-lg shadow-lg flex justify-between 
                items-center`}>
                
                <span>{message}</span>
            
                <button 
                    onClick={onClose}
                    className="text-white hover:text-gray-200 font-bold text-lg"
                >
                    ×
                </button>
            
            </div>
        
        </div>
    );
};

export default Popup;