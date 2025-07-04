import { useState } from 'react';
import { registerUser } from '../api/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import '../css/SignUp.css';

function SignUp({ setPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const clearError = () => {
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Registration attempted with:', { email, password });
      const response = await registerUser(email, password);
      console.log('Registration successful:', response);

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000); // Wait before redirect
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          autoComplete="email"
          className="form-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearError();
          }}
          required
          disabled={loading}
        />
        <input
          type="password"
          autoComplete="new-password"
          className="form-input"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            clearError();
          }}
          required
          disabled={loading}
        />
        <small className="text-xs text-gray-500 block mb-2">
          Password must be at least 6 characters
        </small>
        <input
          type="password"
          autoComplete="new-password"
          className="form-input"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            clearError();
          }}
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
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div className="success-message" style={{
            color: 'green',
            marginBottom: '15px',
            padding: '10px',
            border: '1px solid green',
            borderRadius: '4px',
            backgroundColor: '#e6ffea',
            textAlign: 'center',
            fontSize: '14px'
          }}>
            {success}
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
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <div className="text-center mt-2">
          <p className="text-sm">
            Already have an account?{' '}
            <button 
              type="button"
              className="nav-link"
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
