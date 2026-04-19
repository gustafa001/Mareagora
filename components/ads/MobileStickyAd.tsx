'use client';

export default function MobileStickyAd() {
  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="max-w-full overflow-x-auto">
        <div className="w-full h-[90px] flex items-center justify-center bg-gray-50">
          {/* Slot para anúncio mobile sticky */}
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-xs text-gray-400">Espaço para anúncio mobile</p>
          </div>
        </div>
      </div>
    </div>
  );
}
