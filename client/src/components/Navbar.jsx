import { useMemo } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Container } from "./Container";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = useMemo(() => {
    const path = user?.avatarPath || "";
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = import.meta.env.VITE_API_URL || "http://localhost:5001";
    return `${base}${path}`;
  }, [user?.avatarPath]);

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "rounded-full bg-slate-900/5 px-4 py-2 text-slate-900"
      : "rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-900";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight text-slate-900 transition hover:opacity-90"
          >
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Blog
            </span>
            <span className="ml-1">Platform</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm font-semibold">
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/create" className={linkClass}>
                  Create
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-2 rounded-full bg-slate-900/5 px-4 py-2 text-slate-900"
                      : "flex items-center gap-2 rounded-full px-4 py-2 text-slate-600 transition hover:bg-slate-900/5 hover:text-slate-900"
                  }
                >
                  <div className="h-7 w-7 overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px]">
                    <div className="h-full w-full overflow-hidden rounded-full bg-white">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-50 text-[11px] text-slate-700">
                          {(user?.username || "U").slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="hidden sm:inline">{user?.username || "Profile"}</span>
                </NavLink>
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-full bg-slate-900 px-4 py-2 text-white shadow-md transition hover:bg-slate-800 hover:shadow-lg"
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
