import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate(userInfo?.role === 'Admin' ? '/admin' : userInfo?.role === 'Manager' ? '/manager' : '/user')}>
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <LayoutDashboard className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            TaskFlow
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        {userInfo && (
                            <>
                                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                                    <div className="bg-indigo-100 p-1.5 rounded-full">
                                        <User size={18} className="text-indigo-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-700 leading-tight">{userInfo.name}</span>
                                        <span className="text-xs text-indigo-500 font-medium leading-tight">{userInfo.role}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={logoutHandler}
                                    className="flex items-center text-gray-500 hover:text-red-600 transition-colors duration-200"
                                    title="Logout"
                                >
                                    <LogOut size={22} />
                                </button>
                            </>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t p-4 space-y-4">
                    {userInfo && (
                        <>
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <User size={20} className="text-indigo-600" />
                                <div>
                                    <p className="font-semibold">{userInfo.name}</p>
                                    <p className="text-xs text-indigo-500">{userInfo.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={logoutHandler}
                                className="w-full flex items-center justify-center space-x-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100"
                            >
                                <LogOut size={18} /> <span>Logout</span>
                            </button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout;
