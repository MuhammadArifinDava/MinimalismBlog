import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { Container } from "../components/Container";
import { Alert } from "../components/Alert";
import { Spinner } from "../components/Spinner";
import { useAuth } from "../context/useAuth";

function ProfilePage() {
  const { user, refreshMe } = useAuth();
  const [state, setState] = useState({ loading: true, error: "", posts: [] });
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const fileRef = useRef(null);

  const avatarUrl = useMemo(() => {
    const path = user?.avatarPath || "";
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = import.meta.env.VITE_API_URL || "http://localhost:5001";
    return `${base}${path}`;
  }, [user?.avatarPath]);

  useEffect(() => {
    let alive = true;
    setState({ loading: true, error: "", posts: [] });
    api
      .get("/users/me")
      .then((res) => {
        if (!alive) return;
        setState({ loading: false, error: "", posts: res.data.posts || [] });
      })
      .catch((err) => {
        if (!alive) return;
        const message = err?.response?.data?.message || "Server error";
        setState({ loading: false, error: message, posts: [] });
      });
    refreshMe().catch(() => {});
    return () => {
      alive = false;
    };
  }, [refreshMe]);

  const onPickAvatar = () => {
    setAvatarError("");
    fileRef.current?.click();
  };

  const onAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarBusy(true);
    setAvatarError("");
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      await api.post("/users/me/avatar", formData);
      await refreshMe();
    } catch (err) {
      const message = err?.response?.data?.message || "Server error";
      setAvatarError(message);
    } finally {
      setAvatarBusy(false);
      e.target.value = "";
    }
  };

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-2xl font-semibold">Profile</h1>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-md">
                  <div className="h-full w-full overflow-hidden rounded-2xl bg-white">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-700 font-bold">
                        {(user?.username || "U").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={onAvatarChange}
                  className="hidden"
                />
              </div>
              <div>
                <div className="text-sm text-slate-500">Signed in as</div>
                <div className="text-lg font-semibold text-slate-900">
                  {user?.name || user?.username || "-"}
                </div>
                <div className="text-sm text-slate-600">{user?.email || "-"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPickAvatar}
                disabled={avatarBusy}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                {avatarBusy ? "Uploading..." : "Change Photo"}
              </button>
            </div>
          </div>
          {avatarError ? (
            <div className="mt-4">
              <Alert>{avatarError}</Alert>
            </div>
          ) : null}
        </div>

        <h2 className="mt-8 text-lg font-semibold">My Posts</h2>

        {state.error ? (
          <div className="mt-3">
            <Alert>{state.error}</Alert>
          </div>
        ) : null}

        {state.loading ? (
          <div className="mt-3">
            <Spinner />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {state.posts.length === 0 ? (
              <div className="surface rounded-2xl p-6 text-sm text-slate-600">
                You haven’t created any posts yet.
              </div>
            ) : null}
            {state.posts.map((p) => (
              <div key={p._id} className="card-3d shine surface rounded-2xl p-5 transition hover:shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{p.title}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/posts/${p._id}`}
                      className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                    >
                      View
                    </Link>
                    <Link
                      to={`/edit/${p._id}`}
                      className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

export default ProfilePage;
