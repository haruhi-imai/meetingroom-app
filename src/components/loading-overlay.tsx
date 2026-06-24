export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[120] bg-[linear-gradient(180deg,rgba(255,253,251,0.62)_0%,rgba(242,248,255,0.72)_58%,rgba(255,240,229,0.62)_100%)] backdrop-blur-[6px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,239,255,0.92),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,232,217,0.85),transparent_30%)]" />
      <div className="absolute right-6 bottom-6 flex flex-col items-end gap-3 md:right-8 md:bottom-8">
        <div className="loading-orbit-scene">
          <div className="loading-orbit-mover">
            <div className="loading-orbit-triangle" />
          </div>
        </div>
        <p className="text-right text-[11px] font-semibold tracking-[0.28em] text-slate-900/80">
          NOW LOADING
        </p>
      </div>
    </div>
  );
}
