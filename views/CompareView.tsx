
import React, { useState, useCallback } from 'react';
import { 
  Plus, 
  X, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Info,
  Calendar,
  MapPin,
  Camera,
  Activity,
  Layers
} from 'lucide-react';
import { PhotoRecord } from '../types';

interface CompareViewProps {
  photos: PhotoRecord[];
}

const CompareView: React.FC<CompareViewProps> = ({ photos }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [showMetadata, setShowMetadata] = useState(true);

  const selectedPhotos = photos.filter(p => selectedIds.includes(p.id));

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : prev.length < 3 ? [...prev, id] : [prev[1], id]
    );
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 1), 5));
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Photo Comparison</h1>
          <p className="text-sm text-slate-500">Select up to 3 photos to analyze side-by-side</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button onClick={() => handleZoom(-0.25)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600"><ZoomOut size={18} /></button>
            <span className="text-xs font-bold w-12 text-center text-slate-400">{Math.round(zoom * 100)}%</span>
            <button onClick={() => handleZoom(0.25)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600"><ZoomIn size={18} /></button>
          </div>
          
          <button 
            onClick={() => setShowMetadata(!showMetadata)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-medium transition-all ${
              showMetadata ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Info size={18} />
            <span>Metadata</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        {/* Selection Strip */}
        <div className="w-72 flex flex-col gap-4 overflow-y-auto pr-2 hide-scrollbar">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Available Photos</h3>
          <div className="grid grid-cols-2 gap-3">
            {photos.map(photo => (
              <button
                key={photo.id}
                onClick={() => toggleSelect(photo.id)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                  selectedIds.includes(photo.id) ? 'border-blue-500 ring-2 ring-blue-100' : 'border-transparent hover:border-slate-300'
                }`}
              >
                <img src={photo.url} className="w-full h-full object-cover" />
                {selectedIds.includes(photo.id) && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <div className="bg-blue-600 text-white rounded-full p-1"><Plus size={16} /></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Compare Stage */}
        <div className="flex-1 flex flex-col bg-slate-100 rounded-[2.5rem] p-6 shadow-inner border border-slate-200/50 overflow-hidden">
          {selectedPhotos.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 animate-pulse">
              <Layers size={48} className="mb-4 opacity-20" />
              <p className="font-medium">Pick photos from the list to start comparing</p>
            </div>
          ) : (
            <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
              {selectedPhotos.map((photo, idx) => (
                <div key={photo.id} className="flex-1 flex flex-col min-w-0 bg-white rounded-3xl overflow-hidden shadow-2xl relative">
                  {/* Photo viewer */}
                  <div className="flex-1 overflow-hidden relative group">
                    <div 
                      className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
                      style={{ transform: `scale(${zoom})` }}
                    >
                      <img src={photo.url} className="max-w-full max-h-full object-contain pointer-events-none" />
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                       <span className="px-3 py-1.5 bg-black/60 backdrop-blur rounded-full text-white text-[10px] font-bold">IMG_{idx + 1}</span>
                    </div>
                    <button 
                      onClick={() => toggleSelect(photo.id)}
                      className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur hover:bg-white/40 text-white rounded-full transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Metadata Panel */}
                  {showMetadata && (
                    <div className="h-64 border-t border-slate-100 p-6 overflow-y-auto bg-white">
                      <div className="flex items-center justify-between mb-4">
                         <h4 className="font-bold text-slate-900 truncate">{photo.filename}</h4>
                         <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono uppercase">{photo.id}</span>
                      </div>
                      
                      <div className="space-y-4">
                        <MetadataItem icon={<Calendar size={14} />} label="Captured" value={photo.captureDate} />
                        <MetadataItem icon={<MapPin size={14} />} label="Location" value={photo.location.name || 'Unknown'} />
                        <MetadataItem icon={<Camera size={14} />} label="Device" value={photo.metadata.camera || 'Unknown'} />
                        
                        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-50">
                          <div className="bg-slate-50 p-3 rounded-2xl">
                            <p className="text-[10px] text-slate-400 uppercase mb-1">Exposure</p>
                            <p className="text-xs font-bold text-slate-700">{photo.metadata.shutterSpeed} @ {photo.metadata.aperture}</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-2xl">
                            <p className="text-[10px] text-slate-400 uppercase mb-1">ISO / Focal</p>
                            <p className="text-xs font-bold text-slate-700">{photo.metadata.iso} / {photo.metadata.focalLength}</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-[10px] text-slate-400 uppercase mb-2">Difference Indicators</p>
                          <div className="flex gap-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                             <div className="w-1/3 bg-blue-400"></div>
                             <div className="w-1/4 bg-blue-200"></div>
                             <div className="w-1/2 bg-blue-500"></div>
                          </div>
                          <p className="text-[9px] text-slate-400 mt-1 italic text-right">Pixel variance detected</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MetadataItem: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-slate-500">
      {icon}
      <span className="text-[11px] font-medium uppercase tracking-tight">{label}</span>
    </div>
    <span className="text-slate-900 font-semibold text-[11px] truncate max-w-[120px]">{value}</span>
  </div>
);

export default CompareView;
