import React, { useState } from "react";

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

const AdminMotif: React.FC = () => {
  const [motifs, setMotifs] = useState<MotifItem[]>([
    {
      id: "1",
      name: "Parang Rusak",
      region: "Jawa",
      province: "Yogyakarta",
      image:
        "https://images.unsplash.com/photo-1578926374376-ef913a0bba9a?auto=format&fit=crop&w=600&q=60",
      description:
        "Motif klasik keraton Jawa melambangkan kekuatan dan kesinambungan.",
      tags: ["klasik", "keraton"],
      createdAt: new Date().toISOString(),
    },
  ]);

  const [editing, setEditing] = useState<MotifItem | null>(null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setMotifs((prev) =>
        prev.map((m) =>
          m.id === editing.id ? { ...editing, ...form } : m
        )
      );
    } else {
      const newMotif: MotifItem = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...form,
      };
      setMotifs((prev) => [...prev, newMotif]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setMotifs((prev) => prev.filter((m) => m.id !== deleteId));
      setDeleteId(null);
      setShowConfirm(false);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setShowConfirm(false);
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

      {/* Form */}
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
            type="text"
            placeholder="URL Gambar"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            required
            className="border rounded-lg px-3 py-2"
          />
        </div>

        <textarea
          placeholder="Deskripsi"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
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
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg"
          >
            {editing ? "Update" : "Tambah"}
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
            {motifs.map((m) => (
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
            ))}
            {motifs.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Belum ada motif
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
            <p className="mb-6">Yakin ingin menghapus motif ini?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelDelete}
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
