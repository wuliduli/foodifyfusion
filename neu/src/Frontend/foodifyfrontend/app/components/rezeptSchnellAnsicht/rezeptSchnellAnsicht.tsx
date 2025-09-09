import Image from "next/image";

export default function RezeptSchnellAnsicht() {
  return (
    <a href="/rezeptansicht">
    <div className="w-64 rounded-2xl shadow-lg bg-white overflow-hidden">
      <Image
        src="/rinderroulade.jpg" // Passe den Pfad ggf. an
        alt="Rinderroulade"
        width={260}
        height={160}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <p className="font-semibold text-lg mb-2">Rezeptname auch lang +</p>
        <div className="flex items-center mb-2">
          {/* Sterne-Bewertung */}
          <Star filled />
          <Star filled />
          <Star filled />
          <Star filled />
          <Star />
        </div>
        <div className="flex items-center text-base text-black">
          {/* Uhr-Icon */}
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 6v6l4 2"/>
          </svg>
          24 Min
        </div>
      </div>
    </div>
    </a>
  );
}

// Stern-Komponente
export function Star({ filled = false }: { filled?: boolean }) {
  return filled ? (
    <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/>
    </svg>
  ) : (
    <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/>
    </svg>
  );
}