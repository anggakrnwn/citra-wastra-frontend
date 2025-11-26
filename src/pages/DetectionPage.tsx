import React, { useState, useContext, useEffect } from "react";
import { WastraContext } from "../context/WastraContext";
import DetectionIntro from "../components/DetectionIntro";
import { X } from "lucide-react";
import { predictionService } from "../services/api";

interface TopPrediction {
  class: string;
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

const DetectionPage: React.FC = () => {
  const { user, loading } = useContext(WastraContext) ?? {};

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<DetectionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (loading) {
    return <p className="text-center mt-6">Checking login status...</p>;
  }

  if (!user) {
    return <DetectionIntro />;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const resetImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  const handleProcess = async () => {
    if (!selectedImage) {
      setError("Pilih gambar terlebih dahulu!");
      return;
    }

    setProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Kamu harus login terlebih dahulu!");

      const response = await predictionService.predict(formData);
      const json: DetectionResponse = response.data;

      if (json.success && json.data) {
        setResult(json.data);
      } else {
        setError("Response backend tidak valid");
      }
    } catch (err: unknown) {
      console.error("Prediction error:", err);
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
          setError("Prediksi memakan waktu terlalu lama. Silakan coba lagi dengan gambar yang lebih kecil.");
        } else if (axiosError.response?.status === 504) {
          setError(axiosError.response?.data?.message || "Prediksi memakan waktu terlalu lama. Silakan coba lagi dengan gambar yang lebih kecil.");
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
        Batik Motif Detection
      </h1>
      <p className="text-lg text-center text-gray-600 mb-8">
        Upload your batik photo and let our AI recognize its motif and origin.
      </p>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:border-orange-400 transition">
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
            <p className="text-gray-500 mb-4">
              Drag & drop an image here or click the button below
            </p>
            <label className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg cursor-pointer hover:bg-orange-700 transition">
              Choose Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </>
        )}
      </div>

      {selectedImage && (
        <div className="text-center mt-6">
          <button
            onClick={handleProcess}
            disabled={processing}
            className={`px-6 py-3 rounded-lg text-white font-medium transition ${
              processing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {processing ? "Processing..." : "Start Detection"}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-4 text-center text-red-500 font-semibold">{error}</p>
      )}

      {result && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {result.prediction}
            </h2>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
              {(result.confidence * 100).toFixed(2)}%
            </span>
          </div>

          {Array.isArray(result.top_predictions) &&
          result.top_predictions.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-700">
                Top-3 Predictions:
              </h3>
              <ul className="space-y-2">
                {result.top_predictions.map((p, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg shadow-sm"
                  >
                    <span className="font-medium text-gray-800">{p.class}</span>
                    <span className="text-sm text-gray-600">
                      {(p.confidence * 100).toFixed(2)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-400 mt-2">Belum ada prediksi top-3</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DetectionPage;
