import React, { useMemo, useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import type { Island, MotifItem } from "../assets/data/dataset";
import { useWastra } from "../context/WastraContext";
import { API_URL } from "../../config";

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


const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-200 dark:ring-amber-700">
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
  const { token } = useWastra();
  const [motifs, setMotifs] = useState<MotifItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [island, setIsland] = useState<Island | "">("");
  const [province, setProvince] = useState("");
  const [detail, setDetail] = useState<MotifItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Gagal memuat data motif");
        const data = await res.json();
        setMotifs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const provinceOptions = useMemo(() => {
    const base = island ? motifs.filter((m) => m.region === island) : motifs;
    return Array.from(new Set(base.map((m) => m.province))).sort();
  }, [island, motifs]);

  const filtered = useMemo(() => {
    let data = [...motifs];
    if (island) data = data.filter((d) => d.region === island);
    if (province) data = data.filter((d) => d.province === province);

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
  }, [query, island, province, motifs]);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Motif Explorer</h1>
        {loading ? (
          <p className="text-center">Memuat data...</p>
        ) : (
          <>
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
                value={island}
                onChange={(e) => {
                  setIsland(e.target.value as Island | "");
                  setProvince("");
                }}
                className="border border-gray-300 px-3 py-2 rounded-lg cursor-pointer
                  focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              >
                <option value="">Semua Pulau</option>
                {ISLAND_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>

              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                disabled={!island}
                className={`border border-gray-300 px-3 py-2 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition
                  ${!island ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <option value="">
                  {island ? "Semua Provinsi" : "Pilih Pulau dulu"}
                </option>
                {provinceOptions.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
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
              ))}
            </div>
          </>
        )}
        <DetailModal item={detail} onClose={() => setDetail(null)} />
      </div>
    </section>
  );
};

export default MotifExplorer;
