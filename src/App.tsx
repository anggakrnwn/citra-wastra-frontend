import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { WastraContextProvider } from "./context/WastraContextProvider";
import GalleryPage from "./pages/MotifExplorer";
import About from "./pages/About";
import WastraQuiz from "./pages/WastraQuiz";
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
            path="/WastraQuiz"
            element={
              <ProtectedRoute>
                <WastraQuiz />
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
