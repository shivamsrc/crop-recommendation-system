import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import { Globe } from 'lucide-react';

function App() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Load the script only once
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    }

    // Initialize only once globally
    window.googleTranslateElementInit = () => {
      if (!document.getElementById('google_translate_element').hasChildNodes()) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'hi,bn,te,mr,ta,ur,gu,kn,ml,pa,as,or,sa,kok,ne,sd,ks',
            layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
          },
          'google_translate_element'
        );
      }
    };
  }, []);

  return (
    <div>
      {/* Floating Translate Button */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => setIsVisible(!isVisible)}
          style={{
            backgroundColor: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
          }}
          title="Translate"
        >
          <Globe size={24} color="#333" />
        </button>

        {/* Keep it mounted but toggle visibility */}
        <div
          id="google_translate_element"
          style={{
            display: isVisible ? 'block' : 'none',
            marginTop: '10px',
            background: 'white',
            borderRadius: '8px',
            padding: '6px 8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        ></div>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
