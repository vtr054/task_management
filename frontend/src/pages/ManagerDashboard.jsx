import Layout from '../components/Layout';
import { useGetProjectsQuery, useCreateProjectMutation, useDeleteProjectMutation } from '../slices/projectsApiSlice';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Folder, Trash2, ArrowRight, X, Clock, CheckCircle, LayoutGrid, List } from 'lucide-react';

const ManagerDashboard = () => {
    const { data: projects, isLoading, error } = useGetProjectsQuery();
    const [createProject] = useCreateProjectMutation();
    const [deleteProject] = useDeleteProjectMutation();

    const [modalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', status: 'Active' });

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createProject(formData).unwrap();
            setModalOpen(false);
            setFormData({ name: '', description: '', status: 'Active' });
        } catch (err) {
            console.error(err);
            alert('Error creating project');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this project?')) {
            await deleteProject(id);
        }
    }

    return (
        <Layout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Manager Dashboard</h1>
                    <p className="text-gray-500 mt-1">Oversee your team's projects</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                    <Plus size={20} className="mr-2" /> New Project
                </button>
            </div>

            {isLoading ? <p className="text-center text-gray-500 p-8">Loading projects...</p> : error ? <p className="text-center text-red-500">Error loading projects</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleDelete(project.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                                    <Trash2 size={20} />
                                </button>
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3.5 rounded-2xl ${project.status === 'Active' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'}`}>
                                    {project.status === 'Active' ? <Clock size={24} /> : <CheckCircle size={24} />}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                            <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">{project.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${project.status === 'Active' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                    {project.status}
                                </span>
                                <Link to={`/manager/project/${project.id}`} className="flex items-center text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors group/link">
                                    View Details <ArrowRight size={16} className="ml-1 transition-transform group-hover/link:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div className="col-span-full py-24 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                            <div className="mx-auto bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                                <Folder className="text-gray-300" size={40} />
                            </div>
                            <h3 className="text-xl font-medium text-gray-800">No projects yet</h3>
                            <p className="text-gray-500 mt-2">Create your first project to get started</p>
                            <button onClick={() => setModalOpen(true)} className="mt-6 text-indigo-600 font-medium hover:underline">Create Project</button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-lg text-gray-800">Create New Project</h3>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="e.g. Website Redesign"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none transition-all"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Briefly describe the project goals..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Status</label>
                                <select
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                            <div className="pt-4 flex space-x-3">
                                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-medium shadow-lg hover:shadow-xl">Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ManagerDashboard;
