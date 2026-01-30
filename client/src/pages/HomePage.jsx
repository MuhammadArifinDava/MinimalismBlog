import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { motion as Motion } from "framer-motion";
import { api } from "../lib/api";
import { Container } from "../components/Container";
import { Alert } from "../components/Alert";
import { Spinner } from "../components/Spinner";
import { Pagination } from "../components/Pagination";
import { StickyHorizontalSection } from "../components/StickyHorizontalSection";
import { CardSwap, Card } from "../components/CardSwap";
import FlowingMenu from "../components/FlowingMenu";
import { getPostImageUrl, getUserAvatarUrl } from "../utils/imageUtils";

function excerpt(text, max = 100) {
  const value = String(text || "");
  if (value.length <= max) return value;
  return `${value.slice(0, max)}...`;
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
  const flowItems = items.slice(0, 4).map((post) => ({
    link: `/posts/${post._id}`,
    text: post.title,
    image: getPostImageUrl(post),
  }));

  return (
    <div className="min-h-screen bg-transparent pb-32">
      <section className="relative overflow-hidden py-24 sm:py-32">
        <Container>
          <Motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.6 }}
            className="max-w-3xl"
          >
            <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Curated writing</p>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-slate-900 sm:text-6xl">
              A quiet space for expansive ideas and sharp writing.
            </h1>
            <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
              Discover carefully written stories with a luxury reading experience and subtle depth.
            </p>
          </Motion.div>

          <Motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.6 }}
            className="mt-12 flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search articles, authors"
              className="w-full rounded-full border border-white/70 bg-white/80 px-6 py-4 text-sm text-slate-900 placeholder-slate-500 shadow-[0_18px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-black/10 sm:text-base"
            />
            <button
              type="submit"
              className="rounded-full bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_60px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-black sm:text-base"
            >
              Search
            </button>
          </Motion.form>
        </Container>
      </section>

      {items.length > 0 && (
        <StickyHorizontalSection
          items={items}
          title="Featured works gallery"
          subtitle="Latest posts in motion"
        />
      )}

      {items.length > 0 && (
        <section className="py-20">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <Motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, amount: 0.6 }}
              >
                <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Interactive stack</p>
                <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                  Layered cards with depth and weight.
                </h2>
                <p className="mt-6 text-sm leading-7 text-slate-600 sm:text-base">
                  Each feature carries subtle 3D movement and a soft glass finish to match the
                  premium editorial mood.
                </p>
              </Motion.div>

              <div className="flex items-center justify-center mt-24 lg:mt-0">
                <CardSwap width={320} height={280} cardDistance={40} verticalDistance={40}>
                  {items.slice(0, 3).map((post) => (
                    <Card key={post._id} customClass="bg-white/85">
                      <div className="flex h-full flex-col justify-between p-6">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                            {post.category || "Feature"}
                          </p>
                          <h3 className="mt-4 text-lg font-semibold text-slate-900">
                            {post.title}
                          </h3>
                          <p className="mt-3 text-xs leading-6 text-slate-600 line-clamp-3">
                            {excerpt(post.content)}
                          </p>
                        </div>
                        <Link 
                          to={post.author?._id ? `/author/${post.author._id}` : "#"}
                          className="mt-6 flex items-center gap-3 hover:opacity-80 transition-opacity relative z-20"
                          onClick={(e) => {
                            e.stopPropagation(); // CardSwap might handle clicks, so stop propagation
                            if (!post.author?._id) e.preventDefault();
                          }}
                        >
                          {getUserAvatarUrl(post.author) ? (
                            <img
                              src={getUserAvatarUrl(post.author)}
                              alt={post.author?.username}
                              className="h-9 w-9 rounded-full object-cover border border-slate-200 shadow-sm"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                              {post.author?.username?.substring(0, 2) || "UN"}
                            </div>
                          )}
                          <div className="text-xs text-slate-500">
                            {post.author?.username || "Unknown"}
                          </div>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </CardSwap>
              </div>
            </div>
          </Container>
        </section>
      )}

      {flowItems.length > 0 && (
        <section className="py-20">
          <Container>
            <Motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.6 }}
              className="mb-10"
            >
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Flowing index</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                A marquee archive for standout posts.
              </h2>
            </Motion.div>
            <FlowingMenu
              items={flowItems}
              speed={12}
              textColor="#111111"
              bgColor="rgba(255,255,255,0.7)"
              marqueeBgColor="rgba(17,17,17,0.96)"
              marqueeTextColor="#f5f3ee"
              borderColor="rgba(17,17,17,0.08)"
            />
          </Container>
        </section>
      )}

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
          <div className="mt-16">
            {items.length === 0 ? (
              <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/60 p-12 text-center shadow-[0_30px_80px_rgba(0,0,0,0.06)]">
                <p className="text-base text-slate-600">No posts found.</p>
                {q && (
                  <button 
                    onClick={() => {
                      setInput("");
                      setSearchParams({});
                    }}
                    className="mt-4 text-sm font-semibold text-slate-900"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 [perspective:1200px]">
                {items.map((post) => (
                  <Tilt
                    key={post._id}
                    className="group h-full"
                    perspective={1400}
                    glareEnable={false}
                    scale={1.01}
                    tiltMaxAngleX={6}
                    tiltMaxAngleY={6}
                    transitionSpeed={1200}
                    gyroscope={false}
                  >
                    <article
                      className="flex h-full flex-col overflow-hidden rounded-[36px] border border-white/70 bg-white/70 backdrop-blur-xl shadow-[0_50px_120px_rgba(0,0,0,0.08)]"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Link to={`/posts/${post._id}`} className="relative h-56 overflow-hidden" style={{ transformStyle: "preserve-3d" }}>
                        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                        <img
                          src={getPostImageUrl(post)}
                          alt={post.title}
                          className="relative h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
                          loading="lazy"
                          style={{ transform: "translateZ(20px)" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 transition duration-300 group-hover:opacity-50" />
                        
                        <div className="absolute top-4 right-4" style={{ transform: "translateZ(30px)" }}>
                          <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-lg backdrop-blur-md">
                            {post.category ? post.category : "Article"}
                          </span>
                        </div>
                      </Link>
                      
                      <div className="relative flex flex-1 flex-col p-8" style={{ transformStyle: "preserve-3d" }}>
                        <div
                          className="absolute -top-6 left-8 inline-flex items-center rounded-full bg-white/95 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-700 shadow-lg backdrop-blur-md"
                          style={{ transform: "translateZ(30px)" }}
                        >
                          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                        </div>

                        <div className="mt-6 flex-1" style={{ transform: "translateZ(20px)" }}>
                          <h3 className="text-xl font-semibold leading-snug text-slate-900 transition-colors group-hover:text-black">
                            <Link to={`/posts/${post._id}`}>
                              <span className="absolute inset-0" />
                              {post.title}
                            </Link>
                          </h3>
                          <p className="mt-4 line-clamp-3 text-sm leading-7 text-slate-600">
                            {excerpt(post.content)}
                          </p>
                        </div>
                        
                        <Link 
                          to={post.author?._id ? `/author/${post.author._id}` : "#"}
                          className="mt-8 flex items-center gap-x-4 border-t border-slate-100/70 pt-6 relative z-10" 
                          style={{ transform: "translateZ(20px)" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!post.author?._id) e.preventDefault();
                          }}
                        >
                          {getUserAvatarUrl(post.author) ? (
                            <img
                              src={getUserAvatarUrl(post.author)}
                              alt={post.author?.username}
                              className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-sm"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold shadow-sm">
                              {post.author?.username?.substring(0, 2).toUpperCase() || "UN"}
                            </div>
                          )}
                          <div className="text-sm leading-6">
                            <p className="font-semibold text-slate-900">
                              {post.author?.username || "Unknown"}
                            </p>
                            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Author</p>
                          </div>
                        </Link>
                      </div>
                    </article>
                  </Tilt>
                ))}
              </div>
            )}

            <Motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.6 }}
              className="mt-20 flex justify-center"
            >
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            </Motion.div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default HomePage;
