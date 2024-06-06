import React, { useState, useEffect } from 'react';
import { User } from './UserTable';

interface EditUserModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void; // Callback function to update user in table

}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, isOpen, onClose, onUpdate }) => {
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);

  useEffect(() => {
    setUpdatedUser(user);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedUser(prevUser => (prevUser ? { ...prevUser, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatedUser) return;

    try {
      const response = await fetch(`http://localhost:4000/user/${updatedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      const updatedUserData: User = await response.json();
      onUpdate(updatedUserData); // Update user in table

      console.log('User updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!isOpen || !updatedUser) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-lg mx-4 sm:w-2/3 lg:w-1/2 xl:w-1/3">
        <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
          <h3 className="text-2xl font-semibold text-black">Edit User</h3>
          <button onClick={onClose} className="text-black">Close</button>
        </div>
        <form onSubmit={handleSubmit} className="text-black p-6 flex-auto">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={updatedUser.fullname}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Role</label>
            <input
              type="text"
              name="role"
              value={updatedUser.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Project</label>
            <input
              type="text"
              name="project"
              value={updatedUser.project.toString()}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Active</label>
            <select
              name="activeYn"
              value={updatedUser.activeYn}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="Y">Yes</option>
              <option value="N">No</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded mr-2">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
