import React from "react";

const teamMembers = [
  {
    name: "Pratyush Badal",
    role: "Lead Developer",
    bio: "The primary architect and developer of this application.",
  },
  {
    name: "Nissan Karki",
    role: "UI/UX Designer",
    bio: "Designed the user interface and experience.",
  },
  {
    name: "Abhinav ",
    role: "Project Manager",
    bio: "Oversees the project and ensures everything runs smoothly.",
  },
  {
    name: "Dikshant Timsina",
    role: "Backend Developer",
    bio: "Responsible for developing and maintaining the server-side logic, databases, and APIs that power the application.",
  },
  {
    name: "Krijal Koju",
    role: "Testing and QA",
    bio: "Ensures the application meets the highest quality standards by rigorously testing for bugs and performance issues.",
  },
];

function AboutUsPage() {
  return (
    <div>
      <h1 className="page-title">About Our Project</h1>

      <div className="about-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to provide a seamless and intuitive platform for
          professionals and admins to manage and take quizzes. We believe in the
          power of continuous learning and assessment, and our goal is to make
          that process as efficient and user-friendly as possible.
        </p>
        <p>
          This application is built with a modern technology stack to ensure it
          is fast, reliable, and scalable.
        </p>
      </div>

      <div className="about-section">
        <h2>Meet the Team</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member-card">
              <h3>{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="member-bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutUsPage;
