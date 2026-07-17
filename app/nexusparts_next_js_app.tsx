import React, { useState, useEffect, useCallback } from 'react';
import { 
  Cpu, Map as MapIcon, Moon, Sun, ShoppingCart, Menu, 
  Sparkles, Camera, CarFront, Search, ArrowRight, UploadCloud, 
  Boxes, Route, Expand, Star, ShieldCheck, Plus, Clock, 
  Info, CheckCircle, MessageCircle, AlertCircle, Loader2
} from 'lucide-react';

// --- Types ---
type Part = {
  id: number;
  name: string;
  vehicle: string;
  category: string;
  brand: string;
  price: number;
  oldPrice: number | null;
  imageText: string;
  seller: string;
  rating: number;
  status: string;
  type: string;
  tags: string[];
};

type Toast = {
  id: number;
  message: string;
  type: 'info' | 'success' | 'whatsapp';
};

const DEMO_INVENTORY: Part[] = [
  {
    id: 1, name: "Front Left LED Headlight Original", vehicle: "Nissan • Pathfinder • 2004", category: "Body", brand: "Nissan",
    price: 600, oldPrice: 850, imageText: "Headlight+Assy", seller: "Sharjah Auto Parts Co.", rating: 4.9, status: "Available", type: "OEM", tags: ["body", "nissan", "lights", "exterior"]
  },
  {
    id: 2, name: "Complete 3UR-FE V8 Engine", vehicle: "Lexus • LX570 • 2016-2021", category: "Engines", brand: "Lexus",
    price: 15000, oldPrice: null, imageText: "V8+Engine", seller: "Al Sajaa Used Cars", rating: 4.7, status: "Tested • 65k km", type: "Used", tags: ["engines", "lexus", "v8", "motor"]
  },
  {
    id: 3, name: "Front Ceramic Brake Pads (New)", vehicle: "Toyota • Land Cruiser • 2012+", category: "Brakes", brand: "Toyota",
    price: 240, oldPrice: 300, imageText: "Brake+Pads", seller: "Dubai Parts Hub", rating: 5.0, status: "2 Left", type: "OEM", tags: ["brakes", "toyota", "new", "maintenance"]
  },
  {
    id: 4, name: "Automatic Gearbox Transmission", vehicle: "Nissan • Patrol Safari • 2018", category: "Engines", brand: "Nissan",
    price: 4500, oldPrice: null, imageText: "Gearbox", seller: "Desert Parts Trd.", rating: 4.5, status: "Tested", type: "Used", tags: ["gearbox", "nissan", "transmission", "engines"]
  },
  {
    id: 5, name: "Right Fender Panel White", vehicle: "Toyota • Camry • 2019-2022", category: "Body", brand: "Toyota",
    price: 350, oldPrice: 400, imageText: "Fender", seller: "Al Taawun Used Auto Parts", rating: 4.2, status: "Available", type: "Aftermarket", tags: ["body", "toyota", "exterior", "fender"]
  },
  {
    id: 6, name: "Engine Control Module (ECU)", vehicle: "Lexus • IS350 • 2014", category: "Electronics", brand: "Lexus",
    price: 1200, oldPrice: null, imageText: "ECU+Module", seller: "Premium Engines Trd.", rating: 4.8, status: "Programmed", type: "Used OEM", tags: ["electronics", "lexus", "ecu", "computer"]
  },
  {
    id: 7, name: "Radiator Cooling Fan Assembly", vehicle: "Nissan • Altima • 2016", category: "Cooling", brand: "Nissan",
    price: 450, oldPrice: 550, imageText: "Radiator+Fan", seller: "Sharjah Auto Parts Co.", rating: 4.9, status: "Available", type: "New", tags: ["cooling", "nissan", "radiator", "engine"]
  }
];

const FILTERS = ['All', 'Engines', 'Body', 'Toyota', 'Nissan', 'Lexus'];

export default function NexusPartsApp() {
  // Global State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<Part[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Search & Filter State
  const [activeTab, setActiveTab] = useState<'ai' | 'photo' | 'vin'>('ai');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [inventory, setInventory] = useState<Part[]>(DEMO_INVENTORY);
  const [isSearching, setIsSearching] = useState(false);
  const [searchStatus, setSearchStatus] = useState('AI is scanning 840 verified sellers...');
  
  // Photo Simulation State
  const [uploadStatus, setUploadStatus] = useState({
    title: 'Upload broken part photo',
    desc: 'Click to simulate AI recognition',
    icon: 'upload'
  });

  // VIN Simulation State
  const [vinInput, setVinInput] = useState('');

  useEffect(() => {
    // Check local storage for theme
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === 'dark') document.documentElement.classList.add('dark');
      }
      
      const handleScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'whatsapp' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const executeSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchStatus('Analyzing request...');
    
    setTimeout(() => {
      const q = searchQuery.toLowerCase().trim();
      const results = DEMO_INVENTORY.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.vehicle.toLowerCase().includes(q) ||
        item.tags.some(tag => q.includes(tag))
      );
      
      setSearchStatus(results.length > 0 ? `Found ${results.length} matching parts.` : 'No exact matches found.');
      
      setTimeout(() => {
        setInventory(results);
        setIsSearching(false);
        setActiveFilter(''); // clear quick filters
        document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        setTimeout(() => setSearchStatus('AI is scanning 840 verified sellers...'), 1000);
      }, 800);
    }, 1200);
  };

  const filterInventory = (category: string) => {
    setActiveFilter(category);
    if (category === 'All') {
      setInventory(DEMO_INVENTORY);
    } else {
      const filtered = DEMO_INVENTORY.filter(item => 
        item.category === category || 
        item.brand === category ||
        item.tags.includes(category.toLowerCase())
      );
      setInventory(filtered);
    }
    document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const simulateUpload = () => {
    setUploadStatus({ title: "Analyzing image...", desc: "Computer vision model processing...", icon: "loading" });
    
    setTimeout(() => {
      setUploadStatus({ title: "Toyota Camry Headlight detected", desc: "Searching inventory for matches...", icon: "success" });
      
      setTimeout(() => {
        setSearchQuery("Toyota Camry Headlight");
        setActiveTab('ai');
        setIsSearching(true);
        setTimeout(() => {
            const results = DEMO_INVENTORY.filter(item => item.name.includes("Headlight"));
            setInventory(results);
            setIsSearching(false);
            document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
        }, 800);

        setTimeout(() => {
          setUploadStatus({ title: 'Upload broken part photo', desc: 'Click to simulate AI recognition', icon: 'upload' });
        }, 2000);
      }, 1000);
    }, 1500);
  };

  const simulateVIN = () => {
    if(!vinInput) return;
    showToast('VIN Decoded: 2018 Nissan Patrol Safari', 'success');
    setTimeout(() => {
      setSearchQuery("Nissan Patrol Safari parts");
      setActiveTab('ai');
      executeSearch();
    }, 1000);
  };

  const CustomStyles = () => (
    <style dangerouslySetInnerHTML={{__html: `
      :root {
        --color-primary: #3B82F6;
        --color-neon: #00F0FF;
        --color-accent: #10B981;
      }
      
      body {
        transition: background-color 0.3s ease, color 0.3s ease;
        overflow-x: hidden;
      }

      html.dark body {
        background-color: #0B0F19;
        color: #ffffff;
        background-image: 
          radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.15), transparent 25%),
          radial-gradient(circle at 85% 30%, rgba(16, 185, 129, 0.1), transparent 25%);
        background-attachment: fixed;
      }

      html:not(.dark) body {
        background-color: #ffffff;
        color: #0f172a;
      }

      .glass-panel { backdrop-filter: blur(16px); transition: all 0.3s ease; }
      
      html.dark .glass-panel {
        background: linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.7) 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
      }
      
      html:not(.dark) .glass-panel {
        background: #ffffff;
        border: 1px solid rgba(0, 0, 0, 0.1);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      }

      html.dark .neon-border { box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); }
      html:not(.dark) .neon-border { box-shadow: 0 0 15px rgba(59, 130, 246, 0.15); border: 1px solid #bae6fd; }

      .radar-container {
        position: relative; overflow: hidden; transition: background 0.3s ease;
      }
      html.dark .radar-container { background: radial-gradient(circle, #1e293b 0%, #0B0F19 70%); }
      html:not(.dark) .radar-container { background: #ffffff; border: 1px solid #e2e8f0; }
      
      .radar-line {
        position: absolute; top: 50%; left: 50%; width: 50%; height: 2px;
        transform-origin: 0 50%; animation: spin 4s linear infinite;
      }
      html.dark .radar-line { background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.8)); }
      html:not(.dark) .radar-line { background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5)); }
      
      @keyframes spin { 100% { transform: rotate(360deg); } }
      @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      @keyframes slideUp { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
      
      .animate-float { animation: float 6s ease-in-out infinite; }
      .animate-slide-up { animation: slideUp 0.3s ease-out forwards; }
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}} />
  );

  return (
    <div className={`min-h-screen font-sans ${theme}`}>
      <CustomStyles />
      
      {/* Navigation */}
      <nav id="navbar" className={`fixed w-full z-50 transition-all duration-300 backdrop-blur-md ${scrolled ? (theme === 'dark' ? 'bg-[#0B0F19]/90 border-b border-white/10' : 'bg-white/90 border-b border-black/10 shadow-sm') : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                <Cpu size={24} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
                Nexus<span className="text-blue-500 dark:text-cyan-400">Parts</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#marketplace" className="text-slate-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors text-sm font-medium">Marketplace</a>
              <button onClick={() => showToast('Opening Part Request Form...', 'info')} className="text-slate-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors text-sm font-medium">Request a Part</button>
              <a href="#radar" className="text-slate-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors text-sm font-medium flex items-center gap-2">
                <MapIcon size={16} className="text-blue-500" /> Sharjah Map
              </a>
            </div>

            {/* Auth / Controls */}
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={toggleTheme} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              <button className="bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white px-5 py-2 rounded-full text-sm font-medium transition-all">Log In</button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)]">Sell Parts</button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleTheme} className="text-slate-500 dark:text-gray-400">
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
              </button>
              <button className="text-slate-600 dark:text-gray-300 hover:text-blue-500">
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Hero & Search Box */}
      <main className="pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-transparent border border-blue-200 dark:border-blue-500/30 mb-6 animate-float shadow-sm dark:shadow-none">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 dark:bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500 dark:bg-cyan-400"></span>
              </span>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-200">Live Inventory: 2.4M Parts Across UAE</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
              Find the perfect part. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-cyan-400 dark:via-blue-500 dark:to-indigo-600">In seconds.</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-gray-400 mb-8">
              The UAE's first AI-powered auto parts network. Connect with hundreds of verified sellers in Sharjah, Dubai, and beyond instantly.
            </p>
          </div>

          <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-2 md:p-4 neon-border relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Tabs */}
            <div className="flex flex-wrap md:flex-nowrap gap-2 p-2 bg-slate-100 dark:bg-black/40 rounded-2xl mb-4">
              <button 
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-sm ${activeTab === 'ai' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5'}`}
              >
                <Sparkles size={18} className={activeTab === 'ai' ? 'text-white dark:text-cyan-400' : ''} /> AI Search
              </button>
              <button 
                onClick={() => setActiveTab('photo')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-sm ${activeTab === 'photo' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5'}`}
              >
                <Camera size={18} className={activeTab === 'photo' ? 'text-white dark:text-cyan-400' : ''} /> Photo Scan
              </button>
              <button 
                onClick={() => setActiveTab('vin')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-sm ${activeTab === 'vin' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-600 dark:text-gray-400 hover:bg-white dark:hover:bg-white/5'}`}
              >
                <CarFront size={18} className={activeTab === 'vin' ? 'text-white dark:text-cyan-400' : ''} /> VIN / Chassis
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-4 md:p-6 transition-all duration-300 min-h-[140px]">
              {/* AI Tab */}
              {activeTab === 'ai' && (
                <div className="animate-slide-up">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search size={24} className="text-slate-400 dark:text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                      className="w-full bg-white dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-2xl py-5 pl-12 pr-32 text-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-cyan-400 transition-all shadow-sm dark:shadow-none" 
                      placeholder="e.g. Need engine for Toyota Land Cruiser 2018..."
                    />
                    <div className="absolute inset-y-0 right-2 flex items-center">
                      <button 
                        onClick={executeSearch}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 font-medium"
                      >
                        <span>Find</span> <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {isSearching && (
                    <div className="mt-6 text-center animate-slide-up">
                      <Loader2 size={28} className="animate-spin text-blue-500 dark:text-cyan-400 mx-auto mb-3" />
                      <p className="text-sm text-slate-600 dark:text-gray-400 flex items-center justify-center gap-2">
                        {searchStatus.includes('Found') ? <CheckCircle size={16} className="text-emerald-500"/> : null}
                        {searchStatus}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Photo Tab */}
              {activeTab === 'photo' && (
                <div className="animate-slide-up border-2 border-dashed border-slate-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-cyan-400 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-black/30 cursor-pointer transition-colors group" onClick={simulateUpload}>
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm dark:shadow-none">
                    {uploadStatus.icon === 'upload' && <UploadCloud size={32} className="text-slate-400 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-cyan-400" />}
                    {uploadStatus.icon === 'loading' && <Loader2 size={32} className="animate-spin text-blue-500 dark:text-cyan-400" />}
                    {uploadStatus.icon === 'success' && <CheckCircle size={32} className="text-emerald-500" />}
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-1">{uploadStatus.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-gray-500">{uploadStatus.desc}</p>
                </div>
              )}

              {/* VIN Tab */}
              {activeTab === 'vin' && (
                <div className="animate-slide-up grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-400 mb-2">17-Digit VIN / Chassis Number</label>
                    <input 
                      type="text" 
                      value={vinInput}
                      onChange={(e) => setVinInput(e.target.value)}
                      className="w-full bg-white dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:border-blue-500 focus:outline-none shadow-sm dark:shadow-none uppercase" 
                      placeholder="Enter VIN..."
                    />
                  </div>
                  <div className="flex items-end">
                    <button onClick={simulateVIN} className="w-full bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white py-3 rounded-xl transition-all font-medium">
                      Decode Vehicle Specs
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="text-sm text-slate-700 dark:text-gray-300 my-auto mr-2 font-medium">Quick Filters:</span>
            {FILTERS.map(filter => (
              <button 
                key={filter}
                onClick={() => filterInventory(filter)}
                className={`px-4 py-1.5 rounded-full border text-xs transition-colors shadow-sm ${activeFilter === filter ? 'bg-blue-500 text-white border-blue-500' : 'bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border-slate-300 dark:border-white/10 text-slate-800 dark:text-gray-200'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </main>

      <section id="marketplace" className="py-16 bg-slate-100 dark:bg-black/40 border-t border-slate-200 dark:border-white/5 transition-colors min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {activeFilter && activeFilter !== 'All' ? `${activeFilter} Parts` : searchQuery && !isSearching ? `Results for "${searchQuery}"` : 'Live Parts Feed'}
              </h2>
              <p className="text-slate-600 dark:text-gray-400">Recently listed across the UAE. Updated in real-time.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-blue-500 hover:text-blue-700 dark:hover:text-cyan-400 transition-colors font-medium cursor-pointer">
              <span>Showing {inventory.length} parts</span> <Sparkles size={16} className="text-amber-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {inventory.length === 0 ? (
              <div className="col-span-full py-12 text-center animate-slide-up">
                <Search size={48} className="mx-auto text-slate-400 dark:text-gray-600 mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No exact matches found</h3>
                <p className="text-slate-500 dark:text-gray-400 mb-6">We couldn't find this specific part in our immediate inventory.</p>
                <button onClick={() => showToast('Opening Request Form...', 'info')} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all">
                  Post a Request to All Sellers
                </button>
              </div>
            ) : (
              inventory.map((part) => (
                <div key={part.id} className="glass-panel rounded-2xl overflow-hidden group animate-slide-up flex flex-col h-full border border-transparent dark:border-white/5 hover:border-blue-500/30 transition-all">
                  <div className="relative h-48 bg-slate-200 dark:bg-gray-800 overflow-hidden flex-shrink-0">
                    <img 
                      src={`https://placehold.co/400x300/${theme === 'dark' ? '1e293b/ffffff' : 'e2e8f0/475569'}?text=${part.imageText}`} 
                      alt={part.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-600 dark:bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                      {part.status.includes('Available') && <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>} {part.status}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 backdrop-blur-sm text-slate-900 dark:text-white text-xs px-2 py-1 rounded flex items-center gap-1 shadow-sm font-medium">
                      <ShieldCheck size={12} className="text-blue-500 dark:text-blue-400" /> {part.type}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="text-xs text-blue-600 dark:text-cyan-400 mb-1 font-bold tracking-wide uppercase">{part.vehicle}</div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight line-clamp-2">{part.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <ShieldCheck size={12} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-xs text-slate-700 dark:text-gray-200 font-medium truncate">{part.seller}</span>
                      <span className="text-xs text-amber-600 dark:text-amber-500 font-bold ml-auto flex items-center gap-1 whitespace-nowrap">
                        <Star size={12} className="fill-current" /> {part.rating}
                      </span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                      <div>
                        {part.oldPrice && <div className="text-sm text-slate-500 dark:text-gray-400 line-through">AED {part.oldPrice}</div>}
                        <div className="text-xl font-bold text-slate-900 dark:text-white">AED {part.price}</div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => showToast(`Opening WhatsApp chat with ${part.seller}...`, 'whatsapp')} 
                          className="w-10 h-10 rounded-full bg-[#25D366]/10 dark:bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
                        >
                          <MessageCircle size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setCart(prev => [...prev, part]);
                            showToast(`Added ${part.name} to cart.`, 'success');
                          }}
                          className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 flex items-center justify-center transition-colors"
                        >
                          <ShoppingCart size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Always show Request Card */}
            <div className="glass-panel rounded-2xl overflow-hidden group flex flex-col h-full border-dashed border-2 border-slate-300 dark:border-white/20 animate-slide-up bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div className="relative h-48 bg-slate-50/50 dark:bg-gray-800/30 overflow-hidden flex items-center justify-center flex-shrink-0">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110">
                    <AlertCircle className="text-blue-500" size={24} />
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-bold mb-1">Didn't find it?</h4>
                  <p className="text-xs text-slate-500 dark:text-gray-400 px-4">Post a request and let sellers bid for your business.</p>
                </div>
              </div>
              <div className="p-5 flex flex-col justify-center flex-grow">
                <button onClick={() => showToast('Opening Request Form...', 'info')} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition-all font-medium shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                  <Plus size={18} /> Request Part
                </button>
                <p className="text-xs text-center text-slate-500 dark:text-gray-500 mt-3 font-medium flex justify-center items-center gap-1">
                  <Clock size={12} /> Avg. response: 4 mins
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="radar" className="py-20 relative overflow-hidden bg-white dark:bg-transparent transition-colors">
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-20 pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjM2I4MmY2IiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik02MCAwTDAgMDBtMCA2MGw2MCAtNjAiLz48L2c+PC9zdmc+')" }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-transparent border border-blue-200 dark:border-cyan-400/30 mb-6 shadow-sm dark:shadow-none">
                <MapIcon size={16} className="text-blue-500 dark:text-cyan-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-cyan-400">Interactive Directory</span>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">The Sharjah Scrapyard <br /> <span className="text-blue-500">Live Radar</span></h2>
              <p className="text-slate-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
                Don't drive blindly through Industrial Area 6. Our interactive map shows you exactly which shops have your part in stock, their distance, and current operating status.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-blue-100 dark:bg-white/10 p-2 rounded-lg text-blue-600"><Boxes size={20} /></div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold">Live Inventory Count</h4>
                    <p className="text-sm text-slate-600 dark:text-gray-500">See exactly how many parts each shop has digitized.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 bg-emerald-100 dark:bg-white/10 p-2 rounded-lg text-emerald-600 dark:text-emerald-400"><Route size={20} /></div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold">Direct Navigation</h4>
                    <p className="text-sm text-slate-600 dark:text-gray-500">Get Google Maps directions straight to the verified seller's door.</p>
                  </div>
                </li>
              </ul>
              
              <button onClick={() => showToast('Map feature requires location permissions (Simulation)', 'info')} className="bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-gray-200 px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg">
                Open Full Map <Expand size={18} />
              </button>
            </div>

            {/* Stylized Radar Map */}
            <div className="w-full lg:w-1/2 h-[450px] radar-container rounded-3xl shadow-[0_10px_40px_rgba(59,130,246,0.1)] dark:shadow-[0_0_50px_rgba(59,130,246,0.15)] flex items-center justify-center p-4">
              <div className="absolute w-[80%] h-[80%] rounded-full border border-slate-200 dark:border-white/5"></div>
              <div className="absolute w-[60%] h-[60%] rounded-full border border-slate-300 dark:border-white/10"></div>
              <div className="absolute w-[40%] h-[40%] rounded-full border border-slate-400/50 dark:border-white/20"></div>
              <div className="absolute w-[20%] h-[20%] rounded-full border border-blue-500/50 dark:border-cyan-400/30"></div>
              <div className="radar-line"></div>
              
              <div className="absolute w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6] z-10 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-full animate-ping opacity-50"></div>
              </div>

              {/* Node 1 */}
              <div className="absolute top-[25%] left-[30%] group cursor-pointer z-20" onClick={() => showToast('Connecting to Al Taawun Used Auto Parts...', 'success')}>
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white dark:bg-black/90 backdrop-blur-md border border-slate-200 dark:border-white/10 p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <h5 className="text-slate-900 dark:text-white text-xs font-bold mb-1">Al Taawun Used Auto Parts</h5>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Open Now</div>
                  <div className="text-[10px] text-slate-500 dark:text-gray-400">Inventory: 4,520 items</div>
                </div>
              </div>

              {/* Node 2 */}
              <div className="absolute bottom-[35%] right-[25%] group cursor-pointer z-20" onClick={() => showToast('Connecting to Premium Engines Trd...', 'success')}>
                <div className="w-4 h-4 bg-blue-500 dark:bg-cyan-400 rounded-full shadow-[0_0_15px_#3b82f6] dark:shadow-[0_0_15px_#00f0ff] flex items-center justify-center">
                  <Star size={8} className="text-white dark:text-black fill-current" />
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white dark:bg-black/90 backdrop-blur-md border border-slate-200 dark:border-white/10 p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <h5 className="text-slate-900 dark:text-white text-xs font-bold mb-1">Premium Engines Trd.</h5>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Open Now</div>
                  <div className="text-[10px] text-slate-500 dark:text-gray-400">Inventory: 1,200 engines</div>
                </div>
              </div>

              {/* Node 3 */}
              <div className="absolute top-[40%] right-[40%] group cursor-pointer z-20">
                <div className="w-3 h-3 bg-slate-400 dark:bg-gray-500 rounded-full"></div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-white dark:bg-black/90 backdrop-blur-md border border-slate-200 dark:border-white/10 p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <h5 className="text-slate-900 dark:text-white text-xs font-bold mb-1">German Parts Hub</h5>
                  <div className="text-[10px] text-red-500 flex items-center gap-1 mb-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Closed</div>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 shadow-sm text-xs text-slate-600 dark:text-gray-400 font-medium">
                Simulating: Sharjah Ind. Area 6
              </div>
            </div>

          </div>
        </div>
      </section>

      <footer className="bg-slate-900 dark:bg-[#05070A] py-12 border-t border-slate-800 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                  <Cpu size={18} />
                </div>
                <span className="font-bold text-xl text-white">Nexus<span className="text-blue-500 dark:text-cyan-400">Parts</span></span>
              </div>
              <p className="text-slate-400 dark:text-gray-400 text-sm mb-4 max-w-sm leading-relaxed">
                The UAE's smartest platform for used, new, and aftermarket auto parts. Connecting buyers and verified sellers instantly.
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 dark:text-gray-500 text-xs">© {new Date().getFullYear()} NexusParts AI. React/Next.js Prototype.</p>
          </div>
        </div>
      </footer>

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 font-medium text-sm animate-slide-up ${
              toast.type === 'success' ? 'bg-emerald-600 text-white' : 
              toast.type === 'whatsapp' ? 'bg-[#25D366] text-white' : 
              'bg-slate-800 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={18} /> : 
             toast.type === 'whatsapp' ? <MessageCircle size={18} /> : 
             <Info size={18} />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

    </div>
  );
}