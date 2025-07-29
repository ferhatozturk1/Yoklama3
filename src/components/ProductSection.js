import React from 'react';
import { FaQrcode, FaUsers, FaShieldAlt, FaClock, FaChartLine, FaMobile, FaCheck } from 'react-icons/fa';

function ProductSection() {
  const features = [
    {
      icon: FaQrcode,
      title: "QR Kod Teknolojisi",
      description: "Her 5 saniyede yenilenen güvenli QR kodları ile hızlı ve güvenilir yoklama sistemi",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: FaUsers,
      title: "Kolay Yönetim",
      description: "Excel dosyalarından toplu öğrenci ekleme ve kapsamlı veri yönetimi sistemi",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: FaShieldAlt,
      title: "Güvenli Sistem",
      description: "GDPR uyumlu güvenlik standartları ile maksimum veri korunması sağlar",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const benefits = [
    "Gerçek zamanlı yoklama takibi",
    "Otomatik rapor oluşturma",
    "Mobil uyumlu tasarım",
    "Kolay entegrasyon",
    "7/24 teknik destek",
    "Ücretsiz güncellemeler"
  ];

  return (
    <section id="product" className="section relative">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ürün Tanıtımı
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Modern eğitim kurumları için tasarlanmış, güvenli ve kullanıcı dostu özellikler
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group glass p-8 rounded-2xl hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 text-center">{feature.title}</h3>
              <p className="text-white/80 text-center leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Product Benefits */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fadeInUp">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Neden QR Yoklama Sistemi?
            </h3>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Geleneksel yoklama yöntemlerini geride bırakın. Modern QR kod teknolojisi ile 
              öğrenci devam takibini hızlandırın ve verimliliği artırın.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center group">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <FaCheck className="text-white text-sm" />
                  </div>
                  <span className="text-white text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-3xl p-8 animate-fadeInUp">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaClock className="text-white text-xl" />
                </div>
                <h4 className="font-bold text-white text-lg mb-2">Gerçek Zamanlı</h4>
                <p className="text-white/70">Anlık takip ve bildirimler</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaChartLine className="text-white text-xl" />
                </div>
                <h4 className="font-bold text-white text-lg mb-2">Raporlama</h4>
                <p className="text-white/70">Detaylı analiz ve grafikler</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaShieldAlt className="text-white text-xl" />
                </div>
                <h4 className="font-bold text-white text-lg mb-2">Güvenlik</h4>
                <p className="text-white/70">GDPR uyumlu koruma</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <FaMobile className="text-white text-xl" />
                </div>
                <h4 className="font-bold text-white text-lg mb-2">Mobil Uyumlu</h4>
                <p className="text-white/70">Her cihazda çalışır</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductSection;