import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import CreateUserModel from './components/CreateUserModel';
import EditUserModal from './components/EditUserModal';
import DeleteUserModal from './components/DeleteUserModal';
import Layout from '../components/layout';

export interface User {
  id: number;
  username: string;
  fullname: string;
  role: string;
  project: string[];
  activeYn: string;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:4000/user');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const saveUser = (user: any) => {
    // Save user changes
    console.log('User saved:', user);
  };

  const deleteUser = async () => { // Modify to send DELETE request
    try {
      const response = await fetch(`http://localhost:4000/user/${selectedUser.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      console.log('User deleted successfully');
      // Optionally, you can update your local state to reflect the deletion
      // For example:
      // setUsers(users.filter(user => user.id !== selectedUserId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
    setIsDeleteModalOpen(false);
  };

  const searchUserByUsername = async () => {
    try {
      if (searchTerm.trim() === '') {
        fetchData();
      } else {
        const response = await fetch(`http://localhost:4000/user/username/${searchTerm}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([data]); // Ensure data is wrapped in an array if it's not already
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  return (
    <div>
      <div className="flex flex-col mb-4">
        <div className="flex items-center">
          <div className="flex-1 w-10">
            <input
              type="text"
              placeholder="Search by username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-[1100px] mb-5 w-30 px-3 py-2 text-black leading-5 border rounded-md shadow-sm focus:outline-none focus:border-blue-300 transition duration-150 ease-in-out"
            />
          </div>

          <button type="submit" className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-5 mr-[60px]" onClick={searchUserByUsername}>
            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>

        <div className="flex flex-row-reverse mb-2 mr-5">
          <CreateUserModel />
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-black font-medium text-gray-500 uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 text-left text-black font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
            <th className="px-6 py-3 text-left text-black font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-black font-medium text-gray-500 uppercase tracking-wider">Project</th>
            <th className="px-6 py-3 text-left text-black font-medium text-gray-500 uppercase tracking-wider">Active</th>
            <th className="px-6 py-3 text-left text-black font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className=" text-slate-950">
              <td className="px-6 py-4 whitespace-nowrap ">{user.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.fullname}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.project.toString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">{user.activeYn}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-500 text-white bg-orange-400"
                  onClick={() => handleEdit(user)}
                >
                  <PencilIcon className="h-5 w-5 mr-1" />
                </button>
                <button
                  className="mr-2 px-4 py-2 bg-gray-500 text-white bg-red-600"
                  onClick={() => handleDelete(user)}
                >
                  <TrashIcon className="h-5 w-5 mr-1" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <EditUserModal
        user={selectedUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      <DeleteUserModal
        username={selectedUser?.username}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={deleteUser} // Pass the deleteUser function
      />
    </div>
  );
};

const UserPage: React.FC = () => {
  return (
    <Layout>
      <div className="p-8">
        <UserTable />
      </div>
    </Layout>
  );
};

export default UserPage;
