// frontend/src/components/LoginForm.tsx
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link

function LoginForm() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/users/login", { email, password })
      .then((response) => {
        localStorage.setItem("accessToken", response.data.accessToken);
        window.location.href = "/";
      })
      .catch((error) => {
        alert(error?.response?.data?.message || "An error occurred");
      });
  };

  return (
    <div className="form-layout">
      <h1 className="page-title">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="button-center">
          <button type="submit" className="grey-button">
            Sign In
          </button>
        </div>
      </form>
      <div className="form-footer-link">
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
export default LoginForm;
