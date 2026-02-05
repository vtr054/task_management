import Layout from '../components/Layout';
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation, useRegisterMutation } from '../slices/usersApiSlice';
import { useState } from 'react';
import { Trash2, Edit, Plus, UserPlus, Shield, X, Mail, Lock } from 'lucide-react';

const AdminDashboard = () => {
    const { data: users, isLoading, error } = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();
    const [register] = useRegisterMutation();

    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'User' });

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            await deleteUser(id);
        }
    };

    const handleRoleUpdate = async (id, currentRole) => {
        const newRole = prompt('Enter new role (Admin, Manager, User):', currentRole);
        if (newRole && ['Admin', 'Manager', 'User'].includes(newRole)) {
            await updateUser({ id, role: newRole });
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await register(formData).unwrap();
            setModalOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'User' });
        } catch (err) {
            alert(err?.data?.message || err.error);
        }
    };

    const RoleBadge = ({ role }) => {
        const styles = {
            Admin: 'bg-red-100 text-red-700 border-red-200',
            Manager: 'bg-purple-100 text-purple-700 border-purple-200',
            User: 'bg-green-100 text-green-700 border-green-200'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[role] || 'bg-gray-100'}`}>
                {role}
            </span>
        );
    };

    return (
        <Layout>
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage users and system settings</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                    <UserPlus size={20} className="mr-2" /> Add User
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-gray-800">All Users</h2>
                </div>

                {isLoading ? (
                    <div className="p-8 text-center text-gray-500">Loading users...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">Error loading users</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="py-4 px-6 text-left">User</th>
                                    <th className="py-4 px-6 text-left">Role</th>
                                    <th className="py-4 px-6 text-left">Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800">{user.name}</p>
                                                    <p className="text-sm text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <RoleBadge role={user.role} />
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="flex items-center text-green-600 text-sm font-medium">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 shine"></div>
                                                Active
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right space-x-2">
                                            <button
                                                onClick={() => handleRoleUpdate(user.id, user.role)}
                                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                title="Edit Role"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-lg text-gray-800">Add New User</h3>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                                    <input type="email" required className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="john@example.com" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                                    <input type="password" required className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <div className="relative">
                                    <Shield className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                                    <select className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all appearance-none" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                        <option value="User">User</option>
                                        <option value="Manager">Manager</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-medium shadow-lg hover:shadow-xl transform active:scale-95">Create User</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AdminDashboard;
