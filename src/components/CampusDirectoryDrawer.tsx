import React, { useState, useMemo } from 'react';
import { LDCE_CAMPUS_BUILDINGS, CampusBuilding } from '../data/ldceCampusData';
import { X, Search, Building2, MapPin, ChevronRight, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectBuilding: (building: CampusBuilding) => void;
}

export const CampusDirectoryDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectBuilding,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredBuildings = useMemo(() => {
    return LDCE_CAMPUS_BUILDINGS.filter((b) => {
      const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        b.name.toLowerCase().includes(query) ||
        b.code.toLowerCase().includes(query) ||
        b.departmentsHoused.some((d) => d.toLowerCase().includes(query)) ||
        b.keyLabsAndFacilities.some((l) => l.name.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 w-full sm:w-[420px] bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100 font-display">Campus Directory</h2>
          <p className="text-xs text-slate-400 mt-0.5">Explore 14 engineering departments & campus blocks</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Close directory"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-slate-800/80 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search departments, labs, blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'academic', label: 'Academic' },
            { id: 'admin', label: 'Admin' },
            { id: 'amenities', label: 'Amenities' },
            { id: 'hostel', label: 'Hostel' },
            { id: 'sports', label: 'Sports' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors text-[11px] font-medium ${
                selectedCategory === cat.id
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Building List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {filteredBuildings.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No departments or blocks found matching &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredBuildings.map((building) => (
            <div
              key={building.id}
              onClick={() => {
                onSelectBuilding(building);
                onClose();
              }}
              className="p-3.5 bg-slate-950/50 hover:bg-slate-800/60 active:bg-slate-800 border border-slate-800/70 hover:border-cyan-700/60 rounded-xl cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold mr-2">
                    {building.code}
                  </span>
                  <span className="text-[11px] text-slate-500 capitalize">
                    {building.category}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </div>

              <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {building.name}
              </h4>

              <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-mono">
                <span>{building.floors} Floors</span>
                <span>·</span>
                <span>{building.dimensions.width}m × {building.dimensions.length}m</span>
                <span>·</span>
                <span>Est. {building.yearBuilt}</span>
              </div>

              {/* Top departments */}
              <div className="flex flex-wrap gap-1 mt-2.5">
                {building.departmentsHoused.slice(0, 2).map((dept) => (
                  <span
                    key={dept}
                    className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-300 truncate max-w-[170px]"
                  >
                    {dept}
                  </span>
                ))}
                {building.departmentsHoused.length > 2 && (
                  <span className="px-1.5 py-0.5 text-[10px] text-slate-500">
                    +{building.departmentsHoused.length - 2} more
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
