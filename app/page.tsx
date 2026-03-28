"use client";
import { useEffect, useState } from "react";
// @ts-ignore
import Papa from "papaparse";

const LINK_EXCEL_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRenKoLwAkllhVjn41RJWW2PD9GA1X3bo__P8dbD1o0yo6u7Sr1Bf_KYuL-i6Y7lpodNF-x1PS7eOWC/pub?output=csv";
const WHATSAPP_NUMBER = "5493425102330";

export default function Home() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

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

      {/* NAVBAR CON LOGO EDITADO */}
      <nav className="bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50 py-4">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">

            {/* LOGO GIGANTE Y SIN BORDES VACÍOS */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-600 shadow-[0_0_25px_rgba(37,99,235,0.6)] bg-black transition-all hover:scale-110">
              {/* Le saqué el padding p-1 y le puse object-cover */}
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>

            <div className="hidden sm:block">
              <h1 className="text-2xl font-black tracking-tighter leading-none text-white">CLICK CELL</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-bold">Santa Fe</p>
            </div>
          </div>

          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank"
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full text-xs font-black shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest">
            WHATSAPP
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
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
        {/* Luces de fondo estilo tech */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[150px] rounded-full translate-x-1/2"></div>
      </header>

      {/* SECCIÓN DESTACADOS */}
      {destacados.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">Destacados</h2>
            <div className="h-[2px] flex-grow bg-gradient-to-r from-blue-600 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {destacados.map((p: any, index) => <CardProducto key={index} producto={p} esDestacado={true} />)}
          </div>
        </section>
      )}

      {/* RESTO DE LOS PRODUCTOS */}
      <section className="max-w-6xl mx-auto px-6 pb-32">
        <div className="flex items-center gap-6 mb-12">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em]">Explorá el stock</h3>
          <div className="h-[1px] flex-grow bg-white/5"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {resto.map((p: any, index) => <CardProducto key={index} producto={p} esDestacado={false} />)}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-20 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="w-24 h-24 mx-auto mb-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 hover:opacity-100">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <p className="text-gray-500 text-[10px] tracking-[0.5em] uppercase font-bold">© 2026 Click Cell Santa Fe</p>
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
    <div className={`group relative bg-[#161616] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-blue-500/40 transition-all duration-500 flex flex-col h-full shadow-2xl ${esDestacado ? 'md:flex-row' : ''}`}>

      {/* IMAGEN */}
      <div className={`relative bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] overflow-hidden ${esDestacado ? 'md:w-1/2' : 'w-full aspect-[4/5]'}`}>
        <img
          src={producto.ImagenURL}
          alt={producto.Producto}
          className="w-full h-full object-contain p-8 md:p-12 group-hover:scale-110 transition-transform duration-700"
        />
        {desc > 0 && (
          <div className="absolute top-6 left-6 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            {desc}% OFF
          </div>
        )}
      </div>

      {/* CONTENIDO */}
      <div className="p-10 flex flex-col flex-grow justify-center">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Disponible</h4>
          </div>
          <h3 className={`font-black tracking-tighter text-white mb-6 uppercase ${esDestacado ? 'text-4xl' : 'text-2xl'}`}>{producto.Producto}</h3>

          <div className="mb-8 flex flex-col gap-1">
            {desc > 0 && (
              <span className="text-gray-600 text-sm line-through decoration-blue-500 font-bold tracking-tighter">
                ${precioBase.toLocaleString('es-AR')}
              </span>
            )}
            <span className={`font-black text-white italic tracking-tighter ${esDestacado ? 'text-4xl' : 'text-3xl'}`}>
              ${precioFinal.toLocaleString('es-AR')}
            </span>
          </div>
        </div>

        {producto.Cuotas > 1 && (
          <div className="text-[10px] font-black text-gray-400 border border-white/10 w-fit px-4 py-2 rounded-xl mb-8 uppercase tracking-widest">
            💳 {producto.Cuotas} PAGOS FIJOS
          </div>
        )}

        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola! Quiero info del ${producto.Producto}`} target="_blank"
          className="bg-white text-black text-center py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-xl active:scale-95">
          Consultar Stock
        </a>
      </div>
    </div>
  );
}