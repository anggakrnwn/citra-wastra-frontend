import React, { useState, useContext, useEffect } from "react";
import { WastraContext } from "../context/WastraContext";
import DetectionIntro from "../components/DetectionIntro";
import { X } from "lucide-react";
import { predictionService, motifService } from "../services/api";

interface TopPrediction {
  class_name: string;
  confidence: number;
}

interface DetectionData {
  prediction: string;
  confidence: number;
  top_predictions: TopPrediction[];
  timestamp: string;
}

interface DetectionResponse {
  success: boolean;
  data: DetectionData;
}

interface MotifData {
  id: string;
  name: string;
  description: string;
  image: string;
  region: string;
  province: string;
  tags: string[];
}

const DetectionPage: React.FC = () => {
  const { user, loading } = useContext(WastraContext) ?? {};

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<DetectionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);
  const [motifData, setMotifData] = useState<MotifData | null>(null);
  const [loadingMotif, setLoadingMotif] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (loading) {
    return <p className="text-center mt-6 text-gray-900 dark:text-white">Checking login status...</p>;
  }

  if (!user) {
    return <DetectionIntro />;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processImageFile(file);
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError("File harus berupa gambar!");
      return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleCameraClick = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;
        video.style.position = 'fixed';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.zIndex = '9999';
        video.style.objectFit = 'cover';
        
        const canvas = document.createElement('canvas');
        const captureBtn = document.createElement('button');
        captureBtn.textContent = 'Capture Photo';
        captureBtn.style.position = 'fixed';
        captureBtn.style.bottom = '20px';
        captureBtn.style.left = '50%';
        captureBtn.style.transform = 'translateX(-50%)';
        captureBtn.style.zIndex = '10000';
        captureBtn.style.padding = '12px 24px';
        captureBtn.style.backgroundColor = '#d97706';
        captureBtn.style.color = 'white';
        captureBtn.style.border = 'none';
        captureBtn.style.borderRadius = '8px';
        captureBtn.style.cursor = 'pointer';
        captureBtn.style.fontSize = '16px';
        captureBtn.style.fontWeight = 'bold';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.position = 'fixed';
        closeBtn.style.top = '20px';
        closeBtn.style.right = '20px';
        closeBtn.style.zIndex = '10000';
        closeBtn.style.padding = '10px 15px';
        closeBtn.style.backgroundColor = 'rgba(0,0,0,0.5)';
        closeBtn.style.color = 'white';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '50%';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontSize = '20px';
        
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
        overlay.style.zIndex = '9998';
        
        const cleanup = () => {
          stream.getTracks().forEach(track => track.stop());
          document.body.removeChild(video);
          document.body.removeChild(overlay);
          document.body.removeChild(captureBtn);
          document.body.removeChild(closeBtn);
        };
        
        captureBtn.onclick = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
                processImageFile(file);
              }
              cleanup();
            }, 'image/jpeg', 0.95);
          }
        };
        
        closeBtn.onclick = cleanup;
        
        document.body.appendChild(overlay);
        document.body.appendChild(video);
        document.body.appendChild(captureBtn);
        document.body.appendChild(closeBtn);
      } catch (err) {
        console.error('Error accessing camera:', err);
        if (cameraInputRef.current) {
          cameraInputRef.current.click();
        }
      }
    } else {
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
    }
  };

  const resetImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setMotifData(null);
  };

  const fetchMotifByPrediction = async (predictionName: string) => {
    if (!predictionName) return;
    
    setLoadingMotif(true);
    setMotifData(null);
    
    try {
      const response = await motifService.getAll();
      const motifs = Array.isArray(response.data) ? response.data : [];
      
      const normalizedPrediction = predictionName.toLowerCase().trim();
      const predictionWithoutBatik = normalizedPrediction.replace(/^batik\s+/, '').trim();
      
      const matchedMotif = motifs.find((motif: MotifData) => {
        const motifNameLower = motif.name.toLowerCase().trim();
        const motifNameWithoutBatik = motifNameLower.replace(/^batik\s+/, '').trim();
        
        if (motifNameLower === normalizedPrediction) return true;
        if (motifNameWithoutBatik === predictionWithoutBatik) return true;
        
        if (motifNameLower.includes(normalizedPrediction)) return true;
        if (normalizedPrediction.includes(motifNameLower)) return true;
        if (motifNameWithoutBatik.includes(predictionWithoutBatik)) return true;
        if (predictionWithoutBatik.includes(motifNameWithoutBatik)) return true;
        
        return false;
      });
      
      if (matchedMotif) {
        setMotifData(matchedMotif);
      } else {
        setMotifData(null);
      }
    } catch (err: any) {
      console.error("Error fetching motifs:", err);
      setMotifData(null);
    } finally {
      setLoadingMotif(false);
    }
  };

  const handleProcess = async () => {
    if (!selectedImage) {
      setError("Pilih gambar terlebih dahulu!");
      return;
    }

    setProcessing(true);
    setError(null);
    setRetryMessage(null);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Kamu harus login terlebih dahulu!");

      const onRetry = (attempt: number, delay: number) => {
        setRetryMessage(`Service sedang memulai (percobaan ${attempt}/3). Menunggu ${delay/1000} detik...`);
      };
      const response = await predictionService.predict(formData, 3, onRetry);
      const json: DetectionResponse = response.data;

      if (json.success && json.data) {
        setResult(json.data);
        setRetryMessage(null);
        await fetchMotifByPrediction(json.data.prediction);
      } else {
        setError("Response backend tidak valid");
      }
    } catch (err: unknown) {
      console.error("Prediction error:", err);
      setRetryMessage(null);

      if (err instanceof Error && err.message) {
        // Handle timeout errors
        if (err.message.includes("timeout") || err.message.includes("504")) {
          setError("Prediksi memakan waktu terlalu lama. Silakan coba lagi dengan gambar yang lebih kecil atau tunggu beberapa saat.");
        } else {
          setError(err.message);
        }
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosError = err as { 
          response?: { 
            status?: number; 
            data?: { 
              message?: string;
              suggestion?: string;
            } 
          };
          code?: string;
          message?: string;
        };
        
        if (axiosError.code === "ECONNABORTED" || axiosError.message?.includes("timeout")) {
          setError("Prediksi memakan waktu terlalu lama setelah beberapa percobaan. Service mungkin sedang dalam proses wake-up. Silakan coba lagi dalam beberapa saat.");
        } else if (axiosError.response?.status === 503 || axiosError.response?.status === 504) {
          setError("Service sedang memulai. Semua percobaan telah dilakukan. Silakan coba lagi dalam beberapa detik.");
        } else if (axiosError.response?.status === 404) {
          setError("Endpoint tidak ditemukan. Pastikan backend sudah running dan URL API benar.");
        } else {
          setError(axiosError.response?.data?.message || `Server error: ${axiosError.response?.status || 'Unknown'}`);
        }
      } else {
        setError("Terjadi kesalahan tak terduga");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">
          Batik Motif Detection
        </h1>
      <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-8">
        Upload your batik photo and let our AI recognize its motif and origin.
      </p>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragging
            ? "border-amber-500 dark:border-amber-500 bg-amber-50 dark:bg-amber-900/30"
            : "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-100 dark:border-gray-700 hover:border-amber-200 dark:hover:border-amber-600 hover:shadow-md"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="mx-auto max-h-64 object-contain rounded-lg mb-4 shadow"
            />
            {processing && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
                <svg
                  className="animate-spin h-10 w-10 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </div>
            )}
            <button
              onClick={resetImage}
              className="absolute top-3 right-3 bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-full shadow-lg backdrop-blur-sm transition"
              aria-label="Reset Image"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium">
                {isDragging ? "Drop image here" : "Drag & drop image here"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">or</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <label className="inline-flex items-center px-6 py-3 bg-amber-600 dark:bg-amber-700 text-white rounded-lg cursor-pointer hover:bg-amber-700 dark:hover:bg-amber-600 transition shadow-md">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Select Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={handleCameraClick}
                className="inline-flex items-center px-6 py-3 bg-amber-600 dark:bg-amber-700 text-white rounded-lg cursor-pointer hover:bg-amber-700 dark:hover:bg-amber-600 transition shadow-md"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Use Camera
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </button>
            </div>
          </>
        )}
      </div>

      {selectedImage && (
        <div className="text-center mt-6">
          <button
            onClick={handleProcess}
            disabled={processing}
            className={`px-6 py-3 rounded-lg text-white font-medium transition shadow-md ${
              processing
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-amber-600 dark:bg-amber-700 hover:bg-amber-700 dark:hover:bg-amber-600"
            }`}
          >
            {processing ? "Processing..." : "Start Detection"}
          </button>
        </div>
      )}

      {retryMessage && (
        <p className="mt-4 text-center text-amber-600 font-medium animate-pulse">
          {retryMessage}
        </p>
      )}
      
      {error && (
        <p className="mt-4 text-center text-red-500 dark:text-red-400 font-semibold">{error}</p>
      )}

      {result && (
        <div className="mt-8 p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {result.prediction}
            </h2>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-sm font-medium rounded-full">
              {(result.confidence * 100).toFixed(2)}%
            </span>
          </div>

          {loadingMotif ? (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-700">
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-amber-600 dark:text-amber-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <p className="text-amber-700 dark:text-amber-400 text-sm">Memuat deskripsi motif...</p>
              </div>
            </div>
          ) : motifData ? (
            <div className="mb-6 p-5 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Tentang Motif {motifData.name}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                {motifData.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                {motifData.region && (
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-medium rounded-full">
                    {motifData.region}
                  </span>
                )}
                {motifData.province && (
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-medium rounded-full">
                    {motifData.province}
                  </span>
                )}
                {motifData.tags && motifData.tags.length > 0 && 
                  motifData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-medium rounded-full"
                    >
                      #{tag}
                    </span>
                  ))
                }
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                Deskripsi untuk motif "{result.prediction}" belum tersedia di database.
              </p>
            </div>
          )}

          {Array.isArray(result.top_predictions) &&
          result.top_predictions.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
                Top-3 Predictions:
              </h3>
              <ul className="space-y-2">
                {result.top_predictions.map((p, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-lg shadow-sm"
                  >
                    <span className="font-medium text-gray-800 dark:text-white">{p.class_name}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {(p.confidence * 100).toFixed(2)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 mt-2">Belum ada prediksi top-3</p>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default DetectionPage;
