import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─────────────────────────────────────────────
// 🧭 Sidebar Component
// ─────────────────────────────────────────────
const Nav = ({ onSelect, isOpen, toggle }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        exit={{ x: -250 }}
        transition={{ duration: 0.3 }}
        className="fixed md:static top-0 left-0 w-64 h-full backdrop-blur-xl bg-white/70 md:bg-transparent p-6 shadow-lg md:shadow-none z-40 border-r border-emerald-100"
      >
        <div className="flex justify-between items-center md:block mb-8">
          <div className="font-extrabold text-xl text-emerald-700">🌱 Tools</div>
          <button
            onClick={toggle}
            className="md:hidden p-2 text-slate-600 hover:text-emerald-600 transition"
          >
            <X size={22} />
          </button>
        </div>
        <ul className="space-y-3 text-[15px] font-medium">
          {[
            { id: "crop", name: "🌾 Crop Recommendation" },
            { id: "yield", name: "📊 Yield Prediction" },
            { id: "weather", name: "🌤️ Weather Forecast" },
          ].map((tool) => (
            <motion.li key={tool.id} whileHover={{ x: 5 }}>
              <button
                onClick={() => {
                  onSelect(tool.id);
                  toggle();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-100/70 text-slate-700 hover:text-emerald-700 transition-all duration-200"
              >
                {tool.name}
              </button>
            </motion.li>
          ))}
        </ul>
      </motion.aside>
    )}
  </AnimatePresence>
);

// ─────────────────────────────────────────────
// 🌾 Crop Recommendation Form
// ─────────────────────────────────────────────
const CropForm = ({ onPredict }) => {
  const [f, setF] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });
  const onChange = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onPredict(f, "crop");
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {["N", "P", "K", "temperature", "humidity", "ph", "rainfall"].map((k) => (
        <div key={k} className="relative">
          <input
            name={k}
            value={f[k]}
            onChange={onChange}
            required
            className="peer w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white/70 backdrop-blur-sm"
          />
          <label
            className={`absolute left-3 text-gray-500 text-sm transition-all bg-white/80 px-1 ${
              f[k]
                ? "top-[-8px] text-xs text-emerald-600"
                : "top-3 text-gray-400 text-base"
            } peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-emerald-600`}
          >
            {k.toUpperCase()}
          </label>
        </div>
      ))}
      <div className="md:col-span-3 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg shadow-md hover:shadow-lg transition"
        >
          🌾 Recommend Crop
        </motion.button>
      </div>
    </form>
  );
};

// ─────────────────────────────────────────────
// 📊 Yield Prediction Form
// ─────────────────────────────────────────────
const YieldForm = ({ onPredict }) => {
  const [f, setF] = useState({
    State: "",
    Area: "",
    Annual_Rainfall: "",
    Fertilizer: "",
    Pesticide: "",
  });
  const onChange = (e) => setF({ ...f, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    onPredict(f, "yield");
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {Object.keys(f).map((k) => (
        <div key={k} className="relative">
          <input
            name={k}
            value={f[k]}
            onChange={onChange}
            required
            className="peer w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white/70 backdrop-blur-sm"
          />
          <label
            className={`absolute left-3 text-gray-500 text-sm transition-all bg-white/80 px-1 ${
              f[k]
                ? "top-[-8px] text-xs text-emerald-600"
                : "top-3 text-gray-400 text-base"
            } peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-emerald-600`}
          >
            {k.replace("_", " ").toUpperCase()}
          </label>
        </div>
      ))}
      <div className="md:col-span-3 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg shadow-md hover:shadow-lg transition"
        >
          📊 Predict Yield
        </motion.button>
      </div>
    </form>
  );
};

// ─────────────────────────────────────────────
// 🌤️ Weather Forecast
// ─────────────────────────────────────────────
const WeatherForecast = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const fetchWeather = async (e) => {
    e.preventDefault();
    try {
      // 🔑 No API key required for this demo using open-meteo
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=28.61&longitude=77.23&current_weather=true`
      );
      const data = await res.json();

      if (!data.current_weather) throw new Error("No weather data found");

      setWeather({
        temp: data.current_weather.temperature,
        wind: data.current_weather.windspeed,
        desc: "Clear Sky",
      });

      setForecast([
        { time: "Now", temp: data.current_weather.temperature },
        { time: "Next Hour", temp: data.current_weather.temperature + 1 },
        { time: "Later", temp: data.current_weather.temperature - 1 },
      ]);
    } catch (err) {
      setWeather({ error: err.message });
      setForecast([]);
    }
  };

  return (
    <div>
      <form onSubmit={fetchWeather} className="flex gap-3 mb-6">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name (demo uses Delhi)"
          className="flex-1 p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow"
        >
          🌤️ Get Weather
        </motion.button>
      </form>

      {weather && !weather.error && (
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-emerald-200 mb-6">
          <h3 className="text-lg font-semibold text-emerald-700 capitalize">
            Delhi
          </h3>
          <p>
            🌡️ {weather.temp}°C | 🌬️ {weather.wind} km/h | ☀️ {weather.desc}
          </p>
        </div>
      )}

      {weather?.error && (
        <p className="text-red-500">Error: {weather.error}</p>
      )}

      {forecast.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecast}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#10b981"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// 🚀 Main Dashboard Component
// ─────────────────────────────────────────────
export default function Dashboard() {
  const [tool, setTool] = useState("crop");
  const [cropResult, setCropResult] = useState(null);
  const [yieldResult, setYieldResult] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((p) => !p);

  const handlePredict = async (features, type) => {
    if (type === "crop") setCropResult("⏳ Loading...");
    else setYieldResult("⏳ Loading...");

    try {
      const endpoint =
        type === "crop"
          ? "http://127.0.0.1:5001/predict/crop"
          : "http://127.0.0.1:5001/predict/yield";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(features),
      });
      const data = await res.json();

      if (type === "crop") setCropResult(data.prediction || data.error);
      else setYieldResult(data.prediction || data.error);
    } catch (err) {
      if (type === "crop") setCropResult("❌ Error: " + err.message);
      else setYieldResult("❌ Error: " + err.message);
    }
  };

  // 🖼️ Realistic crop images
  const cropImages = {
  rice: "https://www.bing.com/th/id/OIP.qeFvUNnDQw2VmnPv-FNoAwHaE8?w=260&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&dpr=1.3&pid=3.1&rm=2&ucfimg=1",
  wheat: "https://www.bing.com/th/id/OIP.b1aJRcYoc8A-31fa3hkmZAHaFj?w=239&h=211&c=8&rs=1&qlt=90&o=6&cb=ucfimg1&dpr=1.3&pid=3.1&rm=2&ucfimg=1",
  maize: "https://th.bing.com/th/id/OIP.7Blw9t16_5bjuqfXXctPVQHaFX?w=314&h=183&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
  cotton: "https://th.bing.com/th/id/OIP.5DDXxiELZeSOJYEv9rtMTAHaHS?w=186&h=182&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
  sugarcane: "https://th.bing.com/th/id/OIP.WZu9EGc2qHy4M58S3Tfz0QHaEy?w=227&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
  chickpea: "https://storage.googleapis.com/cgiarorg/2020/07/f6257e07-new-chickpea-varieties.jpg",
  kidneybeans: "https://www.cono-group.com/cono-group/01_products/beans/dark-red-kidney/image-thumb__292__format_16to9/cono-dark-red-kidney-ge-666102376.jpg",
  pigeonpeas: "https://th.bing.com/th/id/OIP.Mt9v1LtdLes71tKSYJwd3AHaFh?w=212&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
  mothbeans: "https://th.bing.com/th/id/OIP.KMkVHj8Ju6ZEvhyZeEIgOAHaE9?w=225&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
  mungbean: "https://th.bing.com/th/id/OIP.V-IYbbaa33sxQnfYwKwfvQHaEK?w=275&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
  blackgram: "https://th.bing.com/th/id/OIP.cvLD0MeRTOXhuBFLolsocAHaEK?w=322&h=181&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
  lentil: "https://th.bing.com/th/id/OIP.VWrRc-OaaB2ngUKUPamiJgHaE7?w=300&h=199&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
  pomegranate: "https://th.bing.com/th/id/OIP.FswVFy1wdPIThwkohE7R8QHaFW?w=226&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
  banana: "https://th.bing.com/th/id/OIP.yCeZ1FyccsJazSVdEuXyWwHaE7?w=262&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
  mango: "https://th.bing.com/th/id/OIP.DYy8hr8QvMk-S_78RjVVzQHaLu?w=115&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
  grapes: "https://th.bing.com/th/id/OIP.g84nICklA5fnZDhFV23t-QHaFS?w=291&h=208&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
  watermelon: "https://th.bing.com/th/id/OIP.pEuNrwUsUVctpnnL9bfO6wHaEU?w=252&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
  muskmelon: "https://tse2.mm.bing.net/th/id/OIP.tU9S9J5Y-qV1byi5Kyal0wHaEC?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
  apple: "https://usapple.org/wp-content/uploads/2019/11/feature-image-chlorpyrifos.jpg",
  jute: "https://tse2.mm.bing.net/th/id/OIP.L8N0RV36ytH51Zax_Q5yZQHaFx?pid=Api&P=0&h=180",
  coffee: "https://th.bing.com/th/id/OIP.dlsFacc3IlIBzkhGM3tk1AHaE8?w=223&h=180&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1",
  coconut: "https://tse2.mm.bing.net/th/id/OIP.M7EOTYjS-aENZJTsoJJhLAHaE7?pid=Api&P=0&h=180"
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50 border-b border-emerald-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold shadow-md">
            CG
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">
            CropGen Dashboard
          </span>
        </div>
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-slate-600 hover:text-emerald-600 transition"
        >
          <Menu size={24} />
        </button>
      </header>

      <div className="max-w-7xl mx-auto flex relative">
        <Nav
          onSelect={setTool}
          isOpen={isMenuOpen || window.innerWidth >= 768}
          toggle={toggleMenu}
        />

        <main className="flex-1 p-6 md:ml-4">
          <motion.div
            key={tool}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-emerald-100"
          >
            <h2 className="font-extrabold text-2xl mb-6 bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">
              {tool === "crop"
                ? "🌾 Crop Recommendation"
                : tool === "yield"
                ? "📊 Yield Prediction"
                : "🌤️ Weather Forecast"}
            </h2>

            {tool === "crop" && <CropForm onPredict={handlePredict} />}
            {tool === "yield" && <YieldForm onPredict={handlePredict} />}
            {tool === "weather" && <WeatherForecast />}

            {cropResult && tool === "crop" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 flex flex-col items-center bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 p-6 rounded-lg text-emerald-800 shadow-sm"
              >
                <img
                  src={
                    cropImages[cropResult?.toLowerCase()] ||
                    "https://upload.wikimedia.org/wikipedia/commons/6/6f/Paddy_field_in_Tamil_Nadu.jpg"
                  }
                  alt={cropResult}
                  className="w-40 h-40 mb-3 object-cover rounded-lg shadow"
                />
                <strong className="text-xl capitalize">
                  Recommended Crop: {cropResult}
                </strong>
              </motion.div>
            )}

            {yieldResult && tool === "yield" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 bg-gradient-to-r from-emerald-100 to-green-50 border border-emerald-200 p-4 rounded-lg text-emerald-800 text-center shadow-sm"
              >
                <strong>🌾 Predicted Yield:</strong> {yieldResult} t/ha
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
