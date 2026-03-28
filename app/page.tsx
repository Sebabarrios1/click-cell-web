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
    <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-blue-500 font-sans">
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
    <main className="min-h-screen bg-[#0f0f0f] text-gray-100 font-sans selection:bg-blue-500/30">

      {/* NAVBAR */}
      <nav className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 py-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.6)] bg-black transition-all hover:scale-110">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-black tracking-tighter leading-none text-white">CLICK CELL</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-bold">Santa Fe</p>
            </div>
          </div>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank"
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full text-xs font-black shadow-lg uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
            WHATSAPP
          </a>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative py-24 overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center md:text-left">
          <span className="text-blue-500 font-bold tracking-[0.2em] text-[10px] uppercase mb-4 block">Santa Fe, Argentina</span>
          <h2 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter italic leading-[0.9]">
            EL FUTURO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-700 font-normal not-italic">
              EN TU MANO.
            </span>
          </h2>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[150px] rounded-full translate-x-1/2"></div>
      </header>

      {/* DESTACADOS */}
      {destacados.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">Destacados</h2>
            <div className="h-[2px] flex-grow bg-gradient-to-r from-blue-600 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {destacados.map((p, index) => (
              <CardProducto key={index} producto={p} esDestacado={true} onClick={() => setSelectedProduct(p)} />
            ))}
          </div>
        </section>
      )}

      {/* STOCK DISPONIBLE */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="flex items-center gap-6 mb-12">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em]">Explorá el stock</h3>
          <div className="h-[1px] flex-grow bg-white/5"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {resto.map((p, index) => (
            <CardProducto key={index} producto={p} esDestacado={false} onClick={() => setSelectedProduct(p)} />
          ))}
        </div>
      </section>

      {/* MODAL DETALLE */}
      {selectedProduct && (
        <ModalProducto
          producto={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-16 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="w-20 h-20 mx-auto mb-6 opacity-60 grayscale hover:grayscale-0 transition-all hover:opacity-100 rounded-full overflow-hidden border border-white/10 bg-black p-1 shadow-inner">
            <img src="/logo.png" alt="Logo Footer" className="w-full h-full object-cover rounded-full" />
          </div>
          <p className="text-gray-500 text-xs tracking-widest uppercase">© 2026 Click Cell Santa Fe</p>
        </div>
      </footer>
    </main>
  );
}

function CardProducto({ producto, esDestacado, onClick }: any) {
  const fotos = producto.ImagenURL?.split(",").map((s: string) => s.trim()) || [];
  const precioBase = parseFloat(producto.PrecioBase?.toString().replace("$", "").replace(".", "")) || 0;
  const desc = parseFloat(producto.Descuento) || 0;
  const precioFinal = precioBase - (precioBase * (desc / 100));

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer relative bg-[#161616] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-blue-500/40 transition-all duration-500 flex flex-col h-full shadow-2xl ${esDestacado ? 'md:flex-row' : ''}`}
    >
      <div className={`relative bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] overflow-hidden ${esDestacado ? 'md:w-1/2' : 'w-full aspect-[4/5]'}`}>
        <img
          src={fotos[0]}
          alt={producto.Producto}
          className="w-full h-full object-contain p-8 md:p-12 group-hover:scale-110 transition-transform duration-700"
        />
        {desc > 0 && (
          <div className="absolute top-6 left-6 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
            {desc}% OFF
          </div>
        )}
      </div>

      <div className="p-10 flex flex-col flex-grow justify-center">
        <h3 className={`font-black tracking-tighter text-white mb-6 uppercase ${esDestacado ? 'text-4xl' : 'text-2xl'}`}>
          {producto.Producto}
        </h3>
        <div className="mb-8 flex flex-col gap-1">
          {desc > 0 && (
            <span className="text-gray-600 text-sm line-through decoration-blue-500 font-bold">${precioBase.toLocaleString('es-AR')}</span>
          )}
          <span className={`font-black text-white italic ${esDestacado ? 'text-4xl' : 'text-3xl'}`}>
            ${precioFinal.toLocaleString('es-AR')}
          </span>
        </div>
        <div className="mt-auto text-[10px] font-black text-blue-500 tracking-widest uppercase">
          Ver detalles →
        </div>
      </div>
    </div>
  );
}

function ModalProducto({ producto, onClose }: any) {
  const fotos = producto.ImagenURL?.split(",").map((s: string) => s.trim()) || [];
  const [index, setIndex] = useState(0);

  const precioBase = parseFloat(producto.PrecioBase?.toString().replace("$", "").replace(".", "")) || 0;
  const desc = parseFloat(producto.Descuento) || 0;
  const precioFinal = precioBase - (precioBase * (desc / 100));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#111] w-full max-w-5xl min-h-[500px] rounded-[3rem] overflow-hidden border border-white/10 flex flex-col md:flex-row relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 bg-white/10 hover:bg-red-600 text-white w-12 h-12 rounded-full text-2xl transition-colors font-bold shadow-lg"
        >
          ×
        </button>

        {/* IZQUIERDA: FOTOS */}
        <div className="md:w-1/2 bg-white relative flex items-center justify-center min-h-[400px]">
          <img src={fotos[index]} className="max-h-[350px] md:max-h-[500px] object-contain p-10 transition-all duration-500" />

          {fotos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setIndex(index === 0 ? fotos.length - 1 : index - 1) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/5 hover:bg-black/20 text-black w-10 h-10 rounded-full text-xl"
              >❮</button>
              <button
                onClick={(e) => { e.stopPropagation(); setIndex(index === fotos.length - 1 ? 0 : index + 1) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/5 hover:bg-black/20 text-black w-10 h-10 rounded-full text-xl"
              >❯</button>
            </>
          )}

          <div className="absolute bottom-6 flex gap-2">
            {fotos.map((_: any, i: number) => (
              <div key={i} className={`h-1.5 transition-all rounded-full ${i === index ? 'bg-blue-600 w-6' : 'bg-gray-300 w-1.5'}`} />
            ))}
          </div>
        </div>

        {/* DERECHA: INFO */}
        <div className="md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
          <div className="mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-blue-500 font-bold text-xs tracking-[0.3em] uppercase">Tech Details</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter uppercase italic leading-none">{producto.Producto}</h2>

          <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 border-l border-white/10 pl-6 italic">
            {producto.Descripcion || "Este equipo cuenta con garantía oficial y stock inmediato en Santa Fe. Consultanos por disponibilidad de colores."}
          </p>

          <div className="mb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl md:text-5xl font-black italic text-white tracking-tighter">
                ${precioFinal.toLocaleString('es-AR')}
              </span>
              {desc > 0 && <span className="text-gray-600 line-through font-bold">${precioBase.toLocaleString('es-AR')}</span>}
            </div>
            {producto.Cuotas > 1 && (
              <p className="text-green-500 text-xs font-black mt-2 uppercase tracking-widest">💳 {producto.Cuotas} PAGOS DISPONIBLES</p>
            )}
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola Click Cell! Me interesa el ${producto.Producto}`}
            target="_blank"
            className="block w-full bg-white text-black text-center py-5 rounded-2xl font-black uppercase tracking-widest transition-all hover:bg-blue-600 hover:text-white shadow-xl active:scale-95"
          >
            CONSULTAR AHORA
          </a>
        </div>
      </div>
    </div>
  );
}