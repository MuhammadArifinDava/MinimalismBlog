import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/useAuth";
import { Container } from "../components/Container";
import { Alert } from "../components/Alert";

function LoginPage() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const em = email.trim();
    const pw = password;
    if (!em || !pw) {
      setError("Field required");
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.post("/auth/login", { email: em, password: pw });
      setToken(data.token);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      const message = err?.response?.data?.message || "Server error";
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container>
      <div className="py-12">
        <div className="mx-auto max-w-md [perspective:1200px]">
          <div className="card-3d shine surface rounded-3xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
                <p className="mt-1 text-sm text-slate-600">Login to continue.</p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md" />
            </div>

            {error ? (
              <div className="mt-5">
                <Alert>{error}</Alert>
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 hover:shadow-lg disabled:opacity-50"
              >
                {busy ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-5 text-sm text-slate-700">
              No account?{" "}
              <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default LoginPage;
