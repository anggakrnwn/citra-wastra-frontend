import React, { useState, useEffect } from "react";
import { API_URL, UPLOAD_URL } from "../../config";

type Island =
  | "Sumatra"
  | "Jawa"
  | "Kalimantan"
  | "Sulawesi"
  | "Bali"
  | "Nusa Tenggara"
  | "Papua"
  | "Maluku";

interface MotifItem {
  id: string;
  name: string;
  region: Island;
  province: string;
  image: string;
  description: string;
  tags: string[];
  createdAt: string;
}

const ISLAND_OPTIONS: Island[] = [
  "Sumatra",
  "Jawa",
  "Kalimantan",
  "Sulawesi",
  "Bali",
  "Nusa Tenggara",
  "Papua",
  "Maluku",
];


const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminMotif: React.FC = () => {
  const [motifs, setMotifs] = useState<MotifItem[]>([]);
  const [editing, setEditing] = useState<MotifItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<Omit<MotifItem, "id" | "createdAt">>({
    name: "",
    region: "Jawa",
    province: "",
    image: "",
    description: "",
    tags: [],
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const fetchMotifs = async () => {
      setLoading(true);
      try {
        const res = await fetch(API_URL, {
          headers: { ...getAuthHeaders() },
        });
        if (!res.ok) throw new Error("Gagal mengambil data");
        const data: MotifItem[] = await res.json();
        setMotifs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMotifs();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: "",
      region: "Jawa",
      province: "",
      image: "",
      description: "",
      tags: [],
    });
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        headers: { ...getAuthHeaders() },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload gagal");
      const data = await res.json();
      setForm((prev) => ({ ...prev, image: data.imageUrl }));
    } catch (err) {
      console.error(err);
      alert("Gagal mengupload gambar");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      const res = await fetch(
        editing ? `${API_URL}/${editing.id}` : API_URL,
        {
          method: editing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Gagal menyimpan motif");
      const saved = await res.json();

      if (editing) {
        setMotifs((prev) =>
          prev.map((m) => (m.id === editing.id ? saved : m))
        );
      } else {
        setMotifs((prev) => [...prev, saved]);
      }

      resetForm();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${API_URL}/${deleteId}`, {
        method: "DELETE",
        headers: { ...getAuthHeaders() },
      });
      if (!res.ok) throw new Error("Gagal menghapus motif");
      setMotifs((prev) => prev.filter((m) => m.id !== deleteId));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data.");
    } finally {
      setDeleteId(null);
      setShowConfirm(false);
    }
  };

  const handleEdit = (item: MotifItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      region: item.region,
      province: item.province,
      image: item.image,
      description: item.description,
      tags: item.tags,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Motif Explorer</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl shadow-sm p-6 mb-8 space-y-4"
      >
        <h2 className="text-xl font-semibold mb-2">
          {editing ? "Edit Motif" : "Tambah Motif Baru"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nama Motif"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border rounded-lg px-3 py-2"
          />
          <select
            value={form.region}
            onChange={(e) =>
              setForm({ ...form, region: e.target.value as Island })
            }
            className="border rounded-lg px-3 py-2"
          >
            {ISLAND_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Provinsi"
            value={form.province}
            onChange={(e) => setForm({ ...form, province: e.target.value })}
            required
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
            className="border rounded-lg px-3 py-2"
          />
        </div>

        {form.image && (
          <div className="flex items-center gap-4">
            <img
              src={form.image}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, image: "" })}
              className="text-red-600 hover:underline"
            >
              Hapus Gambar
            </button>
          </div>
        )}

        <textarea
          placeholder="Deskripsi"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border rounded-lg px-3 py-2"
        />

        <input
          type="text"
          placeholder="Tags (pisahkan dengan koma)"
          value={form.tags.join(", ")}
          onChange={(e) =>
            setForm({
              ...form,
              tags: e.target.value
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
            })
          }
          className="w-full border rounded-lg px-3 py-2"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={uploading}
            className={`${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-600 hover:bg-amber-700"
            } text-white px-4 py-2 rounded-lg`}
          >
            {uploading
              ? "Mengunggah..."
              : editing
              ? "Update"
              : "Tambah"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 px-4 py-2 rounded-lg"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
        {loading ? (
          <p className="text-center p-4">Memuat data...</p>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Daerah</th>
                <th className="px-4 py-2">Provinsi</th>
                <th className="px-4 py-2">Tags</th>
                <th className="px-4 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {motifs.length > 0 ? (
                motifs.map((m) => (
                  <tr key={m.id} className="border-t">
                    <td className="px-4 py-2 font-medium">{m.name}</td>
                    <td className="px-4 py-2">{m.region}</td>
                    <td className="px-4 py-2">{m.province}</td>
                    <td className="px-4 py-2">{m.tags.join(", ")}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(m)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Belum ada motif
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="mb-6">Yakin ingin menghapus motif ini?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMotif;
