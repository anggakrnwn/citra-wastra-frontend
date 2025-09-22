import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import { WastraContextProvider } from "./context/WastraContextProvider";
import GalleryPage from "./pages/MotifExplorer";
import About from "./pages/About";
import WastraQuiz from "./pages/WastraQuiz";
import AuthPage from "./pages/AuthPage";
import MainLayout from "./components/layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DetectionWrapper from "./pages/DetectionWrapper";
import { setAuthRedirectCallback } from "./services/api";
import AdminMotif from "./pages/AdminMotif";
import AdminUsers from "./pages/AdminUsers";
import ForbiddenPage from "./pages/ForbiddenPage";
function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setAuthRedirectCallback((path) => navigate(path));
  }, [navigate]);

  return (
    <WastraContextProvider>
      <Routes>
        <Route element={<MainLayout />}>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/detection-page" element={<DetectionWrapper />} />

          {/* PRIVATE */}
          <Route
            path="/gallery-page"
            element={
              <ProtectedRoute>
                <GalleryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/WastraQuiz"
            element={
              <ProtectedRoute>
                <WastraQuiz />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/admin/motifs"
          element={
            <ProtectedRoute adminOnly>
              <AdminMotif />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route path="/forbidden" element={<ForbiddenPage />} />

        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </WastraContextProvider>
  );
}

export default App;
