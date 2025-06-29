import { useAuth } from '../contexts/AuthContext';
import { Header } from '../components/Header';
import { IdentityCard } from '../components/IdentityCard';
import { ChartSection } from '../components/xrplUawChart';
import { NoticeNow } from '../components/NoticeNow';
import { ProjectTable } from '../components/appList';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MainPage = () => {
  const { isAuthenticated, login, register } = useAuth();
  const [loginForm, setLoginForm] = useState({
    id: '',
    password: ''
  });
  const [registerForm, setRegisterForm] = useState({
    id: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(loginForm.id, loginForm.password);
    } catch (err) {
      setError('Invalid ID or password');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(registerForm.id, registerForm.password);
      setIsRegisterOpen(false);
    } catch (err) {
      setError('Registration failed. ID might already exist.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 lg:px-40 py-6">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Stats Card */}
          <div className="flex align-center justify-center">
            {isAuthenticated ? (
              <IdentityCard />
            ) : (
              <div className="h-[450px] w-[300px] rounded-2xl p-6 bg-gray-900/50 backdrop-blur-sm flex flex-col select-none">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-6">Welcome to XRPL Radar</h2>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label htmlFor="id" className="block text-sm font-medium text-gray-400 mb-1">
                        ID
                      </label>
                      <input
                        type="text"
                        id="id"
                        value={loginForm.id}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, id: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="Enter your ID"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="Enter your password"
                      />
                    </div>
                    {error && (
                      <p className="text-red-500 text-sm">{error}</p>
                    )}
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                    >
                      Login
                    </button>
                  </form>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-800">
                  <p className="text-sm text-gray-400 text-center">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setIsRegisterOpen(true)}
                      className="text-emerald-500 hover:text-emerald-400"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Chart Section */}
          <div className="flex-1">
            <ChartSection />
            <NoticeNow />
          </div>
        </div>

        {/* Project Table */}
        <div className="mt-8">
          <ProjectTable />
        </div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {isRegisterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setIsRegisterOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 w-[400px]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Create Account</h2>
                <button
                  onClick={() => setIsRegisterOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label htmlFor="register-id" className="block text-sm font-medium text-gray-400 mb-1 select-none">
                    ID
                  </label>
                  <input
                    type="text"
                    id="register-id"
                    value={registerForm.id}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, id: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Choose an ID"
                  />
                </div>
                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-gray-400 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="register-password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Create a password"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Confirm your password"
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                >
                  Create Account
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainPage; 