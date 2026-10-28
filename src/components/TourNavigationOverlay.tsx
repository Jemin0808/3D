import React from 'react';
import { CAMPUS_TOUR_STOPS } from '../data/ldceCampusData';
import { ChevronLeft, ChevronRight, X, Play, Pause } from 'lucide-react';

interface Props {
  activeTourIndex: number;
  onTourIndexChange: (index: number) => void;
  onExitTour: () => void;
}

export const TourNavigationOverlay: React.FC<Props> = ({
  activeTourIndex,
  onTourIndexChange,
  onExitTour,
}) => {
  const currentStop = CAMPUS_TOUR_STOPS[activeTourIndex];
  const totalStops = CAMPUS_TOUR_STOPS.length;

  const handlePrev = () => {
    onTourIndexChange((activeTourIndex - 1 + totalStops) % totalStops);
  };

  const handleNext = () => {
    onTourIndexChange((activeTourIndex + 1) % totalStops);
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-2xl z-30 pointer-events-auto">
      <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950 border border-cyan-800 text-cyan-400">
              STOP {activeTourIndex + 1} OF {totalStops}
            </span>
            <h3 className="text-sm font-bold text-slate-100 truncate">
              {currentStop.name}
            </h3>
          </div>
          <button
            onClick={onExitTour}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title="Exit guided tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-3">
          {currentStop.description}
        </p>

        <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {CAMPUS_TOUR_STOPS.map((stop, i) => (
              <button
                key={stop.id}
                onClick={() => onTourIndexChange(i)}
                className={`h-1.5 rounded-full transition-all ${i === activeTourIndex ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'}`}
                title={stop.name}
              />
            ))}
          </div>

          {/* Stepper buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handlePrev}
              className="p-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 rounded-lg border border-slate-800 text-slate-300 transition-colors"
              title="Previous landmark"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-medium text-xs rounded-lg shadow transition-colors"
              title="Next landmark"
            >
              <span>Next Stop</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
