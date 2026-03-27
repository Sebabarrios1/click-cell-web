"use client";
import { useEffect, useState } from "react";
import Papa from "papaparse";

const LINK_EXCEL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRenKoLwAkllhVjn41RJWW2PD9GA1X3bo__P8dbD1o0yo6u7Sr1Bf_KYuL-i6Y7lpodNF-x1PS7eOWC/pub?output=csv";
const WHATSAPP_NUMBER = "5493425555555";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse(LINK_EXCEL_CSV, {
      download: true,
      header: true,
      complete: (results) => {
        const datosLimpios = results.data.filter((p: any) => p.Producto);
        setProductos(datosLimpios);
        setLoading(false);
      },
    });
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-blue-500">
      <div className="animate-pulse font-black tracking-widest text-2xl">CLICK CELL...</div>
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

      {/* NAVBAR ESTILO APPLE */}
      <nav className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 py-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black tracking-tighter leading-none">CLICK CELL</h1>
              <p className="text-[9px] uppercase tracking-[0.3em] text-blue-500 font-bold">Smartphones & Tech</p>
            </div>
          </div>

          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full text-xs font-black shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 uppercase">
            Contacto Directo
          </a>
        </div>
      </nav>

      {/* HERO SECTION / BANNER */}
      <header className="relative py-20 overflow-hidden bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center md:text-left">
          <span className="text-blue-500 font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Santa Fe, Argentina</span>
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter italic">
            EL FUTURO <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-700 font-normal not-italic">EN TU MANO.</span>
          </h2>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[120px] rounded-full"></div>
      </header>

      {/* SECCIÓN DESTACADOS - GRILLA DE LUJO */}
      {destacados.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">Destacados</h2>
            <div className="h-[2px] flex-grow bg-gradient-to-r from-blue-600 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {destacados.map((p: any, index) => <CardProducto key={index} producto={p} esDestacado={true} />)}
          </div>
        </section>
      )}

      {/* RESTO DE LOS PRODUCTOS */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-10">Explorá el stock</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {resto.map((p: any, index) => <CardProducto key={index} producto={p} esDestacado={false} />)}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-16 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="w-16 h-16 mx-auto mb-6 opacity-50 grayscale hover:grayscale-0 transition-all">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <p className="text-gray-500 text-xs tracking-widest uppercase">© 2026 Click Cell Santa Fe</p>
        </div>
      </footer>
    </main>
  );
}

function CardProducto({ producto, esDestacado }: { producto: any, esDestacado: boolean }) {
  const precioBase = parseFloat(producto.PrecioBase?.toString().replace("$", "").replace(".", "")) || 0;
  const desc = parseFloat(producto.Descuento) || 0;
  const precioFinal = precioBase - (precioBase * (desc / 100));

  return (
    <div className={`group relative bg-[#1a1a1a] border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500 flex flex-col h-full shadow-2xl ${esDestacado ? 'md:flex-row' : ''}`}>

      {/* IMAGEN */}
      <div className={`relative bg-gradient-to-br from-[#222] to-[#111] overflow-hidden ${esDestacado ? 'md:w-1/2' : 'w-full aspect-[4/5]'}`}>
        <img
          src={producto.ImagenURL}
          alt={producto.Producto}
          className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-700"
        />
        {desc > 0 && (
          <div className="absolute top-5 left-5 bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
            PROMO {desc}% OFF
          </div>
        )}
      </div>

      {/* CONTENIDO */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex-grow">
          <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">Smartphone</h4>
          <h3 className={`font-black tracking-tighter text-white mb-4 ${esDestacado ? 'text-3xl' : 'text-xl'}`}>{producto.Producto}</h3>

          <div className="mb-6 flex items-baseline gap-3">
            <span className="text-2xl font-black text-white italic">${precioFinal.toLocaleString('es-AR')}</span>
            {desc > 0 && (
              <span className="text-gray-600 text-sm line-through decoration-blue-500">${precioBase.toLocaleString('es-AR')}</span>
            )}
          </div>
        </div>

        {producto.Cuotas > 1 && (
          <div className="text-[10px] font-bold text-gray-400 border border-white/10 w-fit px-3 py-1 rounded-lg mb-6 uppercase">
            💳 {producto.Cuotas} Cuotas fijas
          </div>
        )}

        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola! Quiero info del ${producto.Producto}`}
          target="_blank"
          className="bg-white text-black text-center py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300"
        >
          Consultar Stock
        </a>
      </div>
    </div>
  );
}