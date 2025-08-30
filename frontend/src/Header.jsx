import { Link, useNavigate } from "react-router-dom";
import "./theme.css";

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div
      className="header"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link
        to="/"
        style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}
      >
        Course System
      </Link>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: "1rem" }}>
              Hi, {user.name} ({role})
            </span>
            {role === "admin" && (
              <Link
                to="/admin"
                className="button"
                style={{
                  marginRight: "1rem",
                  background: "var(--primary-green)",
                }}
              >
                Admin Panel
              </Link>
            )}
            <button
              className="button"
              style={{ background: "var(--primary-orange)" }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="button"
              style={{ marginRight: "1rem" }}
            >
              Login
            </Link>
            <Link to="/signup" className="button">
              Signup
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
