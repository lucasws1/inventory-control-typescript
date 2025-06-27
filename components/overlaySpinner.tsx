export default function OverlaySpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative flex flex-col items-center space-y-8">
        {/* Spinner circular moderno */}
        <div className="relative flex items-center justify-center">
          <span className="absolute inline-flex h-20 w-20 animate-ping rounded-full bg-slate-400/10" />
          <svg
            className="h-16 w-16 animate-spin text-slate-200"
            viewBox="0 0 50 50"
          >
            <circle
              className="opacity-20"
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
            />
            <circle
              className="text-blue-400"
              cx="25"
              cy="25"
              r="20"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray="90 150"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
        {/* Texto elegante */}
        <div className="text-base font-semibold tracking-wider text-slate-200 drop-shadow-lg">
          Processando...
        </div>
        {/* Barra de progresso sutil */}
        <div className="h-1 w-40 overflow-hidden rounded-full bg-slate-700">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-blue-400 via-slate-400 to-blue-300" />
        </div>
      </div>
    </div>
  );
}
