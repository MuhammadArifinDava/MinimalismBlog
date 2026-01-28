import { Link } from "react-router-dom";
import { Container } from "../components/Container";

function NotFoundPage() {
  return (
    <Container>
      <div className="py-16">
        <div className="mx-auto max-w-2xl text-center [perspective:1200px]">
          <div className="card-3d shine surface rounded-3xl p-10">
            <div className="mx-auto h-14 w-14 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md" />
            <div className="mt-6 text-6xl font-extrabold tracking-tight text-slate-900">404</div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">Page not found</h1>
            <p className="mt-3 text-sm text-slate-600">
              The page you’re looking for doesn’t exist or has been moved.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                to="/"
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 hover:shadow-lg"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default NotFoundPage;
