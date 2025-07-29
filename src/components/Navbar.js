import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaQrcode, FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FaQrcode className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">QR Yoklama</h1>
              <p className="text-xs text-white/70">Sistemi</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-white/80 hover:text-white font-medium transition-colors duration-300"
            >
              Ana Sayfa
            </button>
            <button 
              onClick={() => scrollToSection('product')}
              className="text-white/80 hover:text-white font-medium transition-colors duration-300"
            >
              Ürün
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-white/80 hover:text-white font-medium transition-colors duration-300"
            >
              Hakkımızda
            </button>
            <button 
              onClick={() => scrollToSection('demo')}
              className="text-white/80 hover:text-white font-medium transition-colors duration-300"
            >
              Demo
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/giris" 
              className="text-white/80 hover:text-white font-medium transition-colors duration-300 px-4 py-2 rounded-lg hover:bg-white/10"
            >
              Giriş Yap
            </Link>
            <Link 
              to="/kayit" 
              className="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-105"
            >
              Kayıt Ol
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-black/30 backdrop-blur-md">
            <div className="px-4 pt-4 pb-6 space-y-2">
              <button 
                onClick={() => scrollToSection('home')}
                className="block w-full text-left px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 font-medium transition-all duration-300 rounded-lg"
              >
                Ana Sayfa
              </button>
              <button 
                onClick={() => scrollToSection('product')}
                className="block w-full text-left px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 font-medium transition-all duration-300 rounded-lg"
              >
                Ürün
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 font-medium transition-all duration-300 rounded-lg"
              >
                Hakkımızda
              </button>
              <button 
                onClick={() => scrollToSection('demo')}
                className="block w-full text-left px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 font-medium transition-all duration-300 rounded-lg"
              >
                Demo
              </button>
              
              {/* Mobile Auth Buttons */}
              <div className="flex space-x-3 px-4 py-4 mt-6">
                <Link 
                  to="/giris" 
                  className="flex-1 text-center px-4 py-3 text-white border border-white/30 rounded-lg font-medium transition-all duration-300 hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link 
                  to="/kayit" 
                  className="flex-1 text-center px-4 py-3 bg-white text-purple-600 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;