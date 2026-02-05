import Layout from '../components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProjectQuery } from '../slices/projectsApiSlice';
import { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from '../slices/tasksApiSlice';
import { useState } from 'react';
import { CheckCircle, Circle, Clock, Trash2, Edit, ArrowLeft, Plus, Calendar, User, X } from 'lucide-react';
import { useGetUsersQuery } from '../slices/usersApiSlice';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: project, isLoading: projectLoading } = useGetProjectQuery(id);
    const { data: tasks, isLoading: tasksLoading } = useGetTasksQuery(id);
    const { data: users } = useGetUsersQuery(); // For assignment

    const [createTask] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();

    const [modalOpen, setModalOpen] = useState(false);
    const [taskData, setTaskData] = useState({ title: '', description: '', status: 'Todo', dueDate: '', assignedTo: '' });

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await createTask({ ...taskData, projectId: id }).unwrap();
            setModalOpen(false);
            setTaskData({ title: '', description: '', status: 'Todo', dueDate: '', assignedTo: '' });
        } catch (err) {
            console.error(err);
            alert('Error creating task');
        }
    };

    const handleStatusChange = async (task, newStatus) => {
        try {
            await updateTask({ id: task.id, status: newStatus }).unwrap();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Delete this task?')) {
            await deleteTask(taskId);
        }
    };

    if (projectLoading || tasksLoading) return <Layout><div className="flex items-center justify-center h-64 text-gray-500">Loading project details...</div></Layout>;
    if (!project) return <Layout><div className="text-center p-8 text-red-500">Project not found</div></Layout>;

    return (
        <Layout>
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-gray-500 hover:text-indigo-600 transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Back to Projects
                </button>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-3">{project.name}</h1>
                            <p className="text-gray-500 text-lg leading-relaxed max-w-3xl">{project.description}</p>
                        </div>
                        <span className={`px-4 py-1.5 text-sm font-semibold rounded-full border ${project.status === 'Active' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                            {project.status}
                        </span>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Project Tasks</h2>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="flex items-center bg-indigo-600 text-white px-5 py-2.5 rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all"
                    >
                        <Plus size={20} className="mr-2" /> Add Task
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {tasks?.map(task => (
                        <div key={task.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex justify-between items-center">
                            <div className="flex items-start">
                                <button className={`mt-1 mr-4 ${task.status === 'Done' ? 'text-green-500' : 'text-gray-300 hover:text-indigo-500'}`}>
                                    {task.status === 'Done' ? <CheckCircle size={24} /> : <Circle size={24} />}
                                </button>

                                <div>
                                    <h3 className={`text-lg font-bold ${task.status === 'Done' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                        {task.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1 mb-2">{task.description}</p>

                                    <div className="flex items-center space-x-4 text-xs font-medium text-gray-400">
                                        <span className="flex items-center"><Calendar size={12} className="mr-1.5" /> {task.dueDate || 'No Date'}</span>
                                        <span className="flex items-center text-indigo-500"><User size={12} className="mr-1.5" /> {task.assignee?.name || 'Unassigned'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task, e.target.value)}
                                    className="p-2 border border-gray-200 rounded-lg text-sm bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer"
                                >
                                    <option value="Todo">Todo</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                                <button onClick={() => handleDeleteTask(task.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {tasks?.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500">No tasks created yet for this project.</p>
                        </div>
                    )}
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-lg text-gray-800">Add New Task</h3>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateTask} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        value={taskData.title}
                                        onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                                        required
                                        placeholder="e.g. Design Homepage"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                                    <select
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all"
                                        value={taskData.assignedTo}
                                        onChange={(e) => setTaskData({ ...taskData, assignedTo: e.target.value })}
                                    >
                                        <option value="">Select Member...</option>
                                        {users?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-gray-600"
                                        value={taskData.dueDate}
                                        onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        placeholder="Detailed explanation of the task..."
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none transition-all"
                                        value={taskData.description}
                                        onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button type="button" onClick={() => setModalOpen(false)} className="mr-3 px-5 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">Cancel</button>
                                <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all font-medium">Save Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default ProjectDetails;
