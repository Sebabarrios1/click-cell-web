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
    <div className="flex h-screen items-center justify-center bg-[#f8fafc] text-blue-500 font-sans">
      <div className="animate-pulse font-black tracking-widest text-2xl uppercase italic">Click Cell...</div>
    </div>
  );

  const destacados = productos.filter((p: any) =>
    p.Destacado?.trim().toUpperCase() === "SI" && p.Stock?.trim().toUpperCase() === "SI"
  );

  const resto = productos.filter((p: any) =>
    p.Destacado?.trim().toUpperCase() !== "SI" && p.Stock?.trim().toUpperCase() === "SI"
  );

  return (
    <main className="min-h-screen bg-[#f3f4f6] text-slate-800 font-sans selection:bg-blue-100">
      {/* NAVBAR */}
      <nav className="bg-white/70 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 py-3">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-blue-400 shadow-sm bg-white transition-all hover:scale-105">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden xs:block">
              <h1 className="text-xl font-black tracking-tighter leading-none text-slate-900">CLICK CELL</h1>
              <p className="text-[9px] uppercase tracking-[0.2em] text-blue-500 font-bold">Santa Fe</p>
            </div>
          </div>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-full text-xs font-black shadow-md shadow-blue-200 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest">
            WHATSAPP
          </a>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative py-16 md:py-24 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center md:text-left">
          <span className="text-blue-400 font-bold tracking-[0.2em] text-[10px] uppercase mb-3 block">Premium Tech Store</span>
          <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9] text-slate-900">
            EL FUTURO <br />
            <span className="text-blue-500 font-normal not-italic">
              EN TU MANO.
            </span>
          </h2>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 blur-[100px] rounded-full -translate-y-1/2 opacity-60"></div>
      </header>

      {/* GRILLAS */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        {destacados.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-black tracking-tighter uppercase italic text-slate-800">Destacados</h2>
              <div className="h-[1px] flex-grow bg-slate-200"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {destacados.map((p, index) => (
                <CardProducto key={index} producto={p} esDestacado={true} onClick={() => setSelectedProduct(p)} />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mb-10">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Explorá el stock</h3>
          <div className="h-[1px] flex-grow bg-slate-200"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {resto.map((p, index) => (
            <CardProducto key={index} producto={p} esDestacado={false} onClick={() => setSelectedProduct(p)} />
          ))}
        </div>
      </section>

      {selectedProduct && <ModalProducto producto={selectedProduct} onClose={() => setSelectedProduct(null)} />}

      <footer className="border-t border-slate-200 py-12 bg-white text-center">
        <p className="text-slate-400 text-[10px] tracking-widest uppercase">© 2026 Click Cell Santa Fe</p>
      </footer>
    </main>
  );
}

// FUNCION AUXILIAR PARA PRECIOS
function formatPrecio(precio: number, moneda: string) {
  if (moneda?.trim().toUpperCase() === "USD") {
    return `USD ${precio.toLocaleString('en-US')}`;
  }
  return `$${precio.toLocaleString('es-AR')}`;
}

function CardProducto({ producto, esDestacado, onClick }: any) {
  const fotos = producto.ImagenURL?.split(",").map((s: string) => s.trim()) || [];
  const precioBase = parseFloat(producto.PrecioBase?.toString().replace("$", "").replace(/\./g, "")) || 0;
  const desc = parseFloat(producto.Descuento) || 0;
  const precioFinal = precioBase - (precioBase * (desc / 100));
  const moneda = producto.Moneda || "ARS";

  return (
    <div onClick={onClick} className={`group cursor-pointer relative bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col h-full ${esDestacado ? 'md:flex-row shadow-lg' : 'shadow-sm'}`}>
      <div className={`relative bg-slate-50 overflow-hidden ${esDestacado ? 'md:w-1/2' : 'w-full aspect-square'}`}>
        <img src={fotos[0]} alt={producto.Producto} className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-700" />
        {desc > 0 && <div className="absolute top-4 left-4 bg-blue-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{desc}% OFF</div>}
      </div>
      <div className="p-6 md:p-8 flex flex-col flex-grow justify-center">
        <h3 className={`font-black tracking-tighter text-slate-900 mb-4 uppercase ${esDestacado ? 'text-3xl' : 'text-lg'}`}>{producto.Producto}</h3>
        <div className="mb-6">
          <span className={`font-black text-blue-600 italic ${esDestacado ? 'text-3xl' : 'text-2xl'}`}>{formatPrecio(precioFinal, moneda)}</span>
          {desc > 0 && <span className="block text-slate-300 text-xs line-through font-bold mt-1">{formatPrecio(precioBase, moneda)}</span>}
        </div>
        <div className="mt-auto text-[9px] font-black text-slate-300 tracking-widest uppercase">Detalles +</div>
      </div>
    </div>
  );
}

function ModalProducto({ producto, onClose }: any) {
  const fotos = producto.ImagenURL?.split(",").map((s: string) => s.trim()) || [];
  const [index, setIndex] = useState(0);
  const precioBase = parseFloat(producto.PrecioBase?.toString().replace("$", "").replace(/\./g, "")) || 0;
  const desc = parseFloat(producto.Descuento) || 0;
  const precioFinal = precioBase - (precioBase * (desc / 100));
  const moneda = producto.Moneda || "ARS";
  const descripcionReal = producto.Descripcion || producto.Descripción || producto.descripcion || producto.descripción || "";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-8 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-slate-100 hover:bg-slate-200 text-slate-500 w-10 h-10 rounded-full text-xl">×</button>
        <div className="md:w-1/2 bg-slate-50 relative flex items-center justify-center min-h-[300px] md:min-h-[450px]">
          <img src={fotos[index]} className="max-h-[280px] md:max-h-[400px] object-contain p-6" />
          {fotos.length > 1 && (
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between">
              <button onClick={() => setIndex(index === 0 ? fotos.length - 1 : index - 1)} className="w-8 h-8 rounded-full bg-white shadow-sm text-slate-800">❮</button>
              <button onClick={() => setIndex(index === fotos.length - 1 ? 0 : index + 1)} className="w-8 h-8 rounded-full bg-white shadow-sm text-slate-800">❯</button>
            </div>
          )}
        </div>
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter uppercase text-slate-900 italic">{producto.Producto}</h2>
          <div className="text-slate-500 text-sm leading-relaxed mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-100 whitespace-pre-line">
            {descripcionReal || "Consultanos especificaciones por WhatsApp."}
          </div>
          <div className="mb-8">
            <span className="text-4xl font-black text-blue-600 italic">{formatPrecio(precioFinal, moneda)}</span>
          </div>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola! Info del ${producto.Producto}`} target="_blank" className="block w-full bg-slate-900 text-white text-center py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all">WHATSAPP</a>
        </div>
      </div>
    </div>
  );
}