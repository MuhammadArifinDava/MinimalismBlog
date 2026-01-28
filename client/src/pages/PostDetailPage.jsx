import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "../lib/api";
import { useAuth } from "../context/useAuth";
import { Container } from "../components/Container";
import { Alert } from "../components/Alert";
import { Spinner } from "../components/Spinner";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getRandomImage(id) {
  return `https://picsum.photos/seed/${id}/1200/600`;
}

function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [postState, setPostState] = useState({ loading: true, error: "", post: null });
  const [commentsState, setCommentsState] = useState({ loading: true, error: "", items: [] });
  const [commentInput, setCommentInput] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);
  const [commentEditId, setCommentEditId] = useState("");
  const [commentEditText, setCommentEditText] = useState("");

  const isOwner = useMemo(() => {
    if (!user || !postState.post?.author?._id) return false;
    return String(user._id) === String(postState.post.author._id);
  }, [user, postState.post]);

  const loadPost = useCallback(() => {
    setPostState((s) => ({ ...s, loading: true, error: "" }));
    return api
      .get(`/posts/${id}`)
      .then((res) => setPostState({ loading: false, error: "", post: res.data.post }))
      .catch((err) => {
        const message = err?.response?.data?.message || "Server error";
        setPostState({ loading: false, error: message, post: null });
      });
  }, [id]);

  const loadComments = useCallback(() => {
    setCommentsState((s) => ({ ...s, loading: true, error: "" }));
    return api
      .get(`/posts/${id}/comments`)
      .then((res) => setCommentsState({ loading: false, error: "", items: res.data.items || [] }))
      .catch((err) => {
        const message = err?.response?.data?.message || "Server error";
        setCommentsState({ loading: false, error: message, items: [] });
      });
  }, [id]);

  useEffect(() => {
    let alive = true;
    Promise.all([loadPost(), loadComments()]).finally(() => {
      if (!alive) return;
    });
    return () => {
      alive = false;
    };
  }, [loadComments, loadPost]);

  const onDeletePost = async () => {
    const ok = window.confirm("Are you sure you want to delete this post?");
    if (!ok) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate("/");
    } catch (err) {
      const message = err?.response?.data?.message || "Server error";
      setPostState((s) => ({ ...s, error: message }));
    }
  };

  const onCreateComment = async (e) => {
    e.preventDefault();
    const content = commentInput.trim();
    if (!content) return;
    setCommentBusy(true);
    try {
      await api.post(`/posts/${id}/comments`, { content });
      setCommentInput("");
      await loadComments();
    } catch (err) {
      const message = err?.response?.data?.message || "Server error";
      setCommentsState((s) => ({ ...s, error: message }));
    } finally {
      setCommentBusy(false);
    }
  };

  const startEditComment = (comment) => {
    setCommentEditId(comment._id);
    setCommentEditText(comment.content || "");
  };

  const cancelEditComment = () => {
    setCommentEditId("");
    setCommentEditText("");
  };

  const onUpdateComment = async (e) => {
    e.preventDefault();
    const content = commentEditText.trim();
    if (!content) return;

    try {
      await api.put(`/comments/${commentEditId}`, { content });
      setCommentEditId("");
      setCommentEditText("");
      await loadComments();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update comment");
    }
  };

  const onDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      await loadComments();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete comment");
    }
  };

  if (postState.loading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (postState.error)
    return (
      <Container>
        <div className="py-8">
          <Alert>{postState.error}</Alert>
        </div>
      </Container>
    );
  if (!postState.post)
    return (
      <Container>
        <div className="py-8">
          <Alert>Post not found</Alert>
        </div>
      </Container>
    );

  const { post } = postState;

  return (
    <div className="bg-white pb-20">
      <div className="h-[40vh] w-full overflow-hidden bg-slate-900 relative">
        <img
          src={getRandomImage(post._id)}
          alt={post.title}
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <Container>
            <div className="max-w-3xl mx-auto">
              <span className="inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 mb-4">
                {post.category ? post.category : "Article"}
              </span>
              <h1 className="text-3xl font-bold text-white sm:text-5xl leading-tight mb-4">
                {post.title}
              </h1>
            </div>
          </Container>
        </div>
      </div>

      <Container>
        <div className="card-3d shine surface mx-auto max-w-3xl -mt-8 relative z-10 p-8 rounded-3xl transition hover:shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-8 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {post.author?.username?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{post.author?.username}</p>
                <p className="text-sm text-slate-500">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            {isOwner ? (
              <div className="flex items-center gap-2">
                <Link
                  to={`/edit/${post._id}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Edit Post
                </Link>
                <button
                  onClick={onDeletePost}
                  className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
                >
                  Delete Post
                </button>
              </div>
            ) : null}
          </div>

          <article className="prose prose-lg prose-indigo max-w-none text-slate-600">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </article>

          <div className="mt-16 border-t border-slate-200 pt-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">
              Comments ({commentsState.items.length})
            </h2>

            {commentsState.error ? (
              <div className="mb-6">
                <Alert>{commentsState.error}</Alert>
              </div>
            ) : null}

            {isAuthenticated ? (
              <form onSubmit={onCreateComment} className="mb-10 flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-600 font-bold">
                  {user.username.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="w-full rounded-xl border-slate-200 p-4 text-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[100px]"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={commentBusy || !commentInput.trim()}
                      className="rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-all"
                    >
                      {commentBusy ? "Posting..." : "Post Comment"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="rounded-xl bg-slate-50 p-6 text-center mb-10">
                <p className="text-slate-600">
                  Please{" "}
                  <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                    log in
                  </Link>{" "}
                  to join the discussion.
                </p>
              </div>
            )}

            {commentsState.loading ? (
              <Spinner />
            ) : (
              <div className="space-y-8">
                {commentsState.items.map((comment) => {
                  const isCommentOwner =
                    user && String(comment.author?._id) === String(user._id);
                  const isEditing = commentEditId === comment._id;

                  return (
                    <div key={comment._id} className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold text-sm">
                        {comment.author?.username?.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-slate-900 text-sm">
                            {comment.author?.username}
                          </p>
                          <time className="text-xs text-slate-400">
                            {formatDate(comment.createdAt)}
                          </time>
                        </div>

                        {isEditing ? (
                          <form onSubmit={onUpdateComment} className="mt-2">
                            <textarea
                              value={commentEditText}
                              onChange={(e) => setCommentEditText(e.target.value)}
                              className="w-full rounded-md border-slate-300 text-sm p-2"
                              rows={3}
                            />
                            <div className="mt-2 flex gap-2">
                              <button
                                type="submit"
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditComment}
                                className="text-xs font-medium text-slate-500 hover:text-slate-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div className="text-slate-700 text-sm leading-relaxed">
                            {comment.content}
                          </div>
                        )}

                        {isCommentOwner && !isEditing ? (
                          <div className="mt-2 flex gap-3">
                            <button
                              onClick={() => startEditComment(comment)}
                              className="text-xs font-medium text-slate-500 hover:text-indigo-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDeleteComment(comment._id)}
                              className="text-xs font-medium text-slate-500 hover:text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default PostDetailPage;
