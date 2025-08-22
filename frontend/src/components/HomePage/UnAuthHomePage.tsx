import React from "react";
import { Link } from "react-router-dom";

function UnAuthHomePage() {
  return (
    <div className="unauth-home">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Codiz</h1>
          <p className="hero-subtitle">
            The modern platform for creating, sharing, and taking quizzes.
            Enhance your skills and track your progress with our intuitive
            tools.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="action-button">
              Get Started
            </Link>
            <Link to="/login" className="secondary-button">
              Login
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Admin Controlled</h3>
            <p>
              Admins can easily create and manage question sets, ensuring
              quality and relevance.
            </p>
          </div>
          <div className="feature-card">
            <h3>Track Your Progress</h3>
            <p>
              Users can view their quiz history and scores on their profile to
              track their performance.
            </p>
          </div>
          <div className="feature-card">
            <h3>Modern Interface</h3>
            <p>
              A clean, modern, and user-friendly interface designed for a
              seamless experience.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UnAuthHomePage;
