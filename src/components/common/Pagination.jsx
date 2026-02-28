import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPage, onChange }) {
  if (totalPage <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: totalPage }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPage || Math.abs(p - page) <= 1)
        .reduce((acc, p, idx, arr) => {
          if (idx > 0 && p - arr[idx - 1] > 1) {
            acc.push("...");
          }
          acc.push(p);
          return acc;
        }, [])
        .map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm font-bold">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition cursor-pointer ${
                p === page
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                  : "border-2 border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500"
              }`}
            >
              {p}
            </button>
          )
        )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPage}
        className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
