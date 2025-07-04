import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import '../css/Login.css';

function Login() {
  const [username, setUsername] = useState(''); // Changed from email to username to match backend
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Login attempted with:', { username, password });
      
      // Call the backend API
      const response = await loginUser(username, password);
      console.log('Login successful:', response);
      
      // Navigate to home page on successful login
      navigate('/');
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-input"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          className="form-input"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        
        {error && (
          <div className="error-message" style={{
            color: 'red',
            marginBottom: '15px',
            padding: '10px',
            border: '1px solid red',
            borderRadius: '4px',
            backgroundColor: '#ffe6e6',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <button 
          type="submit"
          className="form-button" 
          disabled={loading}
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        
        <div className="text-center mt-4">
          <button 
            type="button"
            className="nav-link text-sm" 
            onClick={() => navigate('/forgot-password')}
            disabled={loading}
          >
            Forgot Password?
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-sm">
            Don't have an account?{' '}
            <button 
              type="button"
              className="nav-link" 
              onClick={() => navigate('/signup')}
              disabled={loading}
            >
              Sign Up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;