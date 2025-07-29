import React from 'react';
import { Link } from 'react-router-dom';
import { FaQrcode, FaUsers, FaShieldAlt, FaClock, FaChartLine, FaMobile, FaCloud, FaHeadset, FaCogs, FaRocket } from 'react-icons/fa';

function Services() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-32 px-6 sm:px-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-2xl mb-8 glow-box neon-pulse">
            <FaCogs className="text-4xl text-white" />
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black neon-text mb-8 leading-tight">
            Our Services
          </h1>
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
            <p className="mx-6 text-2xl md:text-3xl font-semibold text-gray-300">
              Advanced Features & Solutions
            </p>
            <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
          </div>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-16 leading-relaxed">
            Discover the <span className="neon-text-blue font-semibold">advanced features</span> and 
            <span className="neon-text-purple font-semibold"> comprehensive services</span> offered by our QR Attendance System
          </p>
        </div>
      </section>

      {/* Hizmetler */}
      <section className="py-20 px-6 sm:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:bg-white/15 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaQrcode className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">QR Kodlu Yoklama</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Her 5 saniyede yenilenen güvenli QR kodları ile hızlı ve güvenilir yoklama sistemi
              </p>
              <ul className="text-white/70 space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Dinamik QR kod güvenliği
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Anlık katılım takibi
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Otomatik doğrulama
                </li>
              </ul>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:bg-white/15 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaUsers className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Öğrenci Yönetimi</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Excel dosyalarından toplu öğrenci ekleme ve kapsamlı veri yönetimi sistemi
              </p>
              <ul className="text-white/70 space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Excel ile veri aktarımı
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Öğrenci profil yönetimi
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  Veri dışa aktarma
                </li>
              </ul>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:bg-white/15 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Veri Güvenliği</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                GDPR uyumlu güvenlik standartları ile maksimum veri korunması sağlar
              </p>
              <ul className="text-white/70 space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  End-to-end şifreleme
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  GDPR uyumluluğu
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  Güvenli veri saklama
                </li>
              </ul>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:bg-white/15 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaClock className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Gerçek Zamanlı İzleme</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Yoklama sürecini anlık olarak takip edin ve kontrol altında tutun
              </p>
              <ul className="text-white/70 space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  Canlı katılım takibi
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  Otomatik süre yönetimi
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-3"></div>
                  Anlık bildirimler
                </li>
              </ul>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:bg-white/15 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Detaylı Raporlama</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Kapsamlı analiz ve raporlama araçları ile veri odaklı kararlar alın
              </p>
              <ul className="text-white/70 space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mr-3"></div>
                  Grafik ve istatistikler
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mr-3"></div>
                  PDF rapor oluşturma
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-teal-400 rounded-full mr-3"></div>
                  Dönemlik analiz
                </li>
              </ul>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:bg-white/15 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaMobile className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Mobil Uyumluluk</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Tüm cihazlarda sorunsuz çalışan responsive tasarım ile her yerden erişim
              </p>
              <ul className="text-white/70 space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  Responsive tasarım
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  Cross-platform uyumluluk
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  Offline çalışma desteği
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 sm:px-8 relative"
        style={{
          background: "linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.1) 100%)"
        }}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-2xl mb-8 transform hover:scale-110 transition-transform duration-300">
            <FaRocket className="text-3xl text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Sistemi Denemek İster misiniz?
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-indigo-300">QR Kodlu Yoklama Sistemi</span> ile 
            eğitimde dijital dönüşümü başlatın. Hemen ücretsiz denemeye başlayın!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/giris"
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl hover:from-indigo-700 hover:to-purple-700 font-bold transition-all duration-300 shadow-2xl hover:shadow-indigo-500/25 transform hover:-translate-y-2 inline-flex items-center justify-center text-lg"
            >
              <FaRocket className="mr-3 group-hover:animate-bounce" />
              Sisteme Giriş Yap
            </Link>
            <Link
              to="/contact"
              className="group border-2 border-white/30 text-white px-10 py-5 rounded-2xl hover:bg-white/10 font-bold transition-all duration-300 backdrop-blur-sm hover:border-white/50 transform hover:-translate-y-1 inline-flex items-center justify-center text-lg"
            >
              İletişime Geç
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
