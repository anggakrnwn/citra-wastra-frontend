import React, { useState, useContext } from "react";
import { WastraContext } from "../context/WastraContext";
import DetectionIntro from "../components/DetectionIntro";

const DetectionPage: React.FC = () => {
  const { user, loading } = useContext(WastraContext)!; 
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<null | {
    motif: string;
    origin: string;
    description: string;
  }>(null);

  if (loading) {
    return <p className="text-center mt-6">Checking login status...</p>;
  }

  if (!user) {
    return <DetectionIntro />;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  // Simulated detection process
  const handleProcess = async () => {
    if (!selectedImage) return;
    setProcessing(true);

    setTimeout(() => {
      setResult({
        motif: "Parang",
        origin: "Yogyakarta, Indonesia",
        description:
          "The Parang motif symbolizes strength, courage, and determination.",
      });
      setProcessing(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-4">
        Batik Motif Detection
      </h1>
      <p className="text-lg text-center text-gray-600 mb-8">
        Upload your batik photo and let our AI recognize its motif and origin.
      </p>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
        {previewUrl ? (
          <div>
            <img
              src={previewUrl}
              alt="Preview"
              className="mx-auto max-h-64 object-contain rounded-lg mb-4"
            />
            <button
              onClick={() => {
                setSelectedImage(null);
                setPreviewUrl(null);
                setResult(null);
              }}
              className="text-sm text-red-500 hover:underline mb-4"
            >
              Change image
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

      {selectedImage && !processing && (
        <div className="text-center mt-6">
          <button
            onClick={handleProcess}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Start Detection
          </button>
        </div>
      )}

      {processing && (
        <p className="text-center mt-6 text-gray-500">Processing image...</p>
      )}

      {result && (
        <div className="mt-8 p-6 bg-gray-100 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-2">{result.motif}</h2>
          <p className="text-gray-700 mb-1">
            <strong>Origin:</strong> {result.origin}
          </p>
          <p className="text-gray-600">{result.description}</p>
        </div>
      )}
    </div>
  );
};

export default DetectionPage;
