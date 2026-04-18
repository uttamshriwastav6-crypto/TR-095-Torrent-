import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithAI } from '../services/api';
import { 
  Home, Calendar, Mic, Bell, User, Menu, CloudRain, Droplets, 
  Package, Bug, X, ArrowLeft, Send, CheckCircle2, AlertCircle, Info, Beaker,
  Thermometer, Leaf, Sprout, Wind, MapPin
} from 'lucide-react';

const dict = {
  en: {
    dashboard: "Smart Farm Advisor", greeting: "Good Morning", crop: "Crop", ph: "Soil pH",
    moisture: "Moisture", overview: "Today's Overview", seeAll: "See all", rain: "Rain",
    irrigate: "Irrigate", fertilizer: "Fertilizer", pestRisk: "Pest Risk", quickActions: "Quick Actions",
    weeklyPlan: "Weekly Plan", calendar: "Calendar", pestControl: "Pest Control", getAdvice: "Get AI Advice",
    tasksRemaining: "Tasks remaining", thisWeek: "This Week", notifications: "Notifications",
    aiAdvisor: "AI Advisor", askAnything: "Ask anything...", listening: "Listening...",
    today: "Today", tasksFor: "Tasks for", noTasks: "No tasks planned for this day.",
    comingSoon: "Coming Soon", dailyGuidance: "Your Daily Guidance", stage: "Stage",
    profile: "My Farm Profile", farmLocation: "Farm Location", language: "Language", 
    settings: "Settings", logout: "Logout"
  },
  hi: {
    dashboard: "कृषि सलाहकार", greeting: "नमस्ते", crop: "फसल", ph: "मिट्टी pH",
    moisture: "नमी", overview: "आज का अवलोकन", seeAll: "सभी देखें", rain: "बारिश",
    irrigate: "सिंचाई", fertilizer: "उर्वरक", pestRisk: "कीट जोखिम", quickActions: "त्वरित कार्य",
    weeklyPlan: "साप्ताहिक योजना", calendar: "कैलेंडर", pestControl: "कीट नियंत्रण", getAdvice: "AI सलाह लें",
    tasksRemaining: "कार्य शेष", thisWeek: "इस हफ्ते", notifications: "सूचनाएं",
    aiAdvisor: "AI सलाहकार", askAnything: "कुछ भी पूछें...", listening: "सुन रहा हूँ...",
    today: "आज", tasksFor: "कार्य:", noTasks: "आज के लिए कोई कार्य नहीं।",
    comingSoon: "जल्द आ रहा है", dailyGuidance: "दैनिक मार्गदर्शन", stage: "चरण",
    profile: "मेरा फार्म प्रोफाइल", farmLocation: "खेत का स्थान", language: "भाषा", 
    settings: "सेटिंग्स", logout: "लोगआउट"
  },
  ta: {
    dashboard: "ஸ்மார்ட் பண்ணை ஆலோசகர்", greeting: "காலை வணக்கம்", crop: "பயிர்", ph: "மண் pH",
    moisture: "ஈரப்பதம்", overview: "இன்றைய கண்ணோட்டம்", seeAll: "அனைத்தையும் பார்", rain: "மழை",
    irrigate: "நீர்ப்பாசனம்", fertilizer: "உரம்", pestRisk: "பூச்சி ஆபத்து", quickActions: "விரைவான செயல்கள்",
    weeklyPlan: "வாராந்திர திட்டம்", calendar: "நாட்காட்டி", pestControl: "பூச்சி கட்டுப்பாடு", getAdvice: "AI ஆலோசனை பெறு",
    tasksRemaining: "மீதமுள்ள பணிகள்", thisWeek: "இந்த வாரம்", notifications: "அறிவிப்புகள்",
    aiAdvisor: "AI ஆலோசகர்", askAnything: "எதுவும் கேளுங்கள்...", listening: "கேட்கிறது...",
    today: "இன்று", tasksFor: "பணிகள்:", noTasks: "இன்று எந்தப் பணிகளும் இல்லை.",
    comingSoon: "விரைவில்", dailyGuidance: "தினசரி வழிகாட்டுதல்", stage: "நிலை",
    profile: "எனது பண்ணை விவரம்", farmLocation: "பண்ணை இடம்", language: "மொழி", 
    settings: "அமைப்புகள்", logout: "வெளியேறு"
  }
};

const BottomNav = ({ activeTab, setTab, onMicToggle }) => (
  <div className="absolute bottom-0 w-full bg-white border-t border-slate-100 flex items-center justify-between px-8 py-4 pb-8 z-50">
    <button onClick={() => setTab('home')} className={`transition-all ${activeTab === 'home' ? 'text-green-600' : 'text-slate-300 hover:text-slate-400'}`}>
      <Home size={26} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
    </button>
    <button onClick={() => setTab('calendar')} className={`transition-all ${activeTab === 'calendar' ? 'text-green-600' : 'text-slate-300 hover:text-slate-400'}`}>
      <Calendar size={26} strokeWidth={activeTab === 'calendar' ? 2.5 : 2} />
    </button>
    
    <div className="relative -top-8">
      <button 
        onClick={onMicToggle} 
        className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-600/40 active:scale-90 transition-transform ring-4 ring-white"
      >
        <Mic size={28} />
      </button>
    </div>

    <button onClick={() => setTab('notifications')} className={`relative transition-all ${activeTab === 'notifications' ? 'text-green-600' : 'text-slate-300 hover:text-slate-400'}`}>
      <Bell size={26} strokeWidth={activeTab === 'notifications' ? 2.5 : 2} />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[8px] flex items-center justify-center text-white font-bold">3</span>
    </button>
    <button onClick={() => setTab('profile')} className={`transition-all ${activeTab === 'profile' ? 'text-green-600' : 'text-slate-300 hover:text-slate-400'}`}>
      <User size={26} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
    </button>
  </div>
);

const ViewHome = ({ data, setTab, onBack, language = 'en' }) => {
  const t = dict[language] || dict.en;
  return (
    <div className="flex flex-col h-full overflow-y-auto pb-32 scrollbar-hide bg-[#f8fafc]">
      <div className="p-6 flex justify-between items-center">
        <button onClick={onBack} className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-slate-800 transition-transform active:scale-90"><Menu size={20} /></button>
        <div className="flex items-center gap-2">
           <Sprout className="text-green-600" size={24} />
           <span className="font-black text-slate-800 tracking-tight">{t.dashboard}</span>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => setTab('notifications')} className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center relative active:scale-90">
              <Bell size={20} className="text-slate-600" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
           </button>
           <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center font-bold">TA</div>
        </div>
      </div>

      <div className="px-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-800">{t.greeting}!</h1>
          <p className="text-slate-500 text-sm flex items-center gap-1 font-medium mt-1">
            <MapPin size={14} className="text-green-600" />
            {data?.location || "Coimbatore, India"}
          </p>
        </div>
        <div className="bg-white p-2 px-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
           <CloudRain className="text-blue-500" size={18} />
           <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800">28°C</span>
              <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Partly Cloudy</span>
           </div>
        </div>
      </div>

      <div className="px-6 grid grid-cols-4 gap-3 mb-10">
         {[
           { icon: Leaf, label: t.crop, val: data?.crop || 'Rice', color: 'text-green-600', bg: 'bg-green-50' },
           { icon: Beaker, label: t.ph, val: data?.ph || '6.2', color: 'text-blue-600', bg: 'bg-blue-50' },
           { icon: Droplets, label: t.moisture, val: 'Low', color: 'text-cyan-600', bg: 'bg-cyan-50' },
           { icon: Sprout, label: t.stage, val: 'Vegetative', color: 'text-emerald-600', bg: 'bg-emerald-50' }
         ].map((card, idx) => (
           <div key={idx} className="bg-white p-3 rounded-[24px] shadow-sm flex flex-col items-center justify-center border border-slate-50 group transition-colors active:scale-95">
              <div className={`w-10 h-10 rounded-[16px] ${card.bg} flex items-center justify-center ${card.color} mb-2`}>
                 <card.icon size={20} />
              </div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight text-center">{card.label}</span>
              <span className="text-xs font-black text-slate-800 mt-0.5 text-center">{card.val}</span>
           </div>
         ))}
      </div>

      <div className="px-6 mb-10">
         <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-black text-slate-800 tracking-tight">{t.overview}</h2>
            <button className="text-green-600 text-xs font-black uppercase tracking-wider">{t.seeAll}</button>
         </div>
         <div className="grid grid-cols-2 gap-4">
            <div onClick={() => setTab('notifications')} className="bg-blue-500 rounded-[32px] p-5 text-white relative overflow-hidden group shadow-lg shadow-blue-500/20 active:scale-95 transition-transform cursor-pointer">
               <CloudRain className="mb-8 relative z-10" size={32} />
               <h3 className="text-lg font-black">{t.rain}</h3>
               <p className="text-[11px] text-blue-50 font-medium leading-tight mt-1">Expected in 2 Days</p>
            </div>
            <div onClick={() => setTab('plan')} className="bg-emerald-500 rounded-[32px] p-5 text-white relative overflow-hidden group shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform cursor-pointer">
               <Droplets className="mb-8 relative z-10" size={32} />
               <h3 className="text-lg font-black">{t.irrigate}</h3>
               <p className="text-[11px] text-emerald-50 font-medium leading-tight mt-1">Light Today</p>
            </div>
            <div className="bg-amber-500 rounded-[32px] p-5 text-white relative overflow-hidden group shadow-lg shadow-amber-500/20 active:scale-95 transition-transform cursor-pointer">
               <Package className="mb-8 relative z-10" size={32} />
               <h3 className="text-lg font-black">{t.fertilizer}</h3>
               <p className="text-[11px] text-amber-50 font-medium leading-tight mt-1">Apply in 3 Days</p>
            </div>
            <div onClick={() => setTab('notifications')} className="bg-rose-500 rounded-[32px] p-5 text-white relative overflow-hidden group shadow-lg shadow-rose-500/20 active:scale-95 transition-transform cursor-pointer">
               <Bug className="mb-8 relative z-10" size={32} />
               <h3 className="text-lg font-black">{t.pestRisk}</h3>
               <p className="text-[11px] text-rose-50 font-medium leading-tight mt-1">High Risk Check Now</p>
            </div>
         </div>
      </div>

      <div className="px-6 mb-10">
         <h2 className="text-lg font-black text-slate-800 tracking-tight text-left mb-4">{t.quickActions}</h2>
         <div className="flex justify-between">
            {[
               { icon: Calendar, label: t.weeklyPlan, tab: 'plan' },
               { icon: Calendar, label: t.calendar, tab: 'calendar' },
               { icon: Bug, label: t.pestControl, tab: 'notifications' },
               { icon: Package, label: t.fertilizer, tab: 'notifications' }
            ].map((action, idx) => (
              <button key={idx} onClick={() => setTab(action.tab)} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
                 <div className="w-16 h-16 bg-white rounded-[24px] shadow-sm border border-slate-50 flex items-center justify-center text-slate-800 hover:text-green-600 transition-colors">
                    <action.icon size={28} />
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight w-14 leading-none">{action.label}</span>
              </button>
            ))}
         </div>
      </div>
    </div>
  );
};

const ViewWeeklyPlan = ({ data, setTab, language = 'en' }) => {
  const t = dict[language] || dict.en;
  return (
    <div className="p-6 h-full overflow-y-auto pb-32 bg-[#f8fafc]">
       <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setTab('home')} className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-slate-800"><ArrowLeft size={20} /></button>
          <span className="font-black text-2xl text-slate-800">{t.weeklyPlan}</span>
       </div>

       <div className="bg-green-600 rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-green-600/20 mb-8">
          <div className="relative z-10">
             <h2 className="text-3xl font-black mb-2">{t.thisWeek}</h2>
             <p className="text-green-100 font-bold opacity-80">{data?.weekly_plan?.length || 7} {t.tasksRemaining}</p>
          </div>
          <Calendar size={120} className="absolute -right-4 top-1/2 -translate-y-1/2 text-white/10 rotate-12" strokeWidth={1} />
       </div>

       <div className="space-y-6">
          {(data?.weekly_plan || []).map((plan, idx) => (
             <div key={idx} className="animate-slide-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-widest mb-3 ml-2">{plan.day}</h3>
                <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-50 flex items-start gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-green-500">
                      <CheckCircle2 size={24} />
                   </div>
                   <div className="flex-1">
                      <p className="font-black text-slate-800 text-sm leading-tight mb-1">{plan.task}</p>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">{plan.details}</p>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

const ViewNotifications = ({ data, setTab, language = 'en' }) => {
  const t = dict[language] || dict.en;
  return (
    <div className="p-6 h-full overflow-y-auto pb-32 bg-[#f8fafc]">
       <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setTab('home')} className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-slate-800"><ArrowLeft size={20} /></button>
          <span className="font-black text-2xl text-slate-800">{t.notifications}</span>
       </div>

       <div className="space-y-4">
          {(data?.notifications || []).map((notif, idx) => {
             let iconBg = 'bg-blue-100'; let iconColor = 'text-blue-500';
             if (notif.type === 'danger') { iconBg = 'bg-rose-100'; iconColor = 'text-rose-600'; }
             if (notif.type === 'warning') { iconBg = 'bg-amber-100'; iconColor = 'text-amber-600'; }
             
             return (
               <div key={idx} className="bg-white rounded-[32px] p-5 shadow-sm border border-slate-50 flex gap-4 animate-slide-up">
                  <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center ${iconColor} flex-shrink-0`}>
                     <Bell size={28} />
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-start mb-1">
                        <h4 className="font-black text-slate-800 text-sm">{notif.title}</h4>
                        <span className="text-[10px] text-slate-300 font-bold uppercase">{notif.date || 'Today'}</span>
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium">{notif.message}</p>
                  </div>
               </div>
             )
          })}
       </div>
    </div>
  );
};

const ViewAdvisor = ({ data, setTab, language = 'en', chatHistory, setChatHistory }) => {
  const t = dict[language] || dict.en;
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const toggleListen = () => {
    if (!('webkitSpeechRecognition' in window)) {
       alert("Speech recognition not supported");
       return;
    }
    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
       const text = e.results[0][0].transcript;
       setInputText(text);
       handleSend(text);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSend = async (manualText) => {
    const text = typeof manualText === 'string' ? manualText : inputText;
    if (!text.trim()) return;
    
    setInputText("");
    const newHistory = [...chatHistory, { role: 'user', text: text.trim() }];
    setChatHistory(newHistory);
    setIsTyping(true);

    const reply = await chatWithAI({ message: text.trim(), history: chatHistory, contextData: data, language });
    setChatHistory([...newHistory, { role: 'model', text: reply }]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] relative">
       <div className="p-6 flex items-center justify-between bg-white/70 backdrop-blur-md border-b border-slate-100 z-10 sticky top-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setTab('home')} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-800"><ArrowLeft size={20} /></button>
             <span className="font-black text-xl text-slate-800">{t.aiAdvisor}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Mic size={16} /></div>
       </div>

       <div className="flex-1 overflow-y-auto px-6 pt-6 pb-40 space-y-6 scrollbar-hide">
          {chatHistory.length === 0 && (
             <div className="bg-green-600 rounded-[40px] p-8 text-white relative shadow-xl shadow-green-600/20">
                <h2 className="text-2xl font-black mb-2">{t.dailyGuidance}</h2>
                <p className="text-green-50 font-medium leading-relaxed">{data?.daily_guidance}</p>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
             </div>
          )}

          {chatHistory.map((msg, i) => (
             <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end font-bold' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 px-5 rounded-[28px] shadow-sm text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-slate-800 text-white rounded-br-none' : 'bg-white text-slate-700 border border-slate-50 rounded-bl-none'
                }`}>
                   {msg.text}
                </div>
             </div>
          ))}
          {isTyping && (
             <div className="flex justify-start">
                <div className="bg-white p-4 rounded-[24px] shadow-sm flex gap-1 items-center">
                   <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                </div>
             </div>
          )}
          <div ref={messagesEndRef} />
       </div>

       <div className="absolute bottom-[100px] left-0 w-full px-6 py-4 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc] to-transparent z-40">
          <div className={`bg-white rounded-[32px] p-2 pl-6 shadow-2xl border flex items-center gap-3 transition-all ${isListening ? 'border-red-500 scale-[1.02]' : 'border-slate-100'}`}>
             <input 
               type="text" value={inputText} onChange={e => setInputText(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleSend()}
               placeholder={isListening ? t.listening : t.askAnything}
               className="flex-1 bg-transparent border-none outline-none font-bold text-slate-700 placeholder:text-slate-300"
             />
             <button onClick={toggleListen} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white pulse' : 'bg-slate-50 text-slate-400 hover:text-green-600'}`}>
                <Mic size={22} />
             </button>
             <button onClick={handleSend} className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform disabled:opacity-50">
                <Send size={22} />
             </button>
          </div>
       </div>
    </div>
  );
};

const ViewProfile = ({ data, language, t, onBack }) => (
  <div className="p-6 h-full overflow-y-auto pb-32 bg-[#f8fafc]">
     <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-slate-800"><ArrowLeft size={20} /></button>
        <span className="font-black text-2xl text-slate-800">{t.profile}</span>
     </div>

     <div className="bg-white rounded-[40px] p-8 flex flex-col items-center shadow-lg border border-slate-50 mb-8">
        <div className="w-24 h-24 rounded-[32px] bg-green-600 text-white flex items-center justify-center text-3xl font-black mb-4 shadow-xl shadow-green-600/20">TA</div>
        <h3 className="text-xl font-black text-slate-800">Tamil Farmer</h3>
        <p className="text-sm font-bold text-slate-400">{data?.location}</p>
     </div>

     <div className="space-y-3">
        {[
          { icon: Leaf, label: t.crop, val: data?.crop || 'Rice' },
          { icon: MapPin, label: t.farmLocation, val: data?.location },
          { icon: Languages, label: t.language, val: language === 'hi' ? 'हिन्दी' : 'English' },
          { icon: User, label: t.settings, val: 'Account' },
        ].map((item, i) => (
           <div key={i} className="bg-white p-5 rounded-[28px] flex items-center justify-between border border-slate-50 active:scale-[0.98] transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><item.icon size={20} /></div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-300 tracking-wider mb-0.5">{item.label}</p>
                    <p className="font-black text-slate-700 text-sm">{item.val}</p>
                 </div>
              </div>
              <ArrowLeft className="rotate-180 text-slate-200" size={20} />
           </div>
        ))}
        <button onClick={() => window.location.reload()} className="w-full bg-rose-50 text-rose-500 py-5 rounded-[28px] font-black text-sm mt-4 active:scale-[0.98] transition-all">{t.logout}</button>
     </div>
  </div>
);

const ViewCalendar = ({ setTab, data, language = 'en' }) => {
  const t = dict[language] || dict.en;
  const [baseDate, setBaseDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const today = new Date();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const tasksMapping = {};
  if (year === today.getFullYear() && month === today.getMonth()) {
      const cur = today.getDate();
      (data?.weekly_plan || []).forEach((plan, i) => {
         const d = cur + i;
         if (d <= daysInMonth) {
            if (!tasksMapping[d]) tasksMapping[d] = [];
            tasksMapping[d].push({ title: plan.task, text: plan.details, type: 'info' });
         }
      });
  }

  return (
    <div className="p-6 h-full overflow-y-auto pb-32 bg-white flex flex-col">
       <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setTab('home')} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-800"><ArrowLeft size={20} /></button>
          <span className="font-black text-2xl text-slate-800">{t.calendar}</span>
       </div>

       <div className="flex justify-between items-center mb-8">
          <button onClick={() => setBaseDate(new Date(year, month - 1))} className="p-2 text-slate-400 transition-colors"><ArrowLeft size={20} /></button>
          <h2 className="font-black text-lg text-slate-800 uppercase tracking-widest">{monthNames[month]} {year}</h2>
          <button onClick={() => setBaseDate(new Date(year, month + 1))} className="p-2 text-slate-400 transition-colors rotate-180"><ArrowLeft size={20} /></button>
       </div>

       <div className="grid grid-cols-7 gap-y-2 mb-10">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <span key={d} className="text-center text-[10px] font-black text-slate-300 uppercase">{d}</span>)}
          {Array.from({length: firstDayOfMonth}).map((_, i) => <div key={`e-${i}`}></div>)}
          {Array.from({length: daysInMonth}).map((_, i) => {
             const d = i + 1;
             const active = d === selectedDate;
             const task = tasksMapping[d];
             return (
               <button 
                key={d} 
                onClick={() => setSelectedDate(d)}
                className={`h-12 w-12 mx-auto flex flex-col items-center justify-center rounded-2xl transition-all relative ${active ? 'bg-green-600 text-white shadow-xl shadow-green-600/30' : 'text-slate-800 hover:bg-slate-50'}`}
               >
                 <span className={`font-bold text-sm ${active ? 'text-white' : (d === today.getDate() && month === today.getMonth() ? 'text-green-600' : 'text-slate-800')}`}>{d}</span>
                 {task && <div className={`w-1.5 h-1.5 rounded-full mt-1 ${active ? 'bg-white' : 'bg-blue-400'}`}></div>}
               </button>
             );
          })}
       </div>

       <div className="space-y-4">
          <div className="flex justify-between items-center mb-2 px-1">
             <h3 className="font-black text-slate-800">Upcoming Tasks & Warnings</h3>
             <button className="text-green-600 text-[10px] font-black uppercase">View All</button>
          </div>
          {(tasksMapping[selectedDate] || []).map((t, idx) => (
             <div key={idx} className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex items-start gap-4 animate-slide-up">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                   <CloudRain size={24} />
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-center">
                      <h4 className="font-black text-sm text-slate-800">{t.title}</h4>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Dec {selectedDate}</span>
                   </div>
                   <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium">{t.text}</p>
                </div>
             </div>
          ))}
          {(!tasksMapping[selectedDate] || tasksMapping[selectedDate].length === 0) && (
             <div className="text-center py-10 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                <Leaf className="mx-auto text-slate-200 mb-2" size={40} />
                <p className="text-xs font-bold text-slate-400">Rest day! No tasks scheduled.</p>
             </div>
          )}
       </div>
    </div>
  );
}

const ResultsView = ({ data, language = 'en', onBack }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [chatHistory, setChatHistory] = useState([]);
  
  const t = dict[language] || dict.en;

  const renderView = () => {
    switch (activeTab) {
      case 'home': return <ViewHome data={data} setTab={setActiveTab} onBack={onBack} language={language} />;
      case 'calendar': return <ViewCalendar data={data} setTab={setActiveTab} language={language} />;
      case 'plan': return <ViewWeeklyPlan data={data} setTab={setActiveTab} language={language} />;
      case 'notifications': return <ViewNotifications data={data} setTab={setActiveTab} language={language} />;
      case 'advisor': return <ViewAdvisor data={data} chatHistory={chatHistory} setChatHistory={setChatHistory} setTab={setActiveTab} language={language} />;
      case 'profile': return <ViewProfile data={data} language={language} t={t} onBack={() => setActiveTab('home')} />;
      default: return <ViewHome data={data} setTab={setActiveTab} onBack={onBack} language={language} />;
    }
  };

  return (
    <div className="h-screen w-full lg:max-w-md mx-auto bg-white relative shadow-2xl lg:rounded-[50px] overflow-hidden lg:border-[10px] border-slate-900 lg:my-8 lg:h-[880px] flex flex-col font-sans">
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav activeTab={activeTab} setTab={setActiveTab} onMicToggle={() => setActiveTab('advisor')} />
    </div>
  );
};

export default ResultsView;
