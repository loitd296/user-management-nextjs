import React, { useState } from 'react';
import { User } from '..';

const CreateUserModel: React.FC = () => {
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

  const [users, setUsers] = useState<User[]>([]);

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
      // Fetch the latest users from the API
      const usersResponse = await fetch('http://localhost:4000/user');
      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      const users: User[] = await usersResponse.json();

      // Check if the username already exists
      const existingUser = users.find(u => u.username === formData.username);
      if (existingUser) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: 'Username already exists',
        }));
        return;
      }

      // If username does not exist, proceed with creating the user
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

      // Assuming setUsers is available in this component and used to update the state in parent component
      setUsers(prevUsers => [...prevUsers, newUser]);

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
      <button
        className="bg-blue-200 text-black active:bg-blue-500 
        font-bold px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Create User
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg w-1/3">
            <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
              <h3 className="text-3xl font-semibold text-black">Create User</h3>
            </div>
            <form onSubmit={handleSubmit} className="text-black p-6 flex-auto">
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
