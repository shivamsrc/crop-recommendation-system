import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-slate-100 text-slate-800">
      {/* Navbar */}
      <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg flex items-center justify-center text-white font-bold"
            >
              CG
            </motion.div>
            <span className="text-xl font-bold tracking-tight text-emerald-700">CropGen</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-slate-600 text-sm font-medium">
            <a href="#hero" className="hover:text-emerald-600 transition">Home</a>
            <a href="#features" className="hover:text-emerald-600 transition">Features</a>
            <a href="#soil" className="hover:text-emerald-600 transition">Soil Classification</a>
            <a href="#weather" className="hover:text-emerald-600 transition">Weather Forecasting</a>
            <a href="#yield" className="hover:text-emerald-600 transition">Yield Prediction</a>
            <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-emerald-600 text-white shadow hover:bg-emerald-700 transition">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main id="hero" className="pt-28 pb-20 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-800">
            Smarter <span className="text-emerald-600">Crop Choices</span> for a Sustainable Future
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Harness AI-powered insights for soil, climate, and yield to help farmers make data-driven decisions.
          </p>
          <div className="mt-6 flex gap-4">
            <Link to="/dashboard" className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold shadow hover:bg-emerald-700 transition">
              Launch Dashboard
            </Link>
            <a href="#features" className="px-6 py-3 rounded-lg border border-emerald-600 text-emerald-600 font-semibold hover:bg-emerald-50 transition">
              Explore Features
            </a>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center"
        >
          <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-md">
            <h3 className="font-semibold text-lg text-slate-700">Quick Demo</h3>
            <p className="text-sm text-slate-500 mt-2">Sample input for instant crop suggestion:</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">Crop: <strong>Rice</strong></div>
              <div className="p-3 border rounded-lg">Yield: <strong>4.1 t/ha</strong></div>
              <div className="p-3 border rounded-lg">Soil: <strong>Loamy</strong></div>
              <div className="p-3 border rounded-lg">Weather: <strong>Sunny</strong></div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16">
        <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-3xl font-bold text-center">
          Platform Features
        </motion.h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Crop Recommendation', text: 'Suggests the most suitable crops based on soil nutrients and weather data.' },
            { title: 'Soil Classification', text: 'Classifies soil texture and type using sensor and input parameters.' },
            { title: 'Weather Forecasting', text: 'Provides near-term weather predictions to optimize farming schedules.' },
            { title: 'Yield Prediction', text: 'Estimates expected yield based on soil, crop, and environmental conditions.' },
            { title: 'Smart Dashboard', text: 'Manage and visualize results with modern analytics and charts.' },
            { title: 'Data Integration', text: 'Integrates real-time APIs and datasets for more accurate predictions.' }
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100"
            >
              <h4 className="font-semibold text-lg text-emerald-700">{f.title}</h4>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/60 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} <strong>CropGen</strong> — AI-Powered Agriculture Assistant 🌱
      </footer>
    </div>
  )
}
