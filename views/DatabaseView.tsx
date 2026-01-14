
import React, { useState, useMemo, useRef } from 'react';
import { 
  Grid, 
  List, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Eye, 
  FileImage,
  Loader2,
  Tag as TagIcon,
  MapPin,
  X
} from 'lucide-react';
import { PhotoRecord, ViewMode } from '../types';
import { analyzePhoto } from '../geminiService';

interface DatabaseViewProps {
  photos: PhotoRecord[];
  onAdd: (photo: PhotoRecord) => void;
  onDelete: (id: string) => void;
  onUpdate: (photo: PhotoRecord) => void;
}

const DatabaseView: React.FC<DatabaseViewProps> = ({ photos, onAdd, onDelete, onUpdate }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('GALLERY');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Nature', 'Travel', 'Architecture', 'People', 'Abstract'];

  const filteredPhotos = useMemo(() => {
    return photos.filter(p => {
      const matchesSearch = p.filename.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           p.notes.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [photos, searchQuery, filterCategory]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress('Reading file...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const base64Data = base64.split(',')[1];
      const mimeType = file.type;

      setUploadProgress('Analyzing with AI...');
      const analysis = await analyzePhoto(base64Data, mimeType);

      const newPhoto: PhotoRecord = {
        id: Math.random().toString(36).substr(2, 9),
        url: base64,
        filename: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        captureDate: new Date().toISOString().split('T')[0], // Fallback if no EXIF
        location: { 
          name: analysis?.locationName || 'Unknown',
          lat: 0, 
          lng: 0 
        },
        notes: analysis?.notes || 'No description provided.',
        tags: analysis?.tags || ['Uploaded'],
        category: analysis?.category || 'Other',
        metadata: { iso: 100, aperture: 'f/2.8', camera: 'Unknown' }
      };

      onAdd(newPhoto);
      setIsUploading(false);
      setUploadProgress('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Photo Database</h1>
          <p className="text-sm text-slate-500">{filteredPhotos.length} records found</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button 
              onClick={() => setViewMode('GALLERY')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'GALLERY' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Grid size={20} />
            </button>
            <button 
              onClick={() => setViewMode('TABLE')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'TABLE' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={20} />
            </button>
          </div>
          
          <button 
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
          >
            {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
            <span>{isUploading ? 'Analyzing...' : 'Upload Photo'}</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload} 
          />
        </div>
      </div>

      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center gap-3 animate-pulse">
          <Loader2 className="animate-spin text-blue-600" size={20} />
          <p className="text-sm font-medium text-blue-800">{uploadProgress}</p>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 relative min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, tags, or notes..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl shadow-sm overflow-x-auto hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filterCategory === cat ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'GALLERY' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map(photo => (
            <div key={photo.id} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img src={photo.url} alt={photo.filename} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm">{photo.category}</span>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <button className="p-2 bg-white rounded-lg shadow-lg text-slate-600 hover:text-red-500 transition-colors" onClick={() => onDelete(photo.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 truncate">{photo.filename}</h3>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                  <MapPin size={12} className="shrink-0" />
                  <span className="truncate">{photo.location.name}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {photo.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600">#{tag}</span>
                  ))}
                  {photo.tags.length > 3 && <span className="text-[10px] text-slate-400">+{photo.tags.length - 3}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'TABLE' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Image</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Filename</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Upload Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tags</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPhotos.map(photo => (
                <tr key={photo.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                      <img src={photo.url} alt={photo.filename} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-900">{photo.filename}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[150px]">{photo.notes}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{photo.uploadDate}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">{photo.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-1">
                      {photo.tags.slice(0, 3).map(tag => (
                        <div key={tag} className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] text-slate-500" title={tag}>
                          {tag.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin size={12} className="text-slate-400" />
                      {photo.location.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-red-500 transition-colors" onClick={() => onDelete(photo.id)}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredPhotos.length === 0 && (
        <div className="py-20 text-center flex flex-col items-center">
          <div className="p-4 bg-slate-100 rounded-full mb-4">
            <FileImage size={40} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold">No photos found</h3>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default DatabaseView;
