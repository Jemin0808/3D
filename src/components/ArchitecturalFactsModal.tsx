import React from 'react';
import { CAMPUS_METRICS } from '../data/ldceCampusData';
import { X, ExternalLink, ShieldCheck, MapPin, Award, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitecturalFactsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 font-display">
              LDCE Architecture & Campus Heritage
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Architectural scale, materials, and mid-century vernacular design
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-sm text-slate-300">
          {/* Visual Showcase Gallery */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Campus Photographic References
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden border border-slate-800 group relative">
                <img
                  src="/src/assets/images/ldce_campus_aerial_1791489869814.jpg"
                  alt="LDCE Campus Aerial Drone View"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-2.5">
                  <div className="text-[11px] font-medium text-slate-200">
                    Campus Aerial Quadrangle & University Road
                  </div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-800 group relative">
                <img
                  src="/src/assets/images/ldce_entrance_gate_1791489885373.jpg"
                  alt="LDCE Main Entrance Gate"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-2.5">
                  <div className="text-[11px] font-medium text-slate-200">
                    Iconic Heritage Sandstone Entrance Gateway
                  </div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-800 group relative">
                <img
                  src="/src/assets/images/ldce_siemens_coe_1791489898833.jpg"
                  alt="Siemens Centre of Excellence & Computer Dept"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-2.5">
                  <div className="text-[11px] font-medium text-slate-200">
                    Siemens Centre of Excellence (Block 7)
                  </div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-800 group relative">
                <img
                  src="/src/assets/images/ldce_brick_facade_1791489856184.jpg"
                  alt="Exposed Red Brick Texture with Concrete Lintels"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-2.5">
                  <div className="text-[11px] font-medium text-slate-200">
                    Ahmedabad Exposed Red Brick & Lintel Material
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-center">
              <div className="text-slate-400 text-[11px]">Established</div>
              <div className="text-base font-bold text-slate-100 font-mono mt-0.5">1948</div>
            </div>
            <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-center">
              <div className="text-slate-400 text-[11px]">Campus Scale</div>
              <div className="text-base font-bold text-cyan-400 font-mono mt-0.5">~60 Acres</div>
            </div>
            <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-center">
              <div className="text-slate-400 text-[11px]">Departments</div>
              <div className="text-base font-bold text-slate-100 font-mono mt-0.5">14 Branches</div>
            </div>
            <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800 text-center">
              <div className="text-slate-400 text-[11px]">Students</div>
              <div className="text-base font-bold text-slate-100 font-mono mt-0.5">6,500+</div>
            </div>
          </div>

          {/* Architectural Design Philosophy */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ahmedabad Vernacular Modernist Idiom
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              L.D. College of Engineering (LDCE), founded by philanthropic textile magnate <strong>Kasturbhai Lalbhai</strong> and named after his father <strong>Sheth Lalbhai Dalpatbhai</strong>, represents a hallmark of post-independence institutional architecture in Gujarat.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/40 border border-slate-800/60">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Thermal Mass & Exposed Brickwork:</span>
                  <span className="text-slate-400 ml-1">
                    Heavy terracotta brick masonry dampens the harsh summer heat of Ahmedabad, keeping lecture rooms and lab halls naturally insulated.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/40 border border-slate-800/60">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Cantilevered Chhajjas (Solar Fins):</span>
                  <span className="text-slate-400 ml-1">
                    Continuous horizontal concrete overhangs shield windows from direct subtropical solar glare while allowing soft natural daylight into drafting and lab spaces.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/40 border border-slate-800/60">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Industrial Sawtooth Clerestory (Block 6 Workshop):</span>
                  <span className="text-slate-400 ml-1">
                    The Central Workshop features authentic sawtooth roof geometry that captures shadow-free north daylight, ideal for precision lathe turning and metal fabrication.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/40 border border-slate-800/60">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-200">Contemporary Siemens Centre of Excellence:</span>
                  <span className="text-slate-400 ml-1">
                    Modern glass curtain-wall facade housing 9 advanced high-tech laboratories in collaboration with the Government of Gujarat and Siemens Industry Software.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Official Portal: <a href="https://ldce.ac.in" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">ldce.ac.in</a>
          </div>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors"
          >
            Back to 3D Campus
          </button>
        </div>
      </div>
    </div>
  );
};
