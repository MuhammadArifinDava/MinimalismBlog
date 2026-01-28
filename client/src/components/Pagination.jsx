function Pagination({ page, pages, totalPages, onPageChange }) {
  const total = Number.isFinite(totalPages) ? totalPages : pages;
  if (!total || total <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= total;

  return (
    <div className="flex items-center justify-between gap-3 py-4">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={prevDisabled}
        className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur transition hover:bg-white disabled:opacity-50"
      >
        Prev
      </button>
      <div className="text-sm text-slate-600">
        Page {page} / {total}
      </div>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={nextDisabled}
        className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur transition hover:bg-white disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export { Pagination };
