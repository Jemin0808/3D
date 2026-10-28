import React from 'react';
import { CampusBuilding } from '../data/ldceCampusData';
import { X, MapPin, Calendar, Layers, Maximize2, Compass, Award, ExternalLink } from 'lucide-react';

interface Props {
  building: CampusBuilding | null;
  onClose: () => void;
  onFocusBuilding: (building: CampusBuilding) => void;
}

export const BuildingDetailModal: React.FC<Props> = ({
  building,
  onClose,
  onFocusBuilding,
}) => {
  if (!building) return null;

  const footprintArea = building.dimensions.width * building.dimensions.length;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>{building.code}</span>
            <span className="text-slate-600">·</span>
            <span className="capitalize text-slate-400">{building.category}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 font-display leading-snug">
            {building.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Close building details"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm text-slate-300">
        {/* Photo Reference (if available) */}
        {building.imageThumbnail && (
          <div className="relative rounded-xl overflow-hidden border border-slate-800 group">
            <img
              src={building.imageThumbnail}
              alt={building.name}
              referrerPolicy="no-referrer"
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-[11px] text-slate-300 font-medium bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-sm">
                Architectural Photographic Reference
              </span>
            </div>
          </div>
        )}

        {/* Quick Architectural Metric Grid */}
        <div className="grid grid-cols-3 gap-2.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-xs">
          <div className="space-y-0.5">
            <div className="text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Built</span>
            </div>
            <div className="font-semibold text-slate-200 font-mono">{building.yearBuilt}</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-slate-500 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Storeys</span>
            </div>
            <div className="font-semibold text-slate-200 font-mono">{building.floors} Floors</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-slate-500 flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Footprint</span>
            </div>
            <div className="font-semibold text-cyan-400 font-mono">{footprintArea} m²</div>
          </div>
        </div>

        {/* Architectural Scale Breakdown */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Architectural Scale & Dimensions
          </h3>
          <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Width (X-Axis):</span>
              <span className="text-slate-200">{building.dimensions.width} meters</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Length (Z-Axis):</span>
              <span className="text-slate-200">{building.dimensions.length} meters</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Height (Y-Axis):</span>
              <span className="text-slate-200">{building.dimensions.height} meters</span>
            </div>
            <div className="flex justify-between border-t border-slate-800/80 pt-1.5">
              <span className="text-slate-400">Roof Architecture:</span>
              <span className="text-amber-400 capitalize">{building.roofType || 'Flat RCC Terrace'}</span>
            </div>
          </div>
        </div>

        {/* Architectural Details */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Design & Construction Idiom
          </h3>
          <p className="text-xs leading-relaxed text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
            {building.architectureDetails}
          </p>
        </div>

        {/* Overview */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Overview
          </h3>
          <p className="text-xs leading-relaxed text-slate-300">
            {building.description}
          </p>
        </div>

        {/* Departments Housed */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Departments & Cells
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {building.departmentsHoused.map((dept) => (
              <span
                key={dept}
                className="px-2.5 py-1 bg-slate-800/80 rounded-md text-xs text-slate-200 border border-slate-700/60"
              >
                {dept}
              </span>
            ))}
          </div>
        </div>

        {/* Key Labs & Facilities */}
        {building.keyLabsAndFacilities.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Key Laboratories & Facilities
            </h3>
            <div className="space-y-2">
              {building.keyLabsAndFacilities.map((lab) => (
                <div
                  key={lab.name}
                  className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-200">{lab.name}</span>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase">{lab.type}</span>
                  </div>
                  <p className="text-slate-400 leading-normal">{lab.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historical Note */}
        {building.historicalNote && (
          <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Campus Heritage</span>
            </div>
            <p className="text-amber-200/80 leading-relaxed">{building.historicalNote}</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
        <button
          onClick={() => onFocusBuilding(building)}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-medium text-xs rounded-xl shadow-lg shadow-cyan-900/30 transition-colors"
        >
          <Compass className="w-4 h-4" />
          <span>Inspect in 3D</span>
        </button>
        <a
          href="https://ldce.ac.in"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl border border-slate-700 transition-colors"
        >
          <span>ldce.ac.in</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
