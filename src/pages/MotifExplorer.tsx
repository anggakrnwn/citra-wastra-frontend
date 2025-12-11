import React, { useMemo, useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import type { MotifItem } from "../assets/data/dataset";
import { motifService } from "../services/api";
import { WILAYAH_API_URL } from "../../config";
import { Skeleton } from "@/components/ui/skeleton";

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  province_id: string;
  name: string;
}


const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-200">
    {children}
  </span>
);

const DetailModal = ({
  item,
  onClose,
}: {
  item: MotifItem | null;
  onClose: () => void;
}) => {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="relative">
          <img src={item.image} alt={item.name} className="h-72 w-full object-cover" />
          <button
            onClick={onClose}
            aria-label="Tutup detail"
            className="absolute right-3 top-3 rounded-full bg-white shadow p-2 text-gray-600 hover:bg-amber-50 hover:text-amber-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
          <p className="text-gray-600">{item.description}</p>
          <div className="flex gap-2 flex-wrap">
            <Badge>{item.region}</Badge>
            <Badge>{item.province}</Badge>
            {item.tags?.map((t) => <Badge key={t}>#{t}</Badge>)}
          </div>
        </div>
      </div>
    </div>
  );
};

const MotifExplorer: React.FC = () => {
  const [motifs, setMotifs] = useState<MotifItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedRegencyId, setSelectedRegencyId] = useState<string>("");
  const [detail, setDetail] = useState<MotifItem | null>(null);
  
  // Wilayah Indonesia states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingRegencies, setLoadingRegencies] = useState(false);

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const res = await fetch(`${WILAYAH_API_URL}/provinces`);
        if (!res.ok) throw new Error("Gagal mengambil data provinsi");
        const data: Province[] = await res.json();
        setProvinces(data);
      } catch (err) {
        console.error("Error fetching provinces:", err);
      } finally {
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch regencies when province is selected
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
        if (!res.ok) throw new Error("Gagal mengambil data kota/kabupaten");
        const data: Regency[] = await res.json();
        setRegencies(data);
        setSelectedRegencyId(""); // Reset regency selection
      } catch (err) {
        console.error("Error fetching regencies:", err);
      } finally {
        setLoadingRegencies(false);
      }
    };
    fetchRegencies();
  }, [selectedProvinceId]);

  // Fetch motifs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await motifService.getAll();
        // Backend returns array directly
        const data = Array.isArray(res.data) ? res.data : [];
        setMotifs(data);
      } catch (err) {
        console.error("Gagal memuat data motif:", err);
        setMotifs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter motifs based on selected province and regency
  const filtered = useMemo(() => {
    let data = [...motifs];

    // Filter by province
    if (selectedProvinceId) {
      const selectedProvince = provinces.find(p => p.id === selectedProvinceId);
      if (selectedProvince) {
        // Motif province format: "KOTA YOGYAKARTA, DI YOGYAKARTA" or "KABUPATEN REMBANG, JAWA TENGAH"
        // Check if province name is in the motif.province string
        data = data.filter((d) => {
          const provinceName = selectedProvince.name.toUpperCase();
          return d.province.toUpperCase().includes(provinceName);
        });
      }
    }

    // Filter by regency (kabupaten/kota)
    if (selectedRegencyId) {
      const selectedRegency = regencies.find(r => r.id === selectedRegencyId);
      if (selectedRegency) {
        // Check if regency name is in the motif.province string
        data = data.filter((d) => {
          const regencyName = selectedRegency.name.toUpperCase();
          return d.province.toUpperCase().includes(regencyName);
        });
      }
    }

    // Filter by search query
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      data = data.filter((d) =>
        [d.name, d.description, d.region, d.province, ...(d.tags || [])]
          .map((x) => x.toLowerCase())
          .join(" ")
          .includes(q)
      );
    }
    return data;
  }, [query, selectedProvinceId, selectedRegencyId, motifs, provinces, regencies]);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Motif Explorer</h1>
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari motif…"
              className="border border-gray-300 px-3 py-2 rounded-lg pl-10 w-full 
                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
            />
          </div>

          <select
            value={selectedProvinceId}
            onChange={(e) => {
              setSelectedProvinceId(e.target.value);
              setSelectedRegencyId("");
            }}
            disabled={loadingProvinces}
            className="border border-gray-300 px-3 py-2 rounded-lg cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition
              disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <option value="">
              {loadingProvinces ? "Memuat provinsi..." : "Semua Provinsi"}
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
            disabled={!selectedProvinceId || loadingRegencies}
            className={`border border-gray-300 px-3 py-2 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition
              ${!selectedProvinceId || loadingRegencies 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "cursor-pointer"}`}
          >
            <option value="">
              {!selectedProvinceId 
                ? "Pilih Provinsi dulu" 
                : loadingRegencies 
                ? "Memuat kabupaten/kota..." 
                : "Semua Kabupaten/Kota"}
            </option>
            {regencies.map((regency) => (
              <option key={regency.id} value={regency.id}>
                {regency.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
              >
                <Skeleton className="h-44 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setDetail(item)}
                  aria-label={`Lihat detail ${item.name}`}
                  className="border border-gray-200 rounded-xl overflow-hidden shadow-sm 
                    hover:shadow-md hover:border-amber-300 transition text-left 
                    focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <img src={item.image} alt={item.name} className="h-44 w-full object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge>{item.region}</Badge>
                      <Badge>{item.province}</Badge>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Tidak ada motif ditemukan</p>
              </div>
            )}
          </div>
        )}
        <DetailModal item={detail} onClose={() => setDetail(null)} />
      </div>
    </section>
  );
};

export default MotifExplorer;
