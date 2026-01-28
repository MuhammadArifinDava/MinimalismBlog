import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Container } from "./Container";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive ? "text-slate-900 font-medium" : "text-slate-600 hover:text-slate-900";

  return (
    <header className="border-b bg-white">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="text-lg font-semibold">
            Blog Platform
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/create" className={linkClass}>
                  Create
                </NavLink>
                <NavLink to="/profile" className={linkClass}>
                  {user?.username || "Profile"}
                </NavLink>
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-800 hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg"
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}

export { Navbar };
