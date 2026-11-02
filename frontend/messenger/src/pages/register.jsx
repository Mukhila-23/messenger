import { useState } from "react";
import { Link } from "react-router-dom";
import {MessageCircle,User,Mail,Lock,Eye,EyeOff,Globe} from "lucide-react";

import { registerUser } from "../service/authService";
import "../styles/auth.css";

function Register() {
const [showPassword, setShowPassword] = useState(false);
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [message, setMessage] = useState("");

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

async function handleRegister(event) {
event.preventDefault();
setMessage("");
setError("");

try {
  setLoading(true);

  const result = await registerUser(
    name.trim(),
    email.trim(),
    password
  );

  setMessage(result.message || "Account created successfully! You can now sign in.");
  setName("");
  setEmail("");
  setPassword("");
} catch (err) {
  setError(
    err.response?.data?.message ||
    "Registration failed. Please check your details and try again."
  );
} finally {
  setLoading(false);
}


}

function handleGoogleRegister() {
const apiUrl = import.meta.env.VITE_API_URL;
window.location.href = `${apiUrl}/user/google`;
}

return ( <div className="auth-page"> <div className="auth-card"> <div className="auth-logo"> <MessageCircle size={30} /> </div>

    <h1>Create Account</h1>

    <p className="auth-subtitle">
      Join us and start connecting with people.
    </p>

    <form className="auth-form" onSubmit={handleRegister}>
      <label htmlFor="name">Full Name</label>

      <div className="input-box">
        <User size={19} />

        <input
          id="name"
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>

      <label htmlFor="register-email">Email Address</label>

      <div className="input-box">
        <Mail size={19} />

        <input
          id="register-email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <label htmlFor="register-password">Password</label>

      <div className="input-box">
        <Lock size={19} />

        <input
          id="register-password"
          type={showPassword ? "text" : "password"}
          placeholder="Create a password"
          autoComplete="new-password"
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>

      {error && <p className="form-message error-message">{error}</p>}
      {message && <p className="form-message success-message">{message}</p>}

      <button
        type="submit"
        className="auth-button"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>

    <div className="auth-divider">
      <span>OR SIGN UP WITH</span>
    </div>

    <button
      type="button"
      className="google-button"
      onClick={handleGoogleRegister}
    >
      <Globe size={20} />
      Continue with Google
    </button>

    <p className="auth-footer">
      Already have an account? <Link to="/login">Sign in</Link>
    </p>
  </div>

  <p className="auth-bottom-text">
    Connect. Chat. Stay Close.
  </p>
</div>


);
}

export default Register;
