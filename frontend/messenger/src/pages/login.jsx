import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {MessageCircle,Mail,Lock,Eye,EyeOff,Globe} from "lucide-react";

import { loginUser } from "../service/authService";
import "../styles/auth.css";

function Login() {
const navigate = useNavigate();

const [showPassword, setShowPassword] = useState(false);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

function handleGoogleLogin() {
const apiUrl = import.meta.env.VITE_API_URL;
window.location.href = `${apiUrl}/user/google`;
}

async function handleLogin(event) {
event.preventDefault();
setError("");

try {
  setLoading(true);

  const result = await loginUser(email.trim(), password);

  // Save the JWT token returned by the backend.
  localStorage.setItem("token", result.token);

  // Save the logged-in user's information.
  localStorage.setItem("user", JSON.stringify(result.user));

  // Navigate to the Home page.
  // Navigate based on the user's role.
if (result.user.role === "admin") {
navigate("/admin");
} else {
navigate("/home");
}

} catch (err) {
  console.error("Login error:", err);
  console.error("Backend response:", err.response?.data);

  setError(
    err.response?.data?.message ||
      "Login failed. Please check your email and password."
  );
} finally {
  setLoading(false);
}

}

return ( <div className="auth-page"> <div className="auth-card"> <div className="auth-logo"> <MessageCircle size={30} /> </div>

    <h1>Welcome Back!</h1>

    <p className="auth-subtitle">
      Sign in to continue your conversations.
    </p>

    <form className="auth-form" onSubmit={handleLogin}>
      <label htmlFor="email">Email Address</label>

      <div className="input-box">
        <Mail size={19} />

        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <label htmlFor="password">Password</label>

      <div className="input-box">
        <Lock size={19} />

        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          autoComplete="current-password"
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

      {error && (
        <p className="form-message error-message" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="auth-button"
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>

    <div className="auth-divider">
      <span>OR CONTINUE WITH</span>
    </div>

    <button
      type="button"
      className="google-button"
      onClick={handleGoogleLogin}
    >
      <Globe size={20} />
      Continue with Google
    </button>

    <p className="auth-footer">
      New here? <Link to="/register">Create an account</Link>
    </p>
  </div>

  <p className="auth-bottom-text">
    Connect. Chat. Stay Close.
  </p>
</div>


);
}

export default Login;
