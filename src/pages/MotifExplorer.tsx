import React, { useMemo, useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import type { MotifItem } from "../assets/data/dataset";
import { motifService } from "../services/api";
import { WILAYAH_API_URL } from "../../config";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "../context/I18nContext";
import batikNames from "../assets/class_names.json";

interface Province {
  id: string;
  name: string;
}

interface Regency {
  id: string;
  province_id: string;
  name: string;
}

const PremiumBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-md bg-amber-600 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white ring-1 ring-inset ring-amber-700/20 backdrop-blur-sm shadow-sm transition-colors uppercase">
    {children}
  </span>
);

const DetailModal = ({ item, onClose }: { item: MotifItem | null; onClose: () => void }) => {
  const [description, setDescription] = useState(item?.description);
  const [loadingDesc, setLoadingDesc] = useState(false);

  useEffect(() => {
    if (item && item.description === "Klik untuk melihat detail filosofi motif ini.") {
      setLoadingDesc(true);
      fetch(`/api/philosophy?name=${encodeURIComponent(item.name)}`)
        .then(res => res.json())
        .then(data => setDescription(data.philosophy))
        .catch(() => setDescription("Gagal memuat deskripsi."))
        .finally(() => setLoadingDesc(false));
    }
  }, [item]);

  if (!item) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl rounded-3xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden transition-all transform scale-100 opacity-100 flex flex-col md:flex-row border border-white/20 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/30 pointer-events-none" />
          <button
            onClick={onClose}
            aria-label="Tutup detail"
            className="absolute left-4 top-4 md:hidden rounded-full bg-black/40 backdrop-blur-md p-2 text-white hover:bg-black/60 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col max-h-[70vh] md:max-h-[85vh] overflow-y-auto custom-scrollbar relative bg-gradient-to-br from-white to-amber-50/30 dark:from-gray-900 dark:to-gray-900">
          <button
            onClick={onClose}
            aria-label="Tutup detail"
            className="absolute right-6 top-6 hidden md:flex rounded-full bg-gray-100 dark:bg-gray-800 p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 dark:hover:bg-gray-700 dark:hover:text-white transition-all shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="space-y-6 flex-grow">
            <div>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2 font-serif">{item.name}</h3>
              <div className="h-1 w-12 bg-amber-500 rounded-full mb-4"></div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <PremiumBadge>{item.region}</PremiumBadge>
              <PremiumBadge>{item.province}</PremiumBadge>
              {item.tags?.map((t) => <PremiumBadge key={t}>#{t}</PremiumBadge>)}
            </div>

            <div className="prose prose-amber dark:prose-invert max-w-none">
              {loadingDesc ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px]">{description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MotifExplorer: React.FC = () => {
  const { t } = useI18n();
  const [motifs, setMotifs] = useState<MotifItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");
  const [selectedRegencyId, setSelectedRegencyId] = useState<string>("");
  const [detail, setDetail] = useState<MotifItem | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [regencies, setRegencies] = useState<Regency[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch(`${WILAYAH_API_URL}/provinces`);
        if (!res.ok) throw new Error("Gagal mengambil data provinsi");
        const data: Province[] = await res.json();
        setProvinces(data);
      } catch (err) {
        console.error("Error fetching provinces:", err);
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
      try {
        const res = await fetch(`${WILAYAH_API_URL}/regencies/${selectedProvinceId}`);
        if (!res.ok) throw new Error("Gagal mengambil data kota/kabupaten");
        const data: Regency[] = await res.json();
        setRegencies(data);
        setSelectedRegencyId("");
      } catch (err) {
        console.error("Error fetching regencies:", err);
      }
    };
    fetchRegencies();
  }, [selectedProvinceId]);

  // Helper to get exact image name based on the public/gallery files
  const getExactImageName = (name: string) => {
    // Basic conversion strategy: 
    // "Batik Jawa Tengah Arumdalu" -> "JawaTengah_Arumdalu"
    // "Batik Bali Barong" -> "Bali_Barong"
    // Remove "Batik " and split remaining
    const withoutBatik = name.replace("Batik ", "");
    
    // Check specific complex names based on directory contents
    if (withoutBatik.startsWith("Jakarta Ondelondel")) return "Jakarta_OndelOndel";
    if (withoutBatik.startsWith("Jawa Barat")) return "JawaBarat_Megamendung";
    if (withoutBatik.startsWith("Jawa Tengah")) {
      const motifPart = withoutBatik.replace("Jawa Tengah ", "");
      // Map complex sub-words
      const complexMap: Record<string, string> = {
        "Asemarang": "AsemArang",
        "Asemsinom": "AsemSinom",
        "Asemwarak": "AsemWarak",
        "Cindewilis": "CindeWilis",
        "Gambangsemarangan": "GambangSemarangan",
        "Ikankerang": "IkanKerang",
        "Jagunglombok": "JagungLombok",
        "Jambubelimbing": "JambuBelimbing",
        "Jambucitra": "JambuCitra",
        "Jayakusuma": "JayaKusuma",
        "Kembangsepatu": "KembangSepatu",
        "Luriksemangka": "LurikSemangka",
        "Masjidagungdemak": "MasjidAgungDemak",
        "Parangkusumo": "ParangKusumo",
        "Parangslobog": "ParangSlobog",
        "Sarimulat": "SariMulat",
        "Sekargudhe": "SekarGudhe",
        "Tanjunggunung": "TanjungGunung",
        "Tebubambu": "TebuBambu",
        "Tugumuda": "TuguMuda",
        "Warakberasutah": "WarakBerasUtah",
        "Worawarirumpuk": "WorawariRumpuk"
      };
      return `JawaTengah_${complexMap[motifPart] || motifPart}`;
    }
    if (withoutBatik.startsWith("Jawa Timur")) {
      return `JawaTimur_${withoutBatik.replace("Jawa Timur ", "")}`;
    }
    if (withoutBatik.startsWith("Kalimantan Barat")) {
      return `KalimantanBarat_${withoutBatik.replace("Kalimantan Barat ", "")}`;
    }
    if (withoutBatik.startsWith("Kalimantan Dayak")) return "Kalimantan_Dayak";
    if (withoutBatik.startsWith("Lampunggajah")) return "Lampung_Gajah";
    if (withoutBatik.startsWith("Lampung Kacang Hijau")) return "Lampung_KacangHijau";
    if (withoutBatik.startsWith("Lampung Bledheg")) return "Lampung_Bledheg";
    if (withoutBatik.startsWith("Malukupala")) return "Maluku_Pala";
    if (withoutBatik.startsWith("NTB Lumbung")) return "NTB_Lumbung";
    if (withoutBatik.startsWith("Papua")) {
       return `Papua_${withoutBatik.replace("Papua ", "")}`;
    }
    if (withoutBatik.startsWith("Sulawesi Selatan")) {
      return `SulawesiSelatan_${withoutBatik.replace("Sulawesi Selatan ", "")}`;
    }
    if (withoutBatik.startsWith("Sumatera Barat")) {
      return `SumateraBarat_${withoutBatik.replace("Sumatera Barat ", "").replace(/\s/g, '')}`;
    }
    if (withoutBatik.startsWith("Sumatera Utara")) {
      return `SumateraUtara_${withoutBatik.replace("Sumatera Utara ", "").replace(/\s/g, '')}`;
    }
    if (withoutBatik.startsWith("Yogyakarta")) {
      const motifPart = withoutBatik.replace("Yogyakarta ", "");
      const complexMap: Record<string, string> = {
        "Cakarayam": "CakarAyam",
        "Ceplokliring": "CeplokLiring",
        "Jayakirana": "JayaKirana",
        "Klampokarum": "KlampokArum",
        "Kuncupkanthil": "KuncupKanthil",
        "Parangcurigo": "ParangCurigo",
        "Parangrusak": "ParangRusak",
        "Parangtuding": "ParangTuding",
        "Sekarandhong": "SekarAndhong",
        "Sekarblimbing": "SekarBlimbing",
        "Sekarcengkeh": "SekarCengkeh",
        "Sekardangan": "SekarDangan",
        "Sekardhuku": "SekarDhuku",
        "Sekardlima": "SekarDlima",
        "Sekarduren": "SekarDuren",
        "Sekargambir": "SekarGambir",
        "Sekargayam": "SekarGayam",
        "Sekarjagung": "SekarJagung",
        "Sekarjali": "SekarJali",
        "Sekarjeruk": "SekarJeruk",
        "Sekarkeben": "SekarKeben",
        "Sekarkemuning": "SekarKemuning",
        "Sekarkenanga": "SekarKenanga",
        "Sekarkenikir": "SekarKenikir",
        "Sekarkenthang": "SekarKenthang",
        "Sekarkepel": "SekarKepel",
        "Sekarketongkeng": "SekarKetongkeng",
        "Sekarlintang": "SekarLintang",
        "Sekarmanggis": "SekarManggis",
        "Sekarmenur": "SekarMenur",
        "Sekarmindi": "SekarMindi",
        "Sekarmlathi": "SekarMlathi",
        "Sekarmrica": "SekarMrica",
        "Sekarmundhu": "SekarMundhu",
        "Sekarnangka": "SekarNangka",
        "Sekarpacar": "SekarPacar",
        "Sekarpala": "SekarPala",
        "Sekarpijetan": "SekarPijetan",
        "Sekarpudhak": "SekarPudhak",
        "Sekarrandhu": "SekarRandhu",
        "Sekarsawo": "SekarSawo",
        "Sekarsoka": "SekarSoka",
        "Sekarsrengenge": "SekarSrengenge",
        "Sekarsrigadhing": "SekarSrigadhing",
        "Sekartanjung": "SekarTanjung",
        "Sekartebu": "SekarTebu"
      };
      return `Yogyakarta_${complexMap[motifPart] || motifPart}`;
    }

    // Default fallback (e.g. Bali Barong -> Bali_Barong)
    return withoutBatik.replace(" ", "_");
  };

 useEffect(() => {
  const fetchData = async () => {
    try {
      const dbres = await motifService.getAll();
      let resdata = Array.isArray(dbres.data) ? dbres.data : [];

      // Gunakan langsung data dari API karena user menghubungkan ke production DB
      setMotifs(resdata);

    } catch (err) {
      console.log("Error API, menggunakan sepenuhnya data class_names.json");
      const localData = batikNames.map((name, index) => {
        const fileName = getExactImageName(name);
        
        return {
          id: `local-${index}`,
          name: name,
          image: `/gallery/${fileName}.jpg`, 
          description: "Klik untuk melihat detail filosofi motif ini.",
          province: name.split(" ")[1] || "Indonesia", 
          region: "Indonesia" as any, 
          tags: ["Batik", "Tradisional"],
          createdAt: new Date().toISOString()
        };
      });
      setMotifs(localData);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  const filtered = useMemo(() => {
    let data = [...motifs];

    if (selectedProvinceId) {
      const selectedProvince = provinces.find(p => p.id === selectedProvinceId);
      if (selectedProvince) {
        data = data.filter((d) => {
          const provinceName = selectedProvince.name.toUpperCase();
          return d.province.toUpperCase().includes(provinceName);
        });
      }
    }

    if (selectedRegencyId) {
      const selectedRegency = regencies.find(r => r.id === selectedRegencyId);
      if (selectedRegency) {
        data = data.filter((d) => {
          const regencyName = selectedRegency.name.toUpperCase();
          return d.province.toUpperCase().includes(regencyName);
        });
      }
    }

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

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedProvinceId, selectedRegencyId]);

  // Calculate paginated data
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 bg-[#FAFAFA] dark:bg-[#0B0C10] transition-colors min-h-screen relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-amber-500/10 to-transparent dark:from-amber-600/5 pointer-events-none -translate-y-1/2 rounded-full blur-3xl opacity-60 mix-blend-multiply dark:mix-blend-lighten"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl font-bold text-center mb-3 text-gray-800 dark:text-white">
            {t("gallery.title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("gallery.description")}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-white/40 dark:border-gray-800 p-4 md:p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-12 flex flex-col md:flex-row gap-4 sticky top-24 z-20">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("gallery.searchPlaceholder")}
              className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 transition-all"
            />
          </div>

          <div className="flex gap-4 md:w-auto w-full">
            <div className="relative flex-1 md:w-56">
              <select
                value={selectedProvinceId}
                onChange={(e) => setSelectedProvinceId(e.target.value)}
                className="block w-full px-4 py-3.5 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white"
              >
                <option value="">{t("gallery.allProvinces")}</option>
                {provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full rounded-[28px]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">Tidak ada motif yang ditemukan.</h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedData.map((item) => (
              <button
                key={item.id}
                onClick={() => setDetail(item)}
                className="group relative flex flex-col items-start bg-white dark:bg-gray-900 rounded-[28px] overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-amber-200 text-left transition-all duration-500 transform hover:-translate-y-1"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1 w-full">
                  <span className="text-xs font-bold uppercase text-amber-600 mb-2">{item.province || item.region}</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 font-serif">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4">{item.description}</p>
                </div>
              </button>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12 mb-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t("gallery.previously") || "Sebelumnya"}
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNumber = i + 1;
                    // Tampilkan maksimal 5 tombol halaman: awal, akhir, dan sekitarnya
                    if (
                      pageNumber === 1 || 
                      pageNumber === totalPages || 
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-all ${
                            currentPage === pageNumber
                              ? "bg-amber-500 text-white shadow-md"
                              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      (pageNumber === currentPage - 2 && currentPage > 3) || 
                      (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return <span key={pageNumber} className="px-2 py-2 text-gray-500">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t("gallery.next") || "Selanjutnya"}
                </button>
              </div>
            )}
          </>
        )}
        
        {/* Modal dengan Logika Baru */}
        {detail && <DetailModal item={detail} onClose={() => setDetail(null)} />}
      </div>
    </section>
  );
};

export default MotifExplorer;