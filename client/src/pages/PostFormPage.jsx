import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/useAuth";
import { Container } from "../components/Container";
import { Alert } from "../components/Alert";
import { Spinner } from "../components/Spinner";

function PostFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [authorId, setAuthorId] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    let alive = true;
    setLoading(true);
    api
      .get(`/posts/${id}`)
      .then((res) => {
        if (!alive) return;
        setTitle(res.data.post.title || "");
        setContent(res.data.post.content || "");
        setCategory(res.data.post.category || "");
        setAuthorId(res.data.post.author?._id || "");
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        const message = err?.response?.data?.message || "Server error";
        setError(message);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [id, isEdit]);

  const canEdit = !isEdit || (authorId && user?._id && String(authorId) === String(user._id));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const t = title.trim();
    const c = content.trim();
    const cat = category.trim();
    if (!t || !c) {
      setError("Field required");
      return;
    }
    setBusy(true);
    try {
      if (isEdit) {
        const { data } = await api.put(`/posts/${id}`, { title: t, content: c, category: cat });
        navigate(`/posts/${data.post._id}`);
      } else {
        const { data } = await api.post("/posts", { title: t, content: c, category: cat });
        navigate(`/posts/${data.post._id}`);
      }
    } catch (err) {
      const message = err?.response?.data?.message || "Server error";
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  if (!canEdit) {
    return (
      <Container>
        <div className="py-12">
          <div className="surface rounded-3xl p-8">
            <Alert>Unauthorized</Alert>
          </div>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <div className="py-12">
          <div className="surface rounded-3xl p-8">
            <Spinner />
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12">
        <div className="mx-auto max-w-2xl [perspective:1200px]">
          <div className="card-3d shine surface rounded-3xl p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  {isEdit ? "Edit Post" : "Create Post"}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Markdown supported. Title and content are required.
                </p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md" />
            </div>

            {error ? (
              <div className="mt-5">
                <Alert>{error}</Alert>
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-7 space-y-5">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Post title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Category (optional)</label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  placeholder="e.g. Tech, Lifestyle, Travel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  placeholder="Write in Markdown..."
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 hover:shadow-lg disabled:opacity-50"
                >
                  {busy ? "Saving..." : isEdit ? "Save changes" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="rounded-2xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"
                  disabled={busy}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default PostFormPage;
