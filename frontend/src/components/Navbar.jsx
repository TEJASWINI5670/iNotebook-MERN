import { Link, useNavigate } from "react-router";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(sessionStorage.getItem("token"));

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link className="navbar-brand" to="/" aria-label="iNotebook home">
        <span className="navbar-logo" aria-hidden="true">iN</span>
        <span>iNotebook</span>
      </Link>

      <nav aria-label="Account navigation">
        {isAuthenticated ? (
          <button className="navbar-button navbar-logout" type="button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link className="navbar-button navbar-login" to="/login">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
