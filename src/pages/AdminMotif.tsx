import React, { useState, useEffect, useCallback } from "react";
import { API_URL, UPLOAD_URL, WILAYAH_API_URL } from "../../config";
import { exportService, motifService } from "../services/api";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

interface MotifItem {
  id: string;
  name: string;
  region: string;
  province: string;
  image: string;
  description: string;
  tags: string[];
  createdAt: string;
}

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  province_id: string;
  name: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}


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
    region: "",
    province: "",
    image: "",
    description: "",
    tags: [],
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedRegencyId, setSelectedRegencyId] = useState<string>("");
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingRegencies, setLoadingRegencies] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const res = await fetch(`${WILAYAH_API_URL}/provinces`);
        if (!res.ok) {
          throw new Error(`Gagal mengambil data provinsi: ${res.status} ${res.statusText}`);
        }
        const data: Province[] = await res.json();
        setProvinces(data);
      } catch (err) {
        console.error("Error fetching provinces:", err);
        alert(`Error: ${err instanceof Error ? err.message : "Gagal mengambil data provinsi"}`);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (!selectedProvinceId) {
      setRegencies([]);
      setSelectedRegencyId("");
      return;
    }

    const fetchRegencies = async () => {
      setLoadingRegencies(true);
      try {
        const res = await fetch(`${WILAYAH_API_URL}/regencies/${selectedProvinceId}`);
        if (!res.ok) {
          throw new Error(`Gagal mengambil data kota/kabupaten: ${res.status} ${res.statusText}`);
        }
        const data: Regency[] = await res.json();
        setRegencies(data);
        setSelectedRegencyId("");
      } catch (err) {
        console.error("Error fetching regencies:", err);
        alert(`Error: ${err instanceof Error ? err.message : "Gagal mengambil data kota/kabupaten"}`);
      } finally {
        setLoadingRegencies(false);
      }
    };
    fetchRegencies();
  }, [selectedProvinceId]);

  useEffect(() => {
    if (selectedRegencyId && regencies.length > 0 && selectedProvinceId) {
      const selectedRegency = regencies.find(r => r.id === selectedRegencyId);
      const selectedProvince = provinces.find(p => p.id === selectedProvinceId);
      
      if (selectedRegency && selectedProvince) {
        const provinceValue = `${selectedRegency.name}, ${selectedProvince.name}`;
        setForm(prev => ({ 
          ...prev, 
          province: provinceValue
        }));
      }
    } else if (!selectedRegencyId && selectedProvinceId) {
      setForm(prev => ({ ...prev, province: "" }));
    }
  }, [selectedRegencyId, regencies, selectedProvinceId, provinces]);

  const fetchMotifs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const res = await motifService.getAll(params.toString());

      if (res.data && res.data.success && res.data.pagination) {
        // New paginated response format
        setMotifs(res.data.data || []);
        setPagination(res.data.pagination);
      } else if (Array.isArray(res.data)) {
        // Backward compatibility: old format (array directly)
        setMotifs(res.data);
        setPagination({
          page: 1,
          limit: res.data.length,
          total: res.data.length,
          totalPages: 1,
        });
      } else {
        setMotifs([]);
      }
    } catch (err) {
      console.error("Error fetching motifs:", err);
      toast.error(err instanceof AxiosError ? err.response?.data?.message || "Failed to fetch motifs" : "Failed to fetch motifs");
      setMotifs([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchMotifs();
  }, [fetchMotifs]);

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: "",
      region: "",
      province: "",
      image: "",
      description: "",
      tags: [],
    });
    setSelectedProvinceId("");
    setSelectedRegencyId("");
    setRegencies([]);
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
      if (!form.province) {
        alert("Silakan pilih provinsi dan kota/kabupaten terlebih dahulu");
        return;
      }

      if (!form.image) {
        alert("Silakan upload gambar terlebih dahulu");
        return;
      }

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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ 
          error: "Gagal menyimpan motif",
          message: `Error ${res.status}: ${res.statusText}`
        }));
        
        throw new Error(errorData.error || errorData.message || "Gagal menyimpan motif");
      }
      
      await res.json();

      if (editing) {
        toast.success("Motif berhasil diupdate");
      } else {
        toast.success("Motif berhasil ditambahkan");
      }

      resetForm();
      fetchMotifs();
    } catch (err) {
      console.error("Submit error:", err);
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data.";
      alert(errorMessage);
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
      
      // If current page becomes empty after deletion and not on page 1, go to previous page
      if (motifs.length === 1 && pagination.page > 1) {
        setPagination({ ...pagination, page: pagination.page - 1 });
      } else {
        fetchMotifs();
      }
      toast.success("Motif deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Gagal menghapus data.");
    } finally {
      setDeleteId(null);
      setShowConfirm(false);
    }
  };

  const handleEdit = async (item: MotifItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      region: item.region,
      province: item.province,
      image: item.image,
      description: item.description,
      tags: item.tags,
    });
    
    const parts = item.province.split(", ");
    if (parts.length === 2) {
      const regencyName = parts[0];
      const provinceName = parts[1];
      const province = provinces.find(p => p.name === provinceName);
      if (province) {
        setSelectedProvinceId(province.id);
        try {
          const res = await fetch(`${WILAYAH_API_URL}/regencies/${province.id}`);
          if (res.ok) {
            const regenciesData: Regency[] = await res.json();
            setRegencies(regenciesData);
            const regency = regenciesData.find(r => r.name === regencyName);
            if (regency) {
              setSelectedRegencyId(regency.id);
            }
          }
        } catch (err) {
          console.error("Error fetching regencies for edit:", err);
        }
      }
    }
  };

  const handleExport = async (format: "csv" | "json" = "csv") => {
    try {
      const response = await exportService.exportMotifs(format);
      
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `motifs-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Exported successfully as ${format.toUpperCase()}`);
    } catch (err) {
      toast.error("Failed to export motifs");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white dark:bg-gray-900 min-h-screen transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Motif Explorer</h1>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport("csv")}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
          <button
            onClick={() => handleExport("json")}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export JSON
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-6 mb-8 space-y-4 transition-colors"
      >
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {editing ? "Edit Motif" : "Tambah Motif Baru"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nama Motif"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <input
            type="text"
            placeholder="Daerah/Pulau (opsional)"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
          <select
            value={selectedProvinceId}
            onChange={(e) => setSelectedProvinceId(e.target.value)}
            required
            disabled={loadingProvinces}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500"
          >
            <option value="">
              {loadingProvinces ? "Memuat provinsi..." : "Pilih Provinsi"}
            </option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>
          <select
            value={selectedRegencyId}
            onChange={(e) => setSelectedRegencyId(e.target.value)}
            required
            disabled={!selectedProvinceId || loadingRegencies}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-500"
          >
            <option value="">
              {!selectedProvinceId 
                ? "Pilih provinsi terlebih dahulu" 
                : loadingRegencies 
                ? "Memuat kota/kabupaten..." 
                : "Pilih Kota/Kabupaten"}
            </option>
            {regencies.map((regency) => (
              <option key={regency.id} value={regency.id}>
                {regency.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-600 dark:file:bg-amber-700 file:text-white hover:file:bg-amber-700 dark:hover:file:bg-amber-600"
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
              className="text-red-600 dark:text-red-400 hover:underline"
            >
              Hapus Gambar
            </button>
          </div>
        )}

        <textarea
          placeholder="Deskripsi"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
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
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={uploading}
            className={`${
              uploading
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-amber-600 dark:bg-amber-700 hover:bg-amber-700 dark:hover:bg-amber-600"
            } text-white px-4 py-2 rounded-lg transition-colors`}
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
              className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm transition-colors">
        {loading ? (
          <p className="text-center p-4 text-gray-900 dark:text-white">Memuat data...</p>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
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
                  <tr key={m.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{m.name}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{m.region}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{m.province}</td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{m.tags.join(", ")}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(m)}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="text-red-600 dark:text-red-400 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Belum ada motif
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination Controls */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} motifs
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination({ ...pagination, page: 1 })}
                disabled={pagination.page <= 1}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                           text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                First
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page <= 1}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                           text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const totalPages = pagination.totalPages;
                  const currentPage = pagination.page;

                  if (totalPages > 0) {
                    pages.push(1);

                    let startPage = Math.max(2, currentPage - 1);
                    let endPage = Math.min(totalPages - 1, currentPage + 1);

                    if (currentPage <= 3) {
                      endPage = Math.min(5, totalPages - 1);
                    }

                    if (currentPage >= totalPages - 2) {
                      startPage = Math.max(2, totalPages - 4);
                    }

                    if (startPage > 2) {
                      pages.push("...");
                    }

                    for (let i = startPage; i <= endPage; i++) {
                      if (i > 1 && i < totalPages) {
                        pages.push(i);
                      }
                    }

                    if (endPage < totalPages - 1) {
                      pages.push("...");
                    }

                    if (totalPages > 1) {
                      pages.push(totalPages);
                    }

                    return pages.map((pageNum, index) => {
                      if (pageNum === "...") {
                        return (
                          <span key={`ellipsis-${index}`} className="px-2 text-gray-500 dark:text-gray-400">
                            ...
                          </span>
                        );
                      }

                      const isActive = pageNum === currentPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination({ ...pagination, page: pageNum as number })}
                          className={`px-3 py-1 text-sm rounded-md ${
                            isActive
                              ? "bg-amber-600 text-white"
                              : "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    });
                  }
                  return null;
                })()}
              </div>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                           text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Next
              </button>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.totalPages })}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                           text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Last
              </button>
            </div>
          </div>
        )}
      </div>
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 dark:bg-opacity-60 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-w-[300px] transition-colors">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Konfirmasi Hapus</h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Yakin ingin menghapus motif ini?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
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
