import { useWastra } from "../context/WastraContext";
import DetectIntro from "../components/DetectionIntro";
import { Suspense, lazy } from "react";
import { useI18n } from "../context/I18nContext";

const DetectionPage = lazy(() => import("./DetectionPage"));

const LoadingScreen = ({ message }: { message: string }) => (
 <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 transition-colors animate-in fade-in duration-500">
  <div className="relative mb-8">
   {/* Outer pulse ring */}
   <div className="absolute inset-0 rounded-full bg-amber-600/20 animate-ping duration-[2000ms]"></div>
   {/* Inner spinner */}
   <div className="relative h-20 w-20 rounded-full border-4 border-amber-500 dark:border-amber-900/30 border-t-amber-600 animate-spin"></div>
   {/* Center icon or logo placeholder */}
   <div className="absolute inset-0 flex items-center justify-center">
    <div className="h-8 w-8 rounded-full bg-amber-600/10 flex items-center justify-center">
     <div className="h-2 w-2 rounded-full bg-amber-600 animate-pulse"></div>
    </div>
   </div>
  </div>
  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2 animate-pulse">
   {message}
  </h2>
  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs text-center leading-relaxed">
   Tracing cultural footprints, preserving heritage in every piece of fabric.
  </p>
 </div>
);

export default function DetectionWrapper() {
 const { user, loading } = useWastra();
 const { t } = useI18n();

 if (loading) {
  return <LoadingScreen message={t("detection.checkingLogin")} />;
 }

 if (!user) {
  return <DetectIntro />;
 }

 return (
  <Suspense fallback={<LoadingScreen message={t("detection.loading")} />}>
   <DetectionPage />
  </Suspense>
 );
}