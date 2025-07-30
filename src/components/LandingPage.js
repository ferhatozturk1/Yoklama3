import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaQrcode,
  FaArrowRight,
  FaUsers,
  FaShieldAlt,
  FaClock,
  FaChartLine,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import ScrollAnimations from "./ScrollAnimations";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Hero section elementlerini hemen göster
    const heroElements = document.querySelectorAll(
      "#home .scroll-animate, #home .scroll-animate-stagger, #home .scroll-animate-bounce"
    );
    heroElements.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("animate-in");
        element.classList.remove("animate-out");
      }, index * 200);
    });
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "white" }}>
      <ScrollAnimations />
      
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: "#3b82f6", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 0",
            }}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FaQrcode style={{ color: "white", fontSize: "18px" }} />
              </div>
              <div>
                <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "white", margin: 0 }}>
                  QR Yoklama
                </h1>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                  Sistemi
                </p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "32px" }}
              className="hidden-mobile"
            >
              <button
                onClick={() => scrollToSection("home")}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.8)",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  transition: "all 0.3s",
                }}
              >
                Ana Sayfa
              </button>
              <button
                onClick={() => scrollToSection("about")}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.8)",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  transition: "all 0.3s",
                }}
              >
                Hakkımızda
              </button>
              <button
                onClick={() => scrollToSection("features")}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.8)",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  transition: "all 0.3s",
                }}
              >
                Özellikler
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.8)",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  transition: "all 0.3s",
                }}
              >
                İletişim
              </button>
            </div>

            {/* Auth Buttons */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
              className="hidden-mobile"
            >
              <Link
                to="/giris"
                style={{
                  color: "rgba(255,255,255,0.8)",
                  textDecoration: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  transition: "all 0.3s",
                }}
              >
                Giriş Yap
              </Link>
              <Link
                to="/kayit"
                style={{
                  background: "white",
                  color: "#8b5cf6",
                  padding: "8px 24px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "all 0.3s",
                }}
              >
                Kayıt Ol
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="mobile-only">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div
              className="mobile-only"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(10px)",
                padding: "16px 0",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  onClick={() => scrollToSection("home")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                    padding: "12px 16px",
                    textAlign: "left",
                    borderRadius: "8px",
                    transition: "all 0.3s",
                  }}
                >
                  Ana Sayfa
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                    padding: "12px 16px",
                    textAlign: "left",
                    borderRadius: "8px",
                    transition: "all 0.3s",
                  }}
                >
                  Hakkımızda
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                    padding: "12px 16px",
                    textAlign: "left",
                    borderRadius: "8px",
                    transition: "all 0.3s",
                  }}
                >
                  Özellikler
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.8)",
                    cursor: "pointer",
                    padding: "12px 16px",
                    textAlign: "left",
                    borderRadius: "8px",
                    transition: "all 0.3s",
                  }}
                >
                  İletişim
                </button>

                <div style={{ display: "flex", gap: "12px", padding: "16px 16px 0 16px" }}>
                  <Link
                    to="/giris"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      color: "white",
                      textDecoration: "none",
                      padding: "12px",
                      border: "1px solid rgba(255,255,255,0.3)",
                      borderRadius: "8px",
                      transition: "all 0.3s",
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/kayit"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      background: "white",
                      color: "#8b5cf6",
                      padding: "12px",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontWeight: "600",
                      transition: "all 0.3s",
                    }}
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

      {/* Hero Section */}
      <section
        id="home"
        style={{
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          paddingTop: "80px",
        }}
      >
        {/* Background Elements */}
        <div
          className="floating-bg"
          style={{
            position: "absolute",
            top: "80px",
            left: "40px",
            width: "288px",
            height: "288px",
            background: "#a855f7",
            borderRadius: "50%",
            filter: "blur(64px)",
            opacity: 0.3,
          }}
        ></div>
        <div
          className="floating-bg-delayed"
          style={{
            position: "absolute",
            top: "160px",
            right: "40px",
            width: "288px",
            height: "288px",
            background: "#3b82f6",
            borderRadius: "50%",
            filter: "blur(64px)",
            opacity: 0.3,
          }}
        ></div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", textAlign: "center", position: "relative", zIndex: 10 }}>
          <div style={{ marginBottom: "32px" }}>
            <div
              className="scroll-animate-bounce"
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "16px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "32px",
                backdropFilter: "blur(4px)",
              }}
            >
              <FaQrcode style={{ fontSize: "32px", color: "white" }} />
            </div>
            <h1
              className="scroll-animate-stagger"
              style={{
                fontSize: "3rem",
                fontWeight: "800",
                color: "#1f2937",
                marginBottom: "20px",
                lineHeight: "1.2",
                margin: "0 0 20px 0",
              }}
            >
              QR Kodlu Yoklama
              <span style={{ display: "block", color: "#3b82f6" }}>Sistemi</span>
            </h1>
            <p
              className="scroll-animate-stagger delay-200"
              style={{
                fontSize: "1.125rem",
                color: "#6b7280",
                maxWidth: "700px",
                margin: "0 auto 36px auto",
                lineHeight: "1.6",
              }}
            >
              Eğitim kurumları için{" "}
              <span style={{ fontWeight: "600", color: "#3b82f6" }}>modern ve güvenli</span>{" "}
              yoklama çözümü. QR kod teknolojisi ile öğrenci devam takibini kolaylaştırın.
            </p>
          </div>

          <div
            className="scroll-animate-stagger delay-400"
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "48px",
            }}
          >
            <Link
              to="/kayit"
              className="hover-lift"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                color: "white",
                padding: "14px 32px",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "16px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s",
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)",
              }}
            >
              <FaArrowRight style={{ marginRight: "8px", fontSize: "14px" }} />
              Denemeye Başlayın
            </Link> 
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            <div
              className="scroll-animate-stagger delay-500 hover-lift"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid rgba(59, 130, 246, 0.1)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", fontWeight: "700", color: "#3b82f6", marginBottom: "6px" }}>
                5000+
              </div>
              <div style={{ color: "#6b7280", fontSize: "14px" }}>Aktif Öğretmen</div>
            </div>
            <div
              className="scroll-animate-stagger delay-600 hover-lift"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid rgba(59, 130, 246, 0.1)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", fontWeight: "700", color: "#3b82f6", marginBottom: "6px" }}>
                50K+
              </div>
              <div style={{ color: "#6b7280", fontSize: "14px" }}>Kayıtlı Öğrenci</div>
            </div>
            <div
              className="scroll-animate-stagger delay-700 hover-lift"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid rgba(59, 130, 246, 0.1)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", fontWeight: "700", color: "#3b82f6", marginBottom: "6px" }}>
                99.9%
              </div>
              <div style={{ color: "#6b7280", fontSize: "14px" }}>Güvenilirlik</div>
            </div>
          </div>
        </div>
      </section> 
      {/* About Section */}
      <section id="about" style={{ padding: "60px 0", position: "relative" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div className="scroll-animate" style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2
              className="scroll-animate-fade"
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "20px",
                margin: "0 0 20px 0",
              }}
            >
              Hakkımızda
            </h2>
            <p
              className="scroll-animate delay-200"
              style={{
                fontSize: "1.125rem",
                color: "#6b7280",
                maxWidth: "800px",
                margin: "0 auto 32px auto",
                lineHeight: "1.7",
              }}
            >
              QR Yoklama Sistemi, eğitim kurumlarının dijital dönüşüm sürecinde yanlarında olan, 
              modern ve güvenilir bir teknoloji çözümüdür.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: "48px",
              marginBottom: "60px",
            }}
          >
            <div
              className="scroll-animate-left"
              style={{
                background: "#f8fafc",
                padding: "40px",
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <FaQrcode style={{ fontSize: "28px", color: "white" }} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937", marginBottom: "16px", margin: "0 0 16px 0" }}>
                Misyonumuz
              </h3>
              <p style={{ color: "#6b7280", lineHeight: "1.7", margin: 0, fontSize: "16px" }}>
                Eğitim kurumlarının günlük operasyonlarını kolaylaştırmak, öğretmenlerin zamanını daha verimli kullanmalarını sağlamak ve 
                teknoloji ile eğitim süreçlerini modernize etmek. QR kod teknolojisi ile yoklama alma sürecini hızlandırarak, 
                eğitime daha fazla zaman ayırılmasını hedefliyoruz.
              </p>
            </div>

            <div
              className="scroll-animate-right"
              style={{
                background: "#f8fafc",
                padding: "40px",
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <FaUsers style={{ fontSize: "28px", color: "white" }} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937", marginBottom: "16px", margin: "0 0 16px 0" }}>
                Vizyonumuz
              </h3>
              <p style={{ color: "#6b7280", lineHeight: "1.7", margin: 0, fontSize: "16px" }}>
                Türkiye'nin en güvenilir ve yaygın kullanılan eğitim teknolojisi platformu olmak. 
                Tüm eğitim kademelerinde dijital çözümler sunarak, öğretmenlerin ve öğrencilerin hayatını kolaylaştırmak. 
                Sürekli yenilik ve gelişim ile eğitim sektörüne değer katmaya devam etmek.
              </p>
            </div>
          </div>

          <div
            className="scroll-animate"
            style={{
              background: "#f8fafc",
              padding: "40px",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "linear-gradient(135deg, #ec4899, #a855f7)",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px auto",
              }}
            >
              <FaShieldAlt style={{ fontSize: "28px", color: "white" }} />
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937", marginBottom: "16px", margin: "0 0 16px 0" }}>
              Değerlerimiz
            </h3>
            <p style={{ color: "#6b7280", lineHeight: "1.7", margin: 0, fontSize: "16px", maxWidth: "800px", margin: "0 auto" }}>
              <strong style={{ color: "#1f2937" }}>Güvenlik:</strong> Verilerinizin korunması en önceliğimiz. 
              <strong style={{ color: "#1f2937" }}> • Yenilik:</strong> Sürekli gelişen teknoloji ile çözümler sunuyoruz. 
              <strong style={{ color: "#1f2937" }}> • Kullanıcı Odaklılık:</strong> Kolay ve anlaşılır arayüzler tasarlıyoruz. 
              <strong style={{ color: "#1f2937" }}> • Güvenilirlik:</strong> %99.9 uptime ile kesintisiz hizmet veriyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "60px 0", position: "relative" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div className="scroll-animate" style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2
              className="scroll-animate-fade"
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "20px",
                margin: "0 0 20px 0",
              }}
            >
              Özellikler
            </h2>
            <p
              className="scroll-animate delay-200"
              style={{
                fontSize: "1.125rem",
                color: "#6b7280",
                maxWidth: "700px",
                margin: "0 auto",
                lineHeight: "1.6",
              }}
            >
              Eğitim kurumlarının ihtiyaçlarına özel tasarlanmış QR yoklama sistemimizin güçlü özelliklerini keşfedin.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "32px",
            }}
          >
            <div
              className="scroll-animate-left hover-lift"
              style={{
                background: "#f8fafc",
                padding: "32px",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <FaQrcode style={{ fontSize: "24px", color: "white" }} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937", marginBottom: "16px", margin: "0 0 16px 0" }}>
                QR Kod Teknolojisi
              </h3>
              <p style={{ color: "#6b7280", lineHeight: "1.6", margin: 0 }}>
                Dinamik QR kod teknolojisi ile güvenli yoklama alın. Öğrenciler akıllı telefonları ile saniyeler içinde yoklama verebilir. Sahte yoklama girişlerini önleyen gelişmiş güvenlik sistemi.
              </p>
            </div>

            <div
              className="scroll-animate hover-lift"
              style={{
                background: "#f8fafc",
                padding: "32px",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "linear-gradient(135deg, #ec4899, #a855f7)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <FaShieldAlt style={{ fontSize: "24px", color: "white" }} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937", marginBottom: "16px", margin: "0 0 16px 0" }}>
                Güvenli Sistem
              </h3>
              <p style={{ color: "#6b7280", lineHeight: "1.6", margin: 0 }}>
                SSL şifreleme ve çok katmanlı güvenlik sistemi ile verileriniz korunur. KVKK ve ISO 27001 standartlarına uygun veri işleme. Yetkisiz erişimlere karşı 7/24 izleme.
              </p>
            </div>

            <div
              className="scroll-animate-right hover-lift"
              style={{
                background: "#f8fafc",
                padding: "32px",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <FaClock style={{ fontSize: "24px", color: "white" }} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937", marginBottom: "16px", margin: "0 0 16px 0" }}>
                Hızlı İşlem
              </h3>
              <p style={{ color: "#6b7280", lineHeight: "1.6", margin: 0 }}>
                Geleneksel yoklama yöntemlerine göre %95 daha hızlı işlem. Anlık sonuç görüntüleme ve otomatik devam takibi. Büyük sınıflarda bile 30 saniyede tamamlanan yoklama süreci.
              </p>
            </div>

            <div
              className="scroll-animate-left hover-lift"
              style={{
                background: "#f8fafc",
                padding: "32px",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <FaChartLine style={{ fontSize: "24px", color: "white" }} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937", marginBottom: "16px", margin: "0 0 16px 0" }}>
                Detaylı Raporlama
              </h3>
              <p style={{ color: "#6b7280", lineHeight: "1.6", margin: 0 }}>
                Detaylı devam istatistikleri ve trend analizleri. Excel, PDF formatında raporlar. Grafik ve çizelgelerle görsel analiz. Dönemlik ve yıllık karşılaştırma raporları.
              </p>
            </div>

            <div
              className="scroll-animate hover-lift"
              style={{
                background: "#f8fafc",
                padding: "32px",
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <FaUsers style={{ fontSize: "24px", color: "white" }} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937", marginBottom: "16px", margin: "0 0 16px 0" }}>
                Kolay Kullanım
              </h3>
              <p style={{ color: "#6b7280", lineHeight: "1.6", margin: 0 }}>
                Kullanıcı dostu arayüz ile herkes kolayca kullanabilir. Teknik bilgi gerektirmez. Türkçe dil desteği ve sesli yönlendirme. 5 dakikada öğrenebilir, hemen kullanmaya başlayabilirsiniz.
              </p>
            </div>

            <div
              className="scroll-animate-right hover-lift"
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "32px",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                }}
              >
                <FaPhone style={{ fontSize: "24px", color: "white" }} />
              </div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "white", marginBottom: "16px", margin: "0 0 16px 0" }}>
                Mobil Uyumlu
              </h3>
              <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: "1.6", margin: 0 }}>
                Tüm akıllı telefon, tablet ve bilgisayarlarda sorunsuz çalışır. Android, iOS ve web tarayıcı desteği. Offline çalışma özelliği ile internet bağlantısı olmadan da kullanım.
              </p>
            </div>
          </div>
        </div>
      </section> 
     {/* Contact Section */}
      <section id="contact" style={{ padding: "60px 0", position: "relative", background: "#f8fafc" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div className="scroll-animate" style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2
              className="scroll-animate-fade"
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "20px",
                margin: "0 0 20px 0",
              }}
            >
              İletişim
            </h2>
            <p
              className="scroll-animate delay-200"
              style={{
                fontSize: "1.125rem",
                color: "#6b7280",
                maxWidth: "700px",
                margin: "0 auto",
                lineHeight: "1.6",
              }}
            >
              QR Yoklama Sistemi hakkında merak ettiklerinizi öğrenin. Teknik destek ve satış danışmanlığı için 7/24 hizmetinizdeyiz.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "32px",
            }}
          >
            <div
              className="scroll-animate-left"
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "32px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
            >
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#1f2937", marginBottom: "24px", margin: "0 0 24px 0" }}>
                İletişim Bilgileri
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaEnvelope style={{ fontSize: "18px", color: "white" }} />
                  </div>
                  <div>
                    <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 4px 0" }}>
                      E-posta
                    </p>
                    <p style={{ color: "#1f2937", fontSize: "16px", margin: 0 }}>
                    info@motivexintelligence.com
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaPhone style={{ fontSize: "18px", color: "white" }} />
                  </div>
                  <div>
                    <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 4px 0" }}>
                      Telefon
                    </p>
                    <p style={{ color: "#1f2937", fontSize: "16px", margin: 0 }}>
                    +90 546 515 27 45
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "linear-gradient(135deg, #ec4899, #a855f7)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FaMapMarkerAlt style={{ fontSize: "18px", color: "white" }} />
                  </div>
                  <div>
                    <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 4px 0" }}>
                      Adres
                    </p>
                    <p style={{ color: "#1f2937", fontSize: "16px", margin: 0 }}>
                    Manisa Celal Bayar Üniversitesi
Teknoloji Geliştirme Bölgesi Z-15
Yunusemre/MANİSA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="scroll-animate-right"
              style={{
                background: "white",
                borderRadius: "16px",
                padding: "32px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
            >
              <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#1f2937", marginBottom: "24px", margin: "0 0 24px 0" }}>
                Mesaj Gönderin
              </h3>
              
              <form style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <input
                    type="text"
                    placeholder="Adınız Soyadınız"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      color: "#1f2937",
                      fontSize: "16px",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="E-posta Adresiniz"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      color: "#1f2937",
                      fontSize: "16px",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Mesajınız"
                    rows="4"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      color: "#1f2937",
                      fontSize: "16px",
                      outline: "none",
                      resize: "vertical",
                    }}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="hover-lift"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  }}
                >
                  Mesaj Gönder
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#1f2937", padding: "40px 0", borderTop: "1px solid #374151" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "32px",
              marginBottom: "32px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FaQrcode style={{ color: "white", fontSize: "14px" }} />
                </div>
                <h3 style={{ color: "white", fontSize: "18px", fontWeight: "bold", margin: 0 }}>
                  QR Yoklama Sistemi
                </h3>
              </div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Türkiye'nin en güvenilir QR kod tabanlı yoklama sistemi. 500+ eğitim kurumunun tercihi.
              </p>
            </div>

            <div>
              <h4 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "16px", margin: "0 0 16px 0" }}>
                Hızlı Linkler
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <button
                  onClick={() => scrollToSection("home")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.7)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "14px",
                    padding: "4px 0",
                    transition: "all 0.3s",
                  }}
                >
                  Ana Sayfa
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.7)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "14px",
                    padding: "4px 0",
                    transition: "all 0.3s",
                  }}
                >
                  Hakkımızda
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.7)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "14px",
                    padding: "4px 0",
                    transition: "all 0.3s",
                  }}
                >
                  Özellikler
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.7)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: "14px",
                    padding: "4px 0",
                    transition: "all 0.3s",
                  }}
                >
                  İletişim
                </button>
              </div>
            </div>

            <div>
              <h4 style={{ color: "white", fontSize: "16px", fontWeight: "600", marginBottom: "16px", margin: "0 0 16px 0" }}>
                Sistem
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <Link
                  to="/giris"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontSize: "14px",
                    padding: "4px 0",
                    transition: "all 0.3s",
                  }}
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/kayit"
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    textDecoration: "none",
                    fontSize: "14px",
                    padding: "4px 0",
                    transition: "all 0.3s",
                  }}
                >
                  Kayıt Ol
                </Link>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "24px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", margin: 0 }}>
              © 2025 QR Yoklama Sistemi. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;