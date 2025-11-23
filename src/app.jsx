import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdvocateWebsite from './components/AdvocateWebsite';
import AdminDashboard from './components/AdminDashboard';
import { getCurrentUser, signIn } from './lib/supabase';
import { LogIn } from 'lucide-react';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error: loginError } = await signIn(email, password);
    setLoading(false);
    if (loginError) {
      setError(loginError.message);
    } else if (data.user) {
      onLogin(data.user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-5 backdrop-blur-md p-8 rounded-xl border border-white border-opacity-10 max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <LogIn className="w-8 h-8 text-black" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Admin Login</h2>
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-500"
              required
            />
          </div>
          <div>
            <label className="block text-white text-sm font-semibold mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-semibold transition-colors shadow-lg shadow-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm mt-4">
          Secure access for authorized personnel only
        </p>
      </div>
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdvocateWebsite />} />
        <Route
          path="/admin"
          element={
            user ? (
              <AdminDashboard onLogout={() => setUser(null)} />
            ) : (
              <LoginPage onLogin={setUser} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;