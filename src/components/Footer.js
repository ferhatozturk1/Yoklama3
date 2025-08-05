import React from "react";
import {
  FaQrcode,
  FaLinkedin,
  FaInstagram,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="relative">
      <div className="glass border-t border-white/20">
        <div className="container mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FaQrcode className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    QR Yoklama Sistemi
                  </h3>
                  <p className="text-xs text-white/70">
                    Eğitimde Dijital Dönüşüm
                  </p>
                </div>
              </div>
              <p className="text-white/80 mb-6 leading-relaxed">
                Modern eğitim kurumları için tasarlanmış QR kod tabanlı yoklama
                sistemi. Güvenli, hızlı ve kullanıcı dostu çözümümüzle eğitimde
                dijital dönüşümü yaşayın.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.linkedin.com/company/enmdigital/posts/?feedView=all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://www.instagram.com/enmdigitall/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center text-white hover:bg-pink-700 transition-colors"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://enmdigital.com/index-2.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                >
                  <FaGlobe />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-4">
                Hızlı Bağlantılar
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() =>
                      document
                        .getElementById("home")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Ana Sayfa
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      document
                        .getElementById("product")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Ürün
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      document
                        .getElementById("about")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Hakkımızda
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      document
                        .getElementById("demo")
                        .scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Demo
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2025 QR Yoklama Sistemi. Tüm hakları saklıdır.
              <span className="mx-2">|</span>
              <a href="#" className="hover:text-white transition-colors">
                Gizlilik Politikası
              </a>
              <span className="mx-2">|</span>
              <a href="#" className="hover:text-white transition-colors">
                Kullanım Şartları
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
