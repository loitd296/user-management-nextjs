import React, { useState } from 'react';
import { User } from './UserTable';

interface CreateUserModelProps {
  onSuccess: (newUser: User) => void;
}

const CreateUserModel: React.FC<CreateUserModelProps> = ({ onSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    role: '',
    project: '',
    activeYn: 'Y', // Assuming active by default
  });
  const [errors, setErrors] = useState({
    username: '',
    fullname: '',
    role: '',
    project: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({
      username: '',
      fullname: '',
      role: '',
      project: '',
    });

    if (!formData.username) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: 'Username is required',
      }));
      return;
    }

    if (!formData.fullname) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        fullname: 'Full Name is required',
      }));
      return;
    }

    if (!formData.role) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        role: 'Role is required',
      }));
      return;
    }

    if (typeof formData.project !== 'string' || formData.project.trim() === '') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        project: 'Project is required',
      }));
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const newUser: User = await response.json();

      onSuccess(newUser); // Call the callback function with the new user data

      console.log('User created successfully');
      setShowModal(false);
    } catch (error) {
      console.error('Error creating user:', error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: 'Failed to create user',
      }));
    }
  };

  return (
    <>
      {/* Button to trigger the modal */}
      <button
        className="bg-blue-200 text-black active:bg-blue-500 font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Create User
      </button>
      
      {/* Modal content */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          {/* Modal body */}
          <div className="bg-white p-4 rounded shadow-lg sm:w-2/3 lg:w-1/2 xl:w-1/3">
            {/* Modal header */}
            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
              <h3 className="text-3xl font-semibold text-black">Create User</h3>
            </div>
            {/* Modal form */}
            <form onSubmit={handleSubmit} className="text-black p-6 flex-auto">
              {/* Username field */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
              </div>
              {/* Full Name field */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>}
              </div>
              {/* Role field */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
              </div>
              {/* Project field */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Projects</label>
                <input
                  type="text"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                />
                {errors.project && <p className="text-red-500 text-sm">{errors.project}</p>}
              </div>
              {/* Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateUserModel;
