export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[120] bg-black/45 backdrop-blur-[2px]">
      <div className="absolute right-6 bottom-6 flex flex-col items-end gap-3 md:right-8 md:bottom-8">
        <div className="loading-orbit-scene">
          <div className="loading-orbit-mover">
            <div className="loading-orbit-triangle" />
          </div>
        </div>
        <p className="text-right text-[11px] font-semibold tracking-[0.28em] text-white/88">
          NOW LOADING
        </p>
      </div>
    </div>
  );
}
