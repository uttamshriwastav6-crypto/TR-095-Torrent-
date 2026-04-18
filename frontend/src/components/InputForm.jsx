import React, { useState, useEffect } from 'react';
import { Mic, MapPin, FlaskConical, Languages, Calendar } from 'lucide-react';

const CROPS = [
  { id: 'wheat', nameEn: 'Wheat', nameHi: 'गेहूँ', nameTa: 'கோதுமை', emoji: '🌾' },
  { id: 'rice', nameEn: 'Rice', nameHi: 'चावल', nameTa: 'அரிசி', emoji: '🍚' },
  { id: 'corn', nameEn: 'Corn', nameHi: 'मक्का', nameTa: 'சோளம்', emoji: '🌽' },
  { id: 'tomato', nameEn: 'Tomato', nameHi: 'टमाटर', nameTa: 'தக்காளி', emoji: '🍅' },
  { id: 'potato', nameEn: 'Potato', nameHi: 'आलू', nameTa: 'உருளைக்கிழங்கு', emoji: '🥔' },
  { id: 'sugarcane', nameEn: 'Sugarcane', nameHi: 'गன்னா', nameTa: 'கரும்பு', emoji: '🎋' },
  { id: 'cotton', nameEn: 'Cotton', nameHi: 'कपास', nameTa: 'பருத்தி', emoji: '☁️' },
  { id: 'soybean', nameEn: 'Soybean', nameHi: 'सोयाबीन', nameTa: 'சோயாபீன்', emoji: '🫘' },
];

const InputForm = ({ onSubmit, isLoading, language, setLanguage }) => {
  const [formData, setFormData] = useState({
    crop: '',
    ph: '',
    duration: '',
    location: ''
  });
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      if (language === 'hi') rec.lang = 'hi-IN';
      else if (language === 'ta') rec.lang = 'ta-IN';
      else rec.lang = 'en-US';

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setFormData(prev => ({ ...prev, location: transcript }));
        setIsListening(false);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      setRecognition(rec);
    }
  }, [language]);

  const toggleListen = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
    setIsListening(!isListening);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const labels = {
    en: { setup: "AI Farm Setup", sub: "Select your crop and location", grow: "What do you want to grow?", ph: "Soil pH", dur: "Duration (Days)", loc: "Your Farm Location", note: "* We will automatically fetch weather data", btn: "Generate Dashboard" },
    hi: { setup: "AI फार्म सेटअप", sub: "अपनी फसल और स्थान चुनें", grow: "क्या उगाना चाहते हैं?", ph: "मिट्टी pH", dur: "अवधि (दिन)", loc: "खेत का स्थान", note: "* हम मौसम डेटा स्वचालित रूप से प्राप्त करेंगे", btn: "डैशबोर्ड तैयार करें" },
    ta: { setup: "AI பண்ணை அமைப்பு", sub: "பயிர் மற்றும் இடத்தைத் தேர்ந்தெடுக்கவும்", grow: "நீங்கள் எதை வளர்க்க விரும்புகிறீர்கள்?", ph: "மண் pH", dur: "கால அளவு (நாட்கள்)", loc: "பண்ணை இருப்பிடம்", note: "* வானிலை தரவை தானாகவே பெறுவோம்", btn: "டேஷ்போர்டை உருவாக்கு" }
  };

  const t = labels[language] || labels.en;

  return (
    <div className="w-full max-w-lg mx-auto bg-white min-h-screen md:min-h-0 md:rounded-[40px] shadow-2xl overflow-hidden flex flex-col border-8 border-slate-900 border-opacity-5">
      <div className="relative h-64 flex-shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800"
          className="w-full h-full object-cover"
          alt="Farmland"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
        
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
          <div className="bg-white/90 backdrop-blur p-3 rounded-2xl shadow-sm flex items-center gap-2">
             <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
             <span className="font-bold text-slate-800 text-sm tracking-tight">Smart Farm</span>
          </div>
          
          <button 
            onClick={setLanguage}
            className="bg-white/90 backdrop-blur p-3 rounded-2xl shadow-sm flex items-center gap-2 font-bold text-xs text-slate-700 active:scale-95 transition-transform"
          >
            <Languages size={16} />
            {language.toUpperCase()}
          </button>
        </div>

        <div className="absolute bottom-4 left-6 right-6">
           <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t.setup}</h1>
           <p className="text-slate-600 text-sm font-medium">{t.sub}</p>
        </div>
      </div>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto scrollbar-hide">
        <div className="space-y-4">
          <p className="text-xs font-black uppercase tracking-wider text-slate-400">{t.grow}</p>
          <div className="grid grid-cols-4 gap-3">
             {CROPS.map(c => (
                <button
                   key={c.id}
                   type="button"
                   onClick={() => setFormData({...formData, crop: c.nameEn})}
                   className={`flex flex-col items-center justify-center p-3 rounded-[24px] border-2 transition-all ${
                     formData.crop === c.nameEn 
                       ? 'bg-green-600 border-green-600 shadow-lg scale-105' 
                       : 'bg-slate-50 border-transparent hover:bg-slate-100'
                   }`}
                >
                   <span className="text-2xl mb-1">{c.emoji}</span>
                   <span className={`text-[10px] font-bold truncate w-full text-center ${formData.crop === c.nameEn ? 'text-white' : 'text-slate-600'}`}>
                     {language === 'hi' ? c.nameHi : (language === 'ta' ? c.nameTa : c.nameEn)}
                   </span>
                </button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">{t.ph}</label>
              <div className="bg-slate-50 rounded-[20px] p-1 flex items-center border-2 border-transparent focus-within:border-green-500 focus-within:bg-white transition-all">
                 <div className="w-10 h-10 rounded-[16px] bg-white shadow-sm flex items-center justify-center text-slate-400">
                    <FlaskConical size={18} />
                 </div>
                 <input 
                   type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange}
                   placeholder="6.5"
                   className="flex-1 bg-transparent border-none outline-none px-3 font-bold text-slate-700 placeholder:text-slate-300"
                 />
              </div>
           </div>
           
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">{t.dur}</label>
              <div className="bg-slate-50 rounded-[20px] p-1 flex items-center border-2 border-transparent focus-within:border-green-500 focus-within:bg-white transition-all">
                 <div className="w-10 h-10 rounded-[16px] bg-white shadow-sm flex items-center justify-center text-slate-400">
                    <Calendar size={18} />
                 </div>
                 <input 
                   type="number" name="duration" value={formData.duration} onChange={handleChange}
                   placeholder="120"
                   className="flex-1 bg-transparent border-none outline-none px-3 font-bold text-slate-700 placeholder:text-slate-300"
                 />
              </div>
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1">{t.loc}</label>
           <div className="bg-slate-50 rounded-[24px] p-1.5 flex items-center border-2 border-transparent focus-within:border-green-500 focus-within:bg-white transition-all">
              <div className="w-12 h-12 rounded-[20px] bg-white shadow-sm flex items-center justify-center text-slate-400">
                 <MapPin size={22} />
              </div>
              <input 
                type="text" name="location" value={formData.location} onChange={handleChange}
                placeholder={language === 'hi' ? 'उदा. भोपाल' : (language === 'ta' ? 'உதாரணம்: சென்னை' : 'e.g. Bhopal')}
                className="flex-1 bg-transparent border-none outline-none px-4 font-bold text-slate-700 placeholder:text-slate-300"
              />
              <button 
                type="button"
                onClick={toggleListen}
                className={`w-12 h-12 rounded-[20px] flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400 hover:text-green-600'}`}
              >
                 <Mic size={20} />
              </button>
           </div>
           <p className="text-[10px] text-slate-400 font-bold px-1">{t.note}</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!formData.crop || !formData.location || isLoading}
          className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white py-5 rounded-[28px] font-black text-lg shadow-xl shadow-green-600/30 transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              {t.btn}
              <span className="text-2xl">➔</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputForm;
