import React from "react";
import { Link } from 'react-router-dom';
import {
  FaCode,
  FaPalette,
  FaChartLine,
  FaServer,
  FaBug,
  FaDatabase,
  FaUsers,
  FaHeart,
  FaRocket,
  FaGraduationCap,
} from "react-icons/fa";

function About() {
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
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-2xl mb-8 glow-box neon-pulse">
            <FaUsers className="text-4xl text-white" />
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black neon-text mb-8 leading-tight">
            About Our Team
          </h1>
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
            <p className="mx-6 text-2xl md:text-3xl font-semibold text-gray-300">
              Innovation Meets Excellence
            </p>
            <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
          </div>
          <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-16 leading-relaxed">
            Meet the talented team behind the <span className="neon-text-purple font-semibold">QR Attendance System.</span> 
            We came together to make a difference in educational technology and 
            <span className="neon-text-blue font-semibold"> revolutionize the way institutions manage attendance.</span>
          </p>
        </div>
      </section>

      {/* Ekip */}
      <section className="py-20 px-6 sm:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Ekibimiz</h2>
            <p className="text-white/80 text-lg">Eğitim teknolojilerinde uzman ekibimiz</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:bg-white/15 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaCode className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Ahmet Tağ
              </h3>
              <p className="text-purple-300 text-sm font-semibold mb-3">Frontend Developer</p>
              <p className="text-white/70 text-sm leading-relaxed">
                React ve modern web teknolojileri uzmanı. Kullanıcı dostu arayüzler tasarlıyor.
              </p>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:bg-white/15 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaPalette className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Ferhat Öztürk
              </h3>
              <p className="text-purple-300 text-sm font-semibold mb-3">UI/UX Tasarımcısı</p>
              <p className="text-white/70 text-sm leading-relaxed">
                Kullanıcı deneyimi ve arayüz tasarımı uzmanı. Sezgisel tasarımlar yaratıyor.
              </p>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:bg-white/15 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Mehmet Özkan
              </h3>
              <p className="text-purple-300 text-sm font-semibold mb-3">Proje Yöneticisi</p>
              <p className="text-white/70 text-sm leading-relaxed">
                Proje yönetimi ve ekip koordinasyonu uzmanı. Süreçleri optimize ediyor.
              </p>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:bg-white/15 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaServer className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Can Demir
              </h3>
              <p className="text-purple-300 text-sm font-semibold mb-3">Backend Developer</p>
              <p className="text-white/70 text-sm leading-relaxed">
                Sunucu tarafı geliştirme uzmanı. Güvenli ve ölçeklenebilir sistemler kuruyor.
              </p>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:bg-white/15 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaBug className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Ayşe Şahin
              </h3>
              <p className="text-purple-300 text-sm font-semibold mb-3">Test Uzmanı</p>
              <p className="text-white/70 text-sm leading-relaxed">
                Yazılım kalitesi ve test süreçleri uzmanı. Hatasız deneyimler sağlıyor.
              </p>
            </div>

            <div className="group bg-white/10 backdrop-blur-sm p-8 rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 hover:bg-white/15 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FaDatabase className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Emre Yıldız
              </h3>
              <p className="text-purple-300 text-sm font-semibold mb-3">Veritabanı Yöneticisi</p>
              <p className="text-white/70 text-sm leading-relaxed">
                Veritabanı yönetimi ve optimizasyon uzmanı. Veri güvenliğini sağlıyor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Misyon & Vizyon */}
      <section className="py-20 px-6 sm:px-8 relative"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)"
        }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <FaRocket className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Misyonumuz</h3>
              <p className="text-white/80 leading-relaxed">
                Eğitim kurumlarının dijital dönüşüm sürecinde yanlarında olmak ve 
                modern teknolojilerle öğretim süreçlerini kolaylaştırmak. 
                QR kod teknolojisi ile yoklama sistemlerini yeniden tanımlıyoruz.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <FaGraduationCap className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Vizyonumuz</h3>
              <p className="text-white/80 leading-relaxed">
                Türkiye'nin önde gelen eğitim teknolojisi şirketi olmak ve 
                geliştirdiğimiz çözümlerle eğitim sektöründe standartları belirlemek. 
                Her öğretmenin teknolojiden kolayca faydalanabileceği bir gelecek yaratmak.
              </p>
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl shadow-2xl mb-8 transform hover:scale-110 transition-transform duration-300">
            <FaHeart className="text-3xl text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Bizimle Çalışmak İster misiniz?
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-purple-300">Yetenekli ekibimize katılın</span> ve 
            eğitim teknolojilerinde fark yaratın. Birlikte daha iyi bir gelecek inşa edelim.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/contact"
              className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-5 rounded-2xl hover:from-purple-700 hover:to-indigo-700 font-bold transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 inline-flex items-center justify-center text-lg"
            >
              İletişime Geçin
            </Link>
            <Link
              to="/services"
              className="group border-2 border-white/30 text-white px-10 py-5 rounded-2xl hover:bg-white/10 font-bold transition-all duration-300 backdrop-blur-sm hover:border-white/50 transform hover:-translate-y-1 inline-flex items-center justify-center text-lg"
            >
              Hizmetlerimizi Keşfedin
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
