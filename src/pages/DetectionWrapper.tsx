import { useWastra } from "../context/WastraContext";
import DetectIntro from "../components/DetectionIntro";
import DetectionPage from "./DetectionPage";

export default function DetectionWrapper() {
  const { user, loading } = useWastra();

  if (loading) {
    return <div className="p-4 text-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">Loading...</div>;
  }

  return user ? <DetectionPage /> : <DetectIntro />;
}
