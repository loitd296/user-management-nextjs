import React, { useState, useEffect, useMemo } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import {
    useReactTable,
    createColumnHelper,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    ColumnSort,
} from '@tanstack/react-table';
import CreateUserModel from './CreateUserModel';
import EditUserModal from './EditUserModal';
import DeleteUserModal from './DeleteUserModal';

export interface User {
    id: number;
    username: string;
    fullname: string;
    role: string;
    project: string[];
    activeYn: string;
}

const UserTable: React.FC = () => {
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [sorting, setSorting] = useState<ColumnSort[]>([]);

    // Pagination state
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 100,
    });

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        updateDisplayedUsers();
    }, [allUsers, pagination, searchTerm]);

    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:4000/user`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setAllUsers(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const updateDisplayedUsers = () => {
        let filteredUsers = allUsers;

        if (searchTerm.trim() !== '') {
            filteredUsers = allUsers.filter(user =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        const start = pagination.pageIndex * pagination.pageSize;
        const end = start + pagination.pageSize;
        setUsers(filteredUsers.slice(start, end));
    };

    const createUser = (newUser: User) => {
        setAllUsers(prevUsers => [...prevUsers, newUser]);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };
    const updateUser = (updatedUser: User) => {
        setAllUsers(prevUsers => prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user));
    };

    const handleDelete = (user: User) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const deleteUser = async () => {
        try {
            const response = await fetch(`http://localhost:4000/user/${selectedUser?.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            setAllUsers(allUsers.filter((user) => user.id !== selectedUser?.id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
        setIsDeleteModalOpen(false);
    };

    const searchUserByUsername = async () => {
        updateDisplayedUsers();
    };

    const columnHelper = createColumnHelper<User>();

    const columns = useMemo(
        () => [
            columnHelper.accessor('username', {
                header: 'Username',
            }),
            columnHelper.accessor('fullname', {
                header: 'Full Name',
            }),
            columnHelper.accessor('role', {
                header: 'Role',
            }),
            columnHelper.accessor('project', {
                header: 'Project',
                cell: (info) => info.getValue(),
            }),
            columnHelper.accessor('activeYn', {
                header: 'Active',
            }),
            columnHelper.display({
                id: 'actions',
                cell: (info) => (
                    <div className="flex items-center">
                        <button
                            type="button"
                            className="relative mr-2 px-4 py-2 bg-orange-400 text-white hover:visible z-10 pointer-events-auto"
                            onClick={() => handleEdit(info.row.original)}
                        >
                            <PencilIcon className="h-5 w-5 mr-1" />
                        </button>
                        <button
                            className="relative mr-2 px-4 py-2 bg-red-600 text-white hover:visible z-10 pointer-events-auto"
                            onClick={() => handleDelete(info.row.original)}
                        >
                            <TrashIcon className="h-5 w-5 mr-1" />
                        </button>
                    </div>
                ),
            }),
        ],
        []
    );

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            sorting,
            pagination
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
    });

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
                    <button
                        type="submit"
                        className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-5 mr-[60px]"
                        onClick={searchUserByUsername}
                    >
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                </div>
                <div className="flex flex-row-reverse mb-2 mr-5">
                    <CreateUserModel onSuccess={createUser} />
                </div>
            </div>
            <table className="table-auto w-full border-spacing-2">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className="bg-gray-50">
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="px-6 py-3 text-left text-black font-medium text-gray-500 uppercase tracking-wider">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    <span>
                                        {header.column.accessorFn && (
                                            <button
                                                onClick={() => {
                                                    const isDesc = sorting.some(sort => sort.id === header.column.id && sort.desc);
                                                    setSorting(prevSorting => [
                                                        { id: header.column.id, desc: !isDesc },
                                                    ]);
                                                }}
                                                aria-label={`Toggle sorting for ${header.column.columnDef.header}`}
                                            >
                                                {sorting.some(sort => sort.id === header.column.id && sort.desc)
                                                    ? ' 🔽'
                                                    : ' 🔼'}
                                            </button>
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="text-slate-950">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <EditUserModal
                user={selectedUser}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={updateUser}
            />
            <DeleteUserModal
                username={selectedUser ? selectedUser.username : ""}
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onDelete={deleteUser}
            />
        </div>
    );
};
export default UserTable;
