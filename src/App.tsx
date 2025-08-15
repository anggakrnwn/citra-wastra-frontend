import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { WastraContextProvider } from "./context/WastraContextProvider";
import GalleryPage from "./pages/GalleryPage";
import About from "./pages/About";
import Contribution from "./pages/Contribution";
import AuthPage from "./pages/AuthPage";
import MainLayout from "./components/layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import DetectionWrapper from "./pages/DetectionWrapper"; 
function App() {
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
            path="/contribution"
            element={
              <ProtectedRoute>
                <Contribution />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </WastraContextProvider>
  );
}

export default App;
