import { useWastra } from "../context/WastraContext";
import DetectIntro from "../components/DetectionIntro"; // pastikan path sesuai
import DetectionPage from "./DetectionPage";

export default function DetectionWrapper() {
  const { user, loading } = useWastra();

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return user ? <DetectionPage /> : <DetectIntro />;
}
