import { NavLink } from "react-router-dom";
import { AuthContext, type IAuthContext } from "../App";
import { useContext } from "react";

function Navbar() {
  const { isAuth, roleState, profilePicture } =
    useContext<IAuthContext>(AuthContext);

  const logoutHandler = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  return (
    <nav className="nav-header">
      <div className="nav-logo">Codiz</div>
      <NavLink to="/" className="nav-link" end>
        Home
      </NavLink>
      <NavLink to="/about" className="nav-link">
        About Us
      </NavLink>
      {isAuth ? (
        <>
          <NavLink to="/profile" className="nav-link">
            Profile
          </NavLink>
          <NavLink to="/questionset/list" className="nav-link">
            Question Set
          </NavLink>
          {roleState === "admin" && (
            <NavLink to="/admin/questionset/create" className="nav-link">
              Create Question Set
            </NavLink>
          )}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            {/* Use the profilePicture from context */}
            {profilePicture && (
              <img
                src={`http://localhost:3000/${profilePicture}`}
                alt="Avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )}
            <button onClick={logoutHandler} className="logout-button">
              Logout
            </button>
          </div>
        </>
      ) : (
        <>
          <NavLink to="/register" className="nav-link">
            Register
          </NavLink>
          <NavLink to="/login" className="nav-link">
            Login
          </NavLink>
        </>
      )}
    </nav>
  );
}

export default Navbar;
