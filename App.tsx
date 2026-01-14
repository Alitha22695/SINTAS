
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Split, 
  Menu, 
  X, 
  LogOut, 
  User as UserIcon,
  Bell,
  Search
} from 'lucide-react';
import Dashboard from './views/Dashboard';
import DatabaseView from './views/DatabaseView';
import CompareView from './views/CompareView';
import { PhotoRecord } from './types';
import { MOCK_PHOTOS, CURRENT_USER } from './constants';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize data
  useEffect(() => {
    const saved = localStorage.getItem('lensbase_photos');
    if (saved) {
      setPhotos(JSON.parse(saved));
    } else {
      setPhotos(MOCK_PHOTOS);
    }
  }, []);

  // Save to localStorage whenever photos change
  useEffect(() => {
    if (photos.length > 0) {
      localStorage.setItem('lensbase_photos', JSON.stringify(photos));
    }
  }, [photos]);

  const addPhoto = (newPhoto: PhotoRecord) => {
    setPhotos(prev => [newPhoto, ...prev]);
  };

  const deletePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const updatePhoto = (updated: PhotoRecord) => {
    setPhotos(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`${
            isSidebarOpen ? 'w-64' : 'w-20'
          } bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-50`}
        >
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
            {isSidebarOpen && <span className="text-xl font-bold tracking-tight">LensBase</span>}
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2">
            <SidebarItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" isOpen={isSidebarOpen} />
            <SidebarItem to="/database" icon={<Database size={20} />} label="Database" isOpen={isSidebarOpen} />
            <SidebarItem to="/compare" icon={<Split size={20} />} label="Compare" isOpen={isSidebarOpen} />
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'} p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors`}>
              <img src={CURRENT_USER.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-200" />
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{CURRENT_USER.name}</p>
                  <p className="text-xs text-slate-500 truncate capitalize">{CURRENT_USER.role}</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Quick search photos..." 
                  className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 hide-scrollbar">
            <Routes>
              <Route path="/" element={<Dashboard photos={photos} />} />
              <Route path="/database" element={<DatabaseView photos={photos} onAdd={addPhoto} onDelete={deletePhoto} onUpdate={updatePhoto} />} />
              <Route path="/compare" element={<CompareView photos={photos} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

const SidebarItem: React.FC<{ to: string, icon: React.ReactNode, label: string, isOpen: boolean }> = ({ to, icon, label, isOpen }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
        isActive 
          ? 'bg-blue-50 text-blue-600 font-semibold' 
          : 'text-slate-500 hover:bg-slate-50'
      }`}
    >
      <div className={`${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
        {icon}
      </div>
      {isOpen && <span className="text-sm">{label}</span>}
      {isActive && isOpen && <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
    </Link>
  );
};

export default App;
