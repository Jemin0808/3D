/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LDCECampus3D, LightingMode, CameraMode } from './components/LDCECampus3D';
import { CampusTopBar } from './components/CampusTopBar';
import { BuildingDetailModal } from './components/BuildingDetailModal';
import { TourNavigationOverlay } from './components/TourNavigationOverlay';
import { CampusDirectoryDrawer } from './components/CampusDirectoryDrawer';
import { ArchitecturalFactsModal } from './components/ArchitecturalFactsModal';
import { CampusBuilding, LDCE_CAMPUS_BUILDINGS, CAMPUS_TOUR_STOPS } from './data/ldceCampusData';
import { campusAmbience } from './utils/audioSynth';
import {
  Compass,
  Footprints,
  Orbit,
  Layers,
  Ruler,
  Maximize2,
  ListFilter,
  Info,
  ChevronDown,
  Navigation,
} from 'lucide-react';

export default function App() {
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding | null>(null);
  const [lightingMode, setLightingMode] = useState<LightingMode>('day');
  const [cameraMode, setCameraMode] = useState<CameraMode>('orbit');
  const [activeTourIndex, setActiveTourIndex] = useState<number>(0);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showScaleRuler, setShowScaleRuler] = useState<boolean>(true);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState<boolean>(false);
  const [isHeritageModalOpen, setIsHeritageModalOpen] = useState<boolean>(false);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [showQuickJumpMenu, setShowQuickJumpMenu] = useState<boolean>(false);

  const handleToggleAudio = () => {
    const newState = campusAmbience.toggle();
    setIsAudioActive(newState);
  };

  const handleQuickJump = (buildingId: string) => {
    const bldg = LDCE_CAMPUS_BUILDINGS.find((b) => b.id === buildingId);
    if (bldg) {
      setSelectedBuilding(bldg);
      setCameraMode('orbit');
      setShowQuickJumpMenu(false);
    }
  };

  const handleStartTour = () => {
    setCameraMode('tour');
    setActiveTourIndex(0);
    const firstStop = CAMPUS_TOUR_STOPS[0];
    const bldg = LDCE_CAMPUS_BUILDINGS.find((b) => b.id === firstStop.buildingId) || null;
    setSelectedBuilding(bldg);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-slate-950 font-sans">
      {/* Universal Top Bar */}
      <CampusTopBar
        lightingMode={lightingMode}
        onLightingChange={setLightingMode}
        cameraMode={cameraMode}
        onCameraModeChange={(mode) => {
          if (mode === 'tour') {
            handleStartTour();
          } else {
            setCameraMode(mode);
          }
        }}
        isAudioActive={isAudioActive}
        onToggleAudio={handleToggleAudio}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
        onOpenHeritageFacts={() => setIsHeritageModalOpen(true)}
        showScaleRuler={showScaleRuler}
        onToggleScaleRuler={() => setShowScaleRuler(!showScaleRuler)}
      />

      {/* Main 3D Canvas Viewport */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        <LDCECampus3D
          selectedBuilding={selectedBuilding}
          onSelectBuilding={setSelectedBuilding}
          lightingMode={lightingMode}
          cameraMode={cameraMode}
          onCameraModeChange={setCameraMode}
          activeTourIndex={activeTourIndex}
          onTourIndexChange={setActiveTourIndex}
          showLabels={showLabels}
          showScaleRuler={showScaleRuler}
          wireframeMode={wireframeMode}
        />

        {/* Floating Top Control HUD */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
          {/* Camera Mode Selector */}
          <div className="flex items-center p-1 bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl shadow-lg">
            <button
              onClick={() => setCameraMode('orbit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                cameraMode === 'orbit'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Aerial 360° Drone Orbit Inspection"
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>Orbit View</span>
            </button>

            <button
              onClick={() => setCameraMode('walk')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                cameraMode === 'walk'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="First-Person Ground Walking Tour"
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Walk Mode</span>
            </button>

            <button
              onClick={handleStartTour}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                cameraMode === 'tour'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Guided Landmark Tour of LDCE"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Guided Tour</span>
            </button>
          </div>

          {/* Quick Jump Landmark Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowQuickJumpMenu(!showQuickJumpMenu)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-950/80 backdrop-blur-md border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium shadow-lg transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Jump to Landmark</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showQuickJumpMenu && (
              <div className="absolute top-full mt-1.5 left-0 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl p-1.5 z-40 text-xs">
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-slate-500 border-b border-slate-800/80 mb-1">
                  LDCE Campus Landmarks
                </div>
                {[
                  { id: 'main-gate', name: 'Main Heritage Gate & Plaza' },
                  { id: 'block-1-admin', name: 'Block 1 - Administration' },
                  { id: 'block-2-civil', name: 'Block 2 - Civil Engineering' },
                  { id: 'block-3-mech', name: 'Block 3 - Mechanical Engineering' },
                  { id: 'block-4-electrical', name: 'Block 4 - Electrical Engineering' },
                  { id: 'block-5-chem', name: 'Block 5 - Chemical & Plastic' },
                  { id: 'block-6-workshop', name: 'Block 6 - Central Workshop' },
                  { id: 'block-7-siemens-coe', name: 'Block 7 - Siemens CoE / Computer' },
                  { id: 'central-library', name: 'Central Library Knowledge Hub' },
                  { id: 'sports-ground', name: 'Cricket & Sports Ground' },
                  { id: 'canteen-hub', name: 'Student Canteen & Plaza' },
                  { id: 'hostel-complex', name: 'Hostel Quadrangle' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleQuickJump(item.id)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors truncate"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Feature Toggles */}
          <div className="flex items-center gap-1 bg-slate-950/80 backdrop-blur-md border border-slate-800 p-1 rounded-xl shadow-lg">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className={`p-2 rounded-lg text-xs transition-colors ${
                showLabels ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle 3D Block Labels"
            >
              <span className="text-[11px] font-mono font-bold">3D TAGS</span>
            </button>

            <button
              onClick={() => setWireframeMode(!wireframeMode)}
              className={`p-2 rounded-lg text-xs transition-colors ${
                wireframeMode ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle Architectural Wireframe Mesh"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsDirectoryOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-200 rounded-lg transition-colors md:hidden"
              title="Open Department Directory"
            >
              <ListFilter className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsHeritageModalOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
              title="View Architecture & History Dossier"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Guided Tour Carousel Overlay */}
        {cameraMode === 'tour' && (
          <TourNavigationOverlay
            activeTourIndex={activeTourIndex}
            onTourIndexChange={(idx) => {
              setActiveTourIndex(idx);
              const stop = CAMPUS_TOUR_STOPS[idx];
              const bldg = LDCE_CAMPUS_BUILDINGS.find((b) => b.id === stop.buildingId) || null;
              setSelectedBuilding(bldg);
            }}
            onExitTour={() => setCameraMode('orbit')}
          />
        )}

        {/* Building Detail Modal */}
        <BuildingDetailModal
          building={selectedBuilding}
          onClose={() => setSelectedBuilding(null)}
          onFocusBuilding={(bldg) => {
            setSelectedBuilding(bldg);
            setCameraMode('orbit');
          }}
        />

        {/* Department Directory Drawer */}
        <CampusDirectoryDrawer
          isOpen={isDirectoryOpen}
          onClose={() => setIsDirectoryOpen(false)}
          onSelectBuilding={(bldg) => {
            setSelectedBuilding(bldg);
            setCameraMode('orbit');
          }}
        />

        {/* Architectural Facts & Photo Gallery Modal */}
        <ArchitecturalFactsModal
          isOpen={isHeritageModalOpen}
          onClose={() => setIsHeritageModalOpen(false)}
        />
      </main>
    </div>
  );
}
