import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BiUser, BiLock } from 'react-icons/bi';
import { motion } from 'framer-motion';
import Lottie from 'react-lottie-segments';
import loginAnimation from '../assets/login.json';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const animationContainerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loginAnimation,
    renderer: 'svg',
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
      progressiveLoad: true,
    },
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  };
  const lottieVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeInOut', delay: 0.2 } },
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 to-black flex items-center justify-center overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-screen-xl mx-auto rounded-2xl overflow-hidden lg:grid lg:grid-cols-2 shadow-2xl"
        style={{ boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)' }}
      >
        {/* Login Form Section (Left Side) */}
        <motion.div
          variants={formVariants}
          className="px-8 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 flex flex-col justify-center "
        >
          <div className="mb-10">
            <svg
              className="w-16 h-16 mx-auto mb-8 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h2 className="text-4xl font-semibold tracking-tight text-white font-serif mb-3">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-lg font-light">
              Sign in to access your admin dashboard.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded relative mb-6"
              role="alert"
            >
              <strong className="font-semibold">Error:</strong>
              <span className="block sm:inline ml-1">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">
                <BiUser className="inline-block mr-2 align-middle text-gray-400 text-lg" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full text-lg rounded-md py-3 px-4 transition-colors duration-300
                                            focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-700 text-white border-gray-600"
                required
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-2">
                <BiLock className="inline-block mr-2 align-middle text-gray-400 text-lg" />
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full text-lg rounded-md py-3 px-4 transition-colors duration-300
                                            focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-gray-700 text-white border-gray-600"
                required
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-yellow-500 hover:text-yellow-700 focus:outline-none focus:underline transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-black bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-300
                                            disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Lottie Animation Section (Right Side) */}
        <motion.div
          variants={lottieVariants}
          className="relative hidden lg:flex items-center justify-center"
          ref={animationContainerRef}
        >
          <Lottie
            options={defaultOptions}
            height="450px"
            width="450px"
          />
          <div className="absolute inset-0 opacity-60"></div>
          <div className="absolute bottom-12 left-12 text-left">
            <h3 className="text-2xl font-semibold text-white font-serif">Subitimes Admin Panel</h3>
            <p className="text-gray-400 text-lg">Secure access for administrators.</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
export default Login;