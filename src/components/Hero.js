import React from "react";
import { Link } from "react-router-dom";
import { FaQrcode, FaUsers, FaShieldAlt, FaArrowRight } from "react-icons/fa";

function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div
          className="absolute top-40 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="container mx-auto text-center relative z-10 animate-fadeInUp">
        {/* Main Heading */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-8 backdrop-blur-sm">
            <FaQrcode className="text-4xl text-white" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            QR Kodlu Yoklama
            <span className="block text-yellow-300">Sistemi</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed">
            Eğitim kurumları için{" "}
            <span className="font-semibold text-yellow-300">
              modern ve güvenli
            </span>{" "}
            yoklama çözümü. QR kod teknolojisi ile öğrenci devam takibini
            kolaylaştırın.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Link
            to="/kayit"
            className="group bg-white text-purple-600 px-10 py-5 rounded-2xl hover:bg-gray-100 font-bold transition-all duration-300 shadow-2xl hover:shadow-white/25 transform hover:-translate-y-2 inline-flex items-center justify-center text-lg"
          >
            <FaArrowRight className="mr-3 group-hover:translate-x-1 transition-transform" />
            Ücretsiz Başlayın
          </Link>
          <button
            onClick={() =>
              document
                .getElementById("demo")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="group border-2 border-white/30 text-white px-10 py-5 rounded-2xl hover:bg-white/10 font-bold transition-all duration-300 backdrop-blur-sm hover:border-white/50 transform hover:-translate-y-1 inline-flex items-center justify-center text-lg"
          >
            Demo İzleyin
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-4xl font-bold text-yellow-300 mb-2">5000+</div>
            <div className="text-white/80">Aktif Öğretmen</div>
          </div>
          <div className="glass rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-4xl font-bold text-yellow-300 mb-2">50K+</div>
            <div className="text-white/80">Kayıtlı Öğrenci</div>
          </div>
          <div className="glass rounded-2xl p-6 backdrop-blur-sm">
            <div className="text-4xl font-bold text-yellow-300 mb-2">99.9%</div>
            <div className="text-white/80">Güvenilirlik</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
