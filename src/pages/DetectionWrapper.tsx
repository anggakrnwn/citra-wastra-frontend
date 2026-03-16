import { useWastra } from "../context/WastraContext";
import DetectIntro from "../components/DetectionIntro";
import { Suspense, lazy } from "react";

const DetectionPage = lazy(() => import("./DetectionPage"));

export default function DetectionWrapper() {
  const { user, loading } = useWastra();

  if (loading) {
    return <div className="p-4 text-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">Loading...</div>;
  }

  if (!user) {
    return <DetectIntro />;
  }

  return (
    <Suspense fallback={<div className="p-4 text-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">Memuat halaman deteksi...</div>}>
      <DetectionPage />
    </Suspense>
  );
}
