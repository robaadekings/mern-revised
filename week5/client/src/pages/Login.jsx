import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {registerUser} from  "../services/api";

export default function Login( {setUser}) {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            const res = await registerUser(username);
            setUser(res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join chat');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-slate-800 backdrop-blur-xl bg-opacity-80 rounded-2xl shadow-2xl border border-slate-700 p-8">
                    {/* Header */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gradient-to-br from-blue-400 to-purple-500 p-4 rounded-xl shadow-lg text-white text-4xl">
                            💬
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold text-center text-white mb-2">ChatHub</h1>
                    <p className="text-center text-slate-400 mb-8">Connect, Chat, and Collaborate</p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
                            <p className="text-red-300 text-sm font-semibold">{error}</p>
                        </div>
                    )}

                    {/* Input Field */}
                    <div className="mb-6">
                        <label className="block text-slate-300 text-sm font-semibold mb-2">Username</label>
                        <input 
                            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter your username" 
                            value={username} 
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (error) setError('');
                            }}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Joining...</span>
                            </>
                        ) : (
                            <>
                                <span>Join ChatHub</span>
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </>
                        )}
                    </button>

                    {/* Features List */}
                    <div className="mt-8 pt-8 border-t border-slate-700">
                        <p className="text-slate-400 text-xs uppercase tracking-widest font-semibold mb-4">Features</p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span className="text-slate-300 text-sm">Real-time messaging</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span className="text-slate-300 text-sm">Typing indicators</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                                <span className="text-slate-300 text-sm">Multiple chat rooms</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Text */}
                <p className="text-center text-slate-500 text-xs mt-6">
                    Create a username to get started. No password needed!
                </p>
            </div>
        </div>
    )
}