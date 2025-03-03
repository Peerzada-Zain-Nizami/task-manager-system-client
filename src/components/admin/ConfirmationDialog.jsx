import React from "react";
import { motion } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

const ConfirmationDialog = ({ title, message, onConfirm, onCancel }) => {
  const handleDialogClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50" onClick={onCancel}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden"
        onClick={handleDialogClick}
      >
        <div className="flex justify-between items-start p-4 border-b">
          <div className="flex items-center">
            <div className="p-1 rounded-full bg-red-100 text-red-600 mr-3">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
          <button onClick={onCancel} className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
            <span className="sr-only">Close</span>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-500">{message}</p>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
          <button type="button" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationDialog;
