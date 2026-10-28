import React from 'react';
import { LightingMode, CameraMode } from './LDCECampus3D';
import { Sun, Sunset, Moon, Volume2, VolumeX, Compass, BookOpen, Layers } from 'lucide-react';

interface Props {
  lightingMode: LightingMode;
  onLightingChange: (mode: LightingMode) => void;
  cameraMode: CameraMode;
  onCameraModeChange: (mode: CameraMode) => void;
  isAudioActive: boolean;
  onToggleAudio: () => void;
  onOpenDirectory: () => void;
  onOpenHeritageFacts: () => void;
  showScaleRuler: boolean;
  onToggleScaleRuler: () => void;
}

export const CampusTopBar: React.FC<Props> = ({
  lightingMode,
  onLightingChange,
  cameraMode,
  onCameraModeChange,
  isAudioActive,
  onToggleAudio,
  onOpenDirectory,
  onOpenHeritageFacts,
  showScaleRuler,
  onToggleScaleRuler,
}) => {
  return (
    <header className="h-14 px-4 sm:px-6 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between z-30 select-none">
      {/* Zone 1: Single text wordmark */}
      <a href="/" className="text-sm sm:text-base font-bold tracking-tight text-slate-100 font-display shrink-0 hover:text-cyan-400 transition-colors">
        L.D. College of Engineering
      </a>

      {/* Zone 2: 4-5 single-line clean navigation triggers */}
      <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
        <button
          onClick={() => onCameraModeChange(cameraMode === 'tour' ? 'orbit' : 'tour')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap flex items-center gap-1.5 ${cameraMode === 'tour' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Campus Tour</span>
        </button>

        <button
          onClick={() => onCameraModeChange(cameraMode === 'walk' ? 'orbit' : 'walk')}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap flex items-center gap-1.5 ${cameraMode === 'walk' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Walk Mode</span>
        </button>

        <button
          onClick={onOpenDirectory}
          className="hover:text-slate-100 transition-colors whitespace-nowrap"
        >
          Department Directory
        </button>

        <button
          onClick={onOpenHeritageFacts}
          className="hover:text-slate-100 transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Architecture & Heritage</span>
        </button>

        <button
          onClick={onToggleScaleRuler}
          className={`hover:text-slate-100 transition-colors whitespace-nowrap ${showScaleRuler ? 'text-cyan-400' : ''}`}
        >
          Metric Scale
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Time of Day Cycle Control */}
        <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
          <button
            onClick={() => onLightingChange('day')}
            title="Day Lighting"
            className={`p-1.5 rounded-md transition-colors ${lightingMode === 'day' ? 'bg-amber-500/20 text-amber-300' : 'hover:text-slate-200'}`}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => onLightingChange('sunset')}
            title="Sunset Golden Hour"
            className={`p-1.5 rounded-md transition-colors ${lightingMode === 'sunset' ? 'bg-orange-500/20 text-orange-400' : 'hover:text-slate-200'}`}
          >
            <Sunset className="w-4 h-4" />
          </button>
          <button
            onClick={() => onLightingChange('night')}
            title="Campus Night Lights"
            className={`p-1.5 rounded-md transition-colors ${lightingMode === 'night' ? 'bg-indigo-500/20 text-indigo-300' : 'hover:text-slate-200'}`}
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>

        {/* Ambient Sound synthesizer toggle */}
        <button
          onClick={onToggleAudio}
          title={isAudioActive ? 'Mute campus birds & breeze' : 'Listen to campus natural ambiance'}
          className={`p-2 rounded-lg border transition-colors ${isAudioActive ? 'bg-cyan-950/60 border-cyan-800 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
        >
          {isAudioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
