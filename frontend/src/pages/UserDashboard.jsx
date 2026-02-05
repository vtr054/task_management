import Layout from '../components/Layout';
import { useGetTasksQuery, useUpdateTaskMutation } from '../slices/tasksApiSlice';
import { CheckCircle, Circle, Clock, CheckSquare, Briefcase, Calendar } from 'lucide-react';

const UserDashboard = () => {
    // Fetch all assigned tasks (no projectId param)
    const { data: tasks, isLoading, error } = useGetTasksQuery();
    const [updateTask] = useUpdateTaskMutation();

    const handleStatusChange = async (task, newStatus) => {
        try {
            await updateTask({ id: task.id, status: newStatus }).unwrap();
        } catch (err) {
            console.error(err);
        }
    };

    const TaskCard = ({ task }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 group flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${task.status === 'Done' ? 'bg-green-50 text-green-700 border-green-100' :
                        task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            'bg-yellow-50 text-yellow-700 border-yellow-100'
                    }`}>
                    {task.status}
                </span>
                <div className="text-xs text-gray-400 flex items-center bg-gray-50 px-2 py-1 rounded-md">
                    <Calendar size={12} className="mr-1.5" />
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'}
                </div>
            </div>

            <h3 className={`text-lg font-bold mb-2 transition-colors ${task.status === 'Done' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                {task.title}
            </h3>
            <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">{task.description || 'No description provided.'}</p>

            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500 font-medium">
                    <Briefcase size={14} className="mr-1.5 text-indigo-500" />
                    <span className="truncate max-w-[100px]">{task.project?.name || 'Project'}</span>
                </div>

                <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                    className="p-1.5 pl-2 pr-6 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 hover:bg-white cursor-pointer transition-colors appearance-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.25rem center',
                        backgroundSize: '1em'
                    }}
                >
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
                <p className="text-gray-500 mt-2">Track your progress and update task status</p>
            </div>

            {isLoading ? <p className="text-center p-8 text-gray-500">Loading tasks...</p> : error ? <p className="text-center p-8 text-red-500">Error loading tasks</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tasks?.map(task => <TaskCard key={task.id} task={task} />)}

                    {tasks?.length === 0 && (
                        <div className="col-span-full py-24 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                            <div className="mx-auto bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                                <CheckSquare className="text-green-500" size={40} />
                            </div>
                            <h3 className="text-xl font-medium text-gray-800">All caught up!</h3>
                            <p className="text-gray-500 mt-2">You don't have any assigned tasks currently.</p>
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
};

export default UserDashboard;
