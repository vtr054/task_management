import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { LayoutDashboard, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading, error }] = useLoginMutation();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            if (userInfo.role === 'Admin') navigate('/admin');
            else if (userInfo.role === 'Manager') navigate('/manager');
            else navigate('/user');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ email, password }).unwrap();
            dispatch(setCredentials({ ...res }));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01]">
                <div className="flex justify-center mb-8">
                    <div className="bg-indigo-100 p-3 rounded-full">
                        <LayoutDashboard className="text-indigo-600 w-8 h-8" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Welcome Back</h1>
                <p className="text-center text-gray-500 mb-8">Sign in to manage your projects</p>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r shadow-md animate-pulse">
                        <p className="font-bold">Error</p>
                        <p>{error?.data?.message || 'Invalid credentials'}</p>
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input
                            type="password"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center group"
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </span>
                        ) : (
                            <span className="flex items-center">
                                Sign In <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        )}
                    </button>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="text-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 font-mono">
                            <p className="mb-1">Demo Admin Access</p>
                            <p>admin@example.com / admin123</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
