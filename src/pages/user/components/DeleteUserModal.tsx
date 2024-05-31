// components/DeleteUserModal.tsx

import React from 'react';

interface DeleteUserModalProps {
  username: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (userId: number) => void;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ username, isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        <h2 className="text-xl mb-4 text-black">Confirm Delete</h2>
        <p className='text-black'>Are you sure you want to delete the user <strong>{username}</strong>?</p>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete} 
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
