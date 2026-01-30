import { Navigate, Route, Routes } from "react-router-dom";
import SplashCursor from "./components/SplashCursor";
import { Navbar } from "./components/Navbar";
import { SmoothScroll } from "./components/SmoothScroll";
import { ParallaxBackdrop } from "./components/ParallaxBackdrop";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import PostFormPage from "./pages/PostFormPage";
import ProfilePage from "./pages/ProfilePage";
import AuthorPage from "./pages/AuthorPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <SmoothScroll>
      <div className="min-h-full relative">
        <ParallaxBackdrop />
        <div className="fixed inset-0 z-0 pointer-events-none">
          <SplashCursor
            SIM_RESOLUTION={100}
            DYE_RESOLUTION={512}
            DENSITY_DISSIPATION={1.75}
            VELOCITY_DISSIPATION={1}
            PRESSURE={0.1}
            PRESSURE_ITERATIONS={8}
            CURL={6}
            SPLAT_RADIUS={0.5}
            SPLAT_FORCE={16000}
            COLOR_UPDATE_SPEED={10}
          />
        </div>
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/author/:id" element={<AuthorPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/create" element={<PostFormPage />} />
              <Route path="/edit/:id" element={<PostFormPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </SmoothScroll>
  );
}

export default App;
