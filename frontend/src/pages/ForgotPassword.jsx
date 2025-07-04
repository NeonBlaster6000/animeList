import { useState } from 'react';
import '../css/ForgotPassword.css';

function ForgotPassword({ setPage }) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password reset requested for:', { email });
  };

  return (
    <div className="form-container">
      <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
      <div>
        <p className="text-sm text-center mb-4">
          Enter your email to receive a password reset link.
        </p>
        <input
          type="email"
          className="form-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="form-button" onClick={handleSubmit}>
          Send Reset Link
        </button>
        <div className="text-center mt-2">
          <p className="text-sm">
            Back to{' '}
            <button className="nav-link" onClick={() => setPage('login')}>
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;