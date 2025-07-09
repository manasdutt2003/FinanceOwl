import React from 'react'

const DeleteConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Item", 
  message = "Are you sure you want to delete this item?",
  type = "error" // "error" or "warning"
}) => {
  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
            type === 'error' ? 'bg-error/20' : 'bg-warning/20'
          }`}>
            <svg 
              className={`w-6 h-6 ${type === 'error' ? 'text-error' : 'text-warning'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-base-content/70">{message}</p>
          </div>
        </div>
        
        <div className="modal-action">
          <button 
            className="btn btn-ghost"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={`btn ${type === 'error' ? 'btn-error' : 'btn-warning'}`}
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal 