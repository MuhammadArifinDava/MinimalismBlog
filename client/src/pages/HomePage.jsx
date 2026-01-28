import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { Container } from "../components/Container";
import { Alert } from "../components/Alert";
import { Spinner } from "../components/Spinner";
import { Pagination } from "../components/Pagination";

function excerpt(text, max = 100) {
  const value = String(text || "");
  if (value.length <= max) return value;
  return `${value.slice(0, max)}...`;
}

function getRandomImage(id) {
  return `https://picsum.photos/seed/${id}/800/600`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const page = Number.parseInt(searchParams.get("page") || "1", 10) || 1;
  const limit = 9;

  const [input, setInput] = useState(q);
  const [state, setState] = useState({ loading: true, error: "", data: null });

  const params = useMemo(() => ({ q: q || undefined, page, limit }), [q, page]);

  useEffect(() => {
    let alive = true;
    Promise.resolve().then(() => {
      if (!alive) return;
      setState((s) => ({ ...s, loading: true, error: "" }));
    });
    api
      .get("/posts", { params })
      .then((res) => {
        if (!alive) return;
        setState({ loading: false, error: "", data: res.data });
      })
      .catch((err) => {
        if (!alive) return;
        const message = err?.response?.data?.message || "Server error";
        setState({ loading: false, error: message, data: null });
      });
    return () => {
      alive = false;
    };
  }, [params]);

  const onSubmit = (e) => {
    e.preventDefault();
    const next = {};
    const nextQ = input.trim();
    if (nextQ) next.q = nextQ;
    next.page = "1";
    setSearchParams(next);
  };

  const onPageChange = (nextPage) => {
    const next = Object.fromEntries(searchParams.entries());
    next.page = String(nextPage);
    setSearchParams(next);
  };

  const items = state.data?.items || [];
  const totalPages = state.data?.pages || state.data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 py-24 text-center text-white sm:py-32">
        <div className="absolute inset-0 opacity-20">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0 100 C 20 0 50 0 100 100 Z"
              fill="url(#gradient)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
            Discover Great Stories
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Explore insights, trends, and creative ideas from our community.
          </p>
          
          <form onSubmit={onSubmit} className="mt-10 mx-auto max-w-xl relative">
             <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search articles..."
              className="w-full rounded-full border-0 bg-white/10 px-6 py-4 text-white placeholder-slate-400 backdrop-blur-sm ring-1 ring-inset ring-white/20 focus:bg-white/20 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
            />
             <button
              type="submit"
              className="absolute right-2 top-2 rounded-full bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <Container>
        {state.error ? (
          <div className="mt-8">
            <Alert>{state.error}</Alert>
          </div>
        ) : null}

        {state.loading ? (
          <div className="mt-20 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="mt-12">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <p className="text-lg text-slate-500">No posts found.</p>
                {q && (
                  <button 
                    onClick={() => {
                      setInput("");
                      setSearchParams({});
                    }}
                    className="mt-4 text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 [perspective:1200px]">
                {items.map((post) => (
                  <article
                    key={post._id}
                    className="card-3d shine group flex flex-col overflow-hidden rounded-2xl surface transition hover:shadow-xl"
                  >
                    <div className="relative h-48 overflow-hidden bg-slate-200">
                      <img
                        src={getRandomImage(post._id)}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-x-4 text-xs">
                        <time dateTime={post.createdAt} className="text-slate-500">
                          {formatDate(post.createdAt)}
                        </time>
                        <span className="relative z-10 rounded-full bg-slate-50 px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-100">
                          {post.category ? post.category : "Article"}
                        </span>
                      </div>
                      <div className="group relative mt-4 flex-1">
                        <h3 className="text-xl font-semibold leading-6 text-slate-900 group-hover:text-indigo-600 transition-colors">
                          <Link to={`/posts/${post._id}`}>
                            <span className="absolute inset-0" />
                            {post.title}
                          </Link>
                        </h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                          {excerpt(post.content)}
                        </p>
                      </div>
                      <div className="mt-6 flex items-center gap-x-4 border-t border-slate-100 pt-6">
                         <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm uppercase">
                            {post.author?.username?.substring(0, 2)}
                         </div>
                        <div className="text-sm leading-6">
                          <p className="font-semibold text-slate-900">
                            {post.author?.username || "Unknown"}
                          </p>
                          <p className="text-slate-600">Author</p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default HomePage;
