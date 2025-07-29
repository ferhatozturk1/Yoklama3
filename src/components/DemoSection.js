import React, { useState } from 'react';
import { FaPaperPlane, FaUser, FaEnvelope, FaBuilding, FaPhone, FaCheckCircle } from 'react-icons/fa';

function DemoSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        institution: '',
        phone: '',
        message: ''
      });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <section id="demo" className="section relative">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center animate-fadeInUp">
            <div className="glass rounded-3xl p-12">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <FaCheckCircle className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Teşekkürler!</h2>
              <p className="text-xl text-white/80 mb-6">
                Demo talebiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="demo" className="section relative">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Demo Talep Edin
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            QR Kodlu Yoklama Sistemi'ni yakından görmek ve sorularınızı sormak için 
            demo talebinde bulunun. Uzman ekibimiz size özel bir sunum hazırlayacak.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Demo Benefits */}
            <div className="animate-fadeInUp">
              <h3 className="text-2xl font-bold text-white mb-8">Demo'da Neler Göreceğiniz?</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Sistem Tanıtımı</h4>
                    <p className="text-white/70">QR Kodlu Yoklama Sistemi'nin tüm özelliklerini canlı olarak göreceksiniz.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Canlı Kullanım</h4>
                    <p className="text-white/70">Sistemi gerçek senaryolarla test edebilir, sorularınızı sorabilirsiniz.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Özelleştirilmiş Çözüm</h4>
                    <p className="text-white/70">Kurumunuzun ihtiyaçlarına özel çözüm önerilerimizi alacaksınız.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Fiyatlandırma</h4>
                    <p className="text-white/70">Size özel fiyatlandırma seçeneklerini değerlendireceğiz.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Form */}
            <div className="glass rounded-3xl p-8 animate-fadeInUp">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="form-group">
                  <label className="form-label text-white flex items-center">
                    <FaUser className="mr-2" />
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Adınız ve soyadınız"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label text-white flex items-center">
                    <FaEnvelope className="mr-2" />
                    E-posta *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label text-white flex items-center">
                    <FaBuilding className="mr-2" />
                    Kurum Adı *
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Çalıştığınız kurum"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label text-white flex items-center">
                    <FaPhone className="mr-2" />
                    Telefon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="0555 123 45 67"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label text-white">
                    Mesajınız
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Demo hakkında özel talepleriniz veya sorularınız..."
                    rows="4"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-2" />
                      Demo Talep Et
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DemoSection;