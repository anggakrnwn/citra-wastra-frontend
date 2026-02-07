import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import { WastraContextProvider } from "./context/WastraContextProvider";
import { ThemeProvider } from "./context/ThemeContext";
import GalleryPage from "./pages/MotifExplorer";
import About from "./pages/About";
import MotifMaps from "./pages/MotifMaps";
import AuthPage from "./pages/AuthPage";
import MainLayout from "./components/layouts/MainLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DetectionWrapper from "./pages/DetectionWrapper";
import { setAuthRedirectCallback } from "./services/api";
import AdminMotif from "./pages/AdminMotif";
import AdminUsers from "./pages/AdminUsers";
import AdminPredictionHistory from "./pages/AdminPredictionHistory";
import AdminPredictionReview from "./pages/AdminPredictionReview";
import SystemLogs from "./pages/SystemLogs";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ForbiddenPage from "./pages/ForbiddenPage";
import CustomCursor from "./components/CustomCursor";
function App() {
  const navigate = useNavigate();

  useEffect(() => {
    setAuthRedirectCallback((path) => navigate(path));
  }, [navigate]);

  return (
    <ThemeProvider>
      <WastraContextProvider>
        <CustomCursor />
        <Routes>
        <Route element={<MainLayout />}>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/detection-page" element={<DetectionWrapper />} />
          <Route path="/maps" element={<MotifMaps />} />

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
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Redirect /admin to /admin/dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Navigate to="/admin/dashboard" replace />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes with Sidebar Layout */}
        <Route
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* User Management only for super_admin */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute superAdminOnly>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/motifs" element={<AdminMotif />} />
          <Route path="/admin/prediction-history" element={<AdminPredictionHistory />} />
          <Route path="/admin/prediction-review" element={<AdminPredictionReview />} />
          <Route path="/admin/statistics" element={<Statistics />} />
          <Route path="/admin/system-logs" element={<ProtectedRoute superAdminOnly><SystemLogs /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute superAdminOnly><Settings /></ProtectedRoute>} />
        </Route>

        <Route path="/forbidden" element={<ForbiddenPage />} />

        <Route path="/login" element={<AuthPage />} />
      </Routes>
      </WastraContextProvider>
    </ThemeProvider>
  );
}

export default App;
