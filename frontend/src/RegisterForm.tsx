// frontend/src/RegisterForm.tsx
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link

function RegisterForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/users/create", { name, email, password })
      .then(() => {
        alert("User registered successfully!");
      })
      .catch((error) => {
        alert(error?.response?.data?.message || "An error occurred");
      });
  };

  return (
    <div className="form-layout">
      <h1 className="page-title">Create Account</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
            Register
          </button>
        </div>
      </form>
      <div className="form-footer-link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
export default RegisterForm;
