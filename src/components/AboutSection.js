import React from 'react';
import { FaCode, FaPalette, FaChartLine, FaServer, FaBug, FaDatabase, FaRocket, FaGraduationCap, FaHeart } from 'react-icons/fa';

function AboutSection() {
  const team = [
    {
      name: "Ahmet Tağ",
      role: "Frontend Developer",
      description: "React ve modern web teknolojileri uzmanı",
      icon: FaCode,
      color: "from-blue-500 to-indigo-600"
    },
    {
      name: "Ferhat Öztürk",
      role: "UI/UX Tasarımcısı",
      description: "Kullanıcı deneyimi ve arayüz tasarımı uzmanı",
      icon: FaPalette,
      color: "from-pink-500 to-purple-600"
    },
    {
      name: "Mehmet Özkan",
      role: "Proje Yöneticisi",
      description: "Proje yönetimi ve ekip koordinasyonu uzmanı",
      icon: FaChartLine,
      color: "from-green-500 to-emerald-600"
    },
    {
      name: "Can Demir",
      role: "Backend Developer",
      description: "Sunucu tarafı geliştirme uzmanı",
      icon: FaServer,
      color: "from-orange-500 to-red-600"
    },
    {
      name: "Ayşe Şahin",
      role: "Test Uzmanı",
      description: "Yazılım kalitesi ve test süreçleri uzmanı",
      icon: FaBug,
      color: "from-yellow-500 to-orange-600"
    },
    {
      name: "Emre Yıldız",
      role: "Veritabanı Yöneticisi",
      description: "Veritabanı yönetimi ve optimizasyon uzmanı",
      icon: FaDatabase,
      color: "from-teal-500 to-cyan-600"
    }
  ];

  return (
    <section id="about" className="section relative">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Hakkımızda
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
            QR Kodlu Yoklama Sistemi'ni geliştiren yetenekli ekibimizle tanışın. 
            Eğitim teknolojilerinde fark yaratmak için bir araya geldik.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {team.map((member, index) => (
            <div 
              key={index}
              className="group glass p-8 rounded-2xl text-center hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${member.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <member.icon className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
              <p className="text-purple-300 text-sm font-semibold mb-3">{member.role}</p>
              <p className="text-white/70 text-sm leading-relaxed">{member.description}</p>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="glass rounded-2xl p-8 animate-fadeInUp">
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
          
          <div className="glass rounded-2xl p-8 animate-fadeInUp">
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

        {/* Company Values */}
        <div className="text-center animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mb-8">
            <FaHeart className="text-3xl text-white" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-6">Değerlerimiz</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="glass rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-3">İnovasyon</h4>
              <p className="text-white/70">Sürekli yenilik ve gelişim odaklı yaklaşım</p>
            </div>
            <div className="glass rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-3">Kalite</h4>
              <p className="text-white/70">En yüksek standartlarda ürün ve hizmet</p>
            </div>
            <div className="glass rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-3">Güven</h4>
              <p className="text-white/70">Şeffaf ve güvenilir iş ortaklığı</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;