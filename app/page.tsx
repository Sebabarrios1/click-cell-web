"use client";
import { useEffect, useState } from "react";
// @ts-ignore
import Papa from "papaparse";

const LINK_EXCEL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRenKoLwAkllhVjn41RJWW2PD9GA1X3bo__P8dbD1o0yo6u7Sr1Bf_KYuL-i6Y7lpodNF-x1PS7eOWC/pub?output=csv";
const WHATSAPP_NUMBER = "5493425102330";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    Papa.parse(LINK_EXCEL_CSV, {
      download: true,
      header: true,
      complete: (results: any) => {
        const datosLimpios = results.data.filter((p: any) => p.Producto);
        setProductos(datosLimpios);
        setLoading(false);
      },
    });
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f8fafc] text-blue-500 font-sans italic animate-pulse text-2xl font-black">CLICK CELL...</div>
  );

  const destacados = productos.filter((p: any) => p.Destacado?.trim().toUpperCase() === "SI" && p.Stock?.trim().toUpperCase() === "SI");
  const resto = productos.filter((p: any) => p.Destacado?.trim().toUpperCase() !== "SI" && p.Stock?.trim().toUpperCase() === "SI");

  return (
    <main className="min-h-screen bg-[#f1f5f9] text-slate-800 font-sans selection:bg-blue-100">
      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 py-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg bg-white transition-all hover:scale-110">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-black tracking-tighter leading-none text-slate-900">CLICK CELL</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-bold italic">Santa Fe</p>
            </div>
          </div>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full text-xs font-black shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest">WhatsApp</a>
        </div>
      </nav>

      {/* HERO PASTEL */}
      <header className="relative py-20 md:py-32 overflow-hidden bg-white">
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center md:text-left">
          <span className="text-blue-500 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Premium Technology Store</span>
          <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter italic leading-[0.9] text-slate-900">
            EL FUTURO <br /> <span className="text-blue-600 font-normal not-italic">EN TU MANO.</span>
          </h2>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50 blur-[120px] rounded-full translate-x-1/4"></div>
      </header>

      {/* PRODUCTOS */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {destacados.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-6 mb-12">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic text-slate-800">Destacados</h2>
              <div className="h-[2px] flex-grow bg-gradient-to-r from-blue-500 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {destacados.map((p, i) => <CardProducto key={i} producto={p} esDestacado={true} onClick={() => setSelectedProduct(p)} />)}
            </div>
          </section>
        )}

        <section>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.4em] mb-10 text-center md:text-left">Stock Disponible</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {resto.map((p, i) => <CardProducto key={i} producto={p} esDestacado={false} onClick={() => setSelectedProduct(p)} />)}
          </div>
        </section>
      </div>

      {selectedProduct && <ModalProducto producto={selectedProduct} onClose={() => setSelectedProduct(null)} />}

      <footer className="py-20 bg-white border-t border-slate-100 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full overflow-hidden border border-slate-200 p-1 opacity-50 grayscale">
          <img src="/logo.png" alt="Logo" className="w-full h-full object-cover rounded-full" />
        </div>
        <p className="text-slate-400 text-xs tracking-widest uppercase">© 2026 Click Cell Santa Fe</p>
      </footer>
    </main>
  );
}

// --- FUNCIONES COMPLEMENTARIAS ---

function formatPrecio(precio: number, moneda: string) {
  const m = moneda?.toString().trim().toUpperCase();
  if (m === "USD") return `USD ${precio.toLocaleString('en-US')}`;
  return `$${precio.toLocaleString('es-AR')}`;
}

function CardProducto({ producto, esDestacado, onClick }: any) {
  const fotos = producto.ImagenURL?.split(",").map((s: string) => s.trim()) || [];
  const precioLimpio = producto.PrecioBase?.toString().replace(/\$/g, "").replace(/\./g, "").trim();
  const precioBase = parseFloat(precioLimpio) || 0;
  const desc = parseFloat(producto.Descuento) || 0;
  const precioFinal = precioBase - (precioBase * (desc / 100));
  const moneda = producto.Moneda || producto.moneda || "ARS";

  return (
    <div onClick={onClick} className={`group cursor-pointer relative bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col h-full ${esDestacado ? 'md:flex-row shadow-xl' : 'shadow-md'}`}>
      <div className={`relative bg-slate-50 overflow-hidden ${esDestacado ? 'md:w-1/2' : 'w-full aspect-square'}`}>
        <img src={fotos[0]} alt={producto.Producto} className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700" />
        {desc > 0 && <div className="absolute top-6 left-6 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">{desc}% OFF</div>}
      </div>
      <div className="p-8 flex flex-col flex-grow justify-center">
        <h3 className={`font-black tracking-tighter text-slate-900 mb-4 uppercase leading-none ${esDestacado ? 'text-4xl' : 'text-xl'}`}>{producto.Producto}</h3>
        <div className="mb-6 flex flex-col">
          <span className={`font-black text-blue-600 italic leading-none ${esDestacado ? 'text-4xl' : 'text-2xl'}`}>{formatPrecio(precioFinal, moneda)}</span>
          {desc > 0 && <span className="text-slate-300 text-xs line-through font-bold mt-2">{formatPrecio(precioBase, moneda)}</span>}
        </div>
        <div className="mt-auto text-[10px] font-black text-slate-300 tracking-widest uppercase group-hover:text-blue-500 transition-colors">Detalles +</div>
      </div>
    </div>
  );
}

function ModalProducto({ producto, onClose }: any) {
  const fotos = producto.ImagenURL?.split(",").map((s: string) => s.trim()) || [];
  const [index, setIndex] = useState(0);
  const precioLimpio = producto.PrecioBase?.toString().replace(/\$/g, "").replace(/\./g, "").trim();
  const precioBase = parseFloat(precioLimpio) || 0;
  const desc = parseFloat(producto.Descuento) || 0;
  const precioFinal = precioBase - (precioBase * (desc / 100));
  const moneda = producto.Moneda || producto.moneda || "ARS";
  const descrip = producto.Descripcion || producto.Descripción || producto.descripcion || producto.descripción || "";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 z-20 bg-slate-100 hover:bg-red-500 hover:text-white text-slate-500 w-12 h-12 rounded-full text-2xl transition-all font-bold">×</button>
        <div className="md:w-1/2 bg-slate-50 relative flex items-center justify-center min-h-[350px] md:min-h-[500px]">
          <img src={fotos[index]} className="max-h-[300px] md:max-h-[450px] object-contain p-10" />
          {fotos.length > 1 && (
            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between">
              <button onClick={() => setIndex(index === 0 ? fotos.length - 1 : index - 1)} className="w-10 h-10 rounded-full bg-white/90 shadow-md text-slate-800 hover:bg-blue-500 hover:text-white transition-colors text-xl">❮</button>
              <button onClick={() => setIndex(index === fotos.length - 1 ? 0 : index + 1)} className="w-10 h-10 rounded-full bg-white/90 shadow-md text-slate-800 hover:bg-blue-500 hover:text-white transition-colors text-xl">❯</button>
            </div>
          )}
        </div>
        <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase text-slate-900 italic leading-none">{producto.Producto}</h2>
          <div className="text-slate-500 text-sm md:text-base leading-relaxed mb-10 bg-slate-50 p-6 rounded-3xl border border-slate-100 whitespace-pre-line">
            {descrip || "Consultanos los detalles técnicos de este equipo por WhatsApp."}
          </div>
          <div className="mb-10">
            <span className="text-5xl font-black text-blue-600 italic tracking-tighter">{formatPrecio(precioFinal, moneda)}</span>
          </div>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola! Info del ${producto.Producto}`} target="_blank" className="block w-full bg-slate-900 text-white text-center py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95">CONSULTAR AHORA</a>
        </div>
      </div>
    </div>
  );
}