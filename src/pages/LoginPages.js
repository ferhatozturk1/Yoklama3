import React, { useState } from "react";
import { loginLecturer } from "../api/auth"; // API fonksiyonunu çağırıyoruz
import { useNavigate } from "react-router-dom"; // Giriş sonrası yönlendirme için
import { useAuth } from "../contexts/AuthContext"; // AuthContext'i import et

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // AuthContext'ten login fonksiyonunu al

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('🔐 === LOGIN İŞLEMİ BAŞLIYOR ===');
      console.log('📧 Email:', email);
      console.log('🔑 Password mevcut:', !!password);
      
      // API'ye username olarak email gönder (backend username bekliyor)
      const loginData = {
        username: email, // Backend username alanında email bekliyor
        password: password
      };
      
      console.log('📤 API\'ye gönderilen data:', { username: loginData.username, password: '***' });
      
      // Backend API'ye login çağrısı yap
      const apiResponse = await loginLecturer(loginData);
      console.log('✅ Backend API yanıtı:', apiResponse);
      
      // AuthContext'e login bilgilerini bildir
      await login(apiResponse);
      
      console.log('🎉 Login başarılı! Yönlendiriliyor...');
      alert("Giriş başarılı!");
      navigate("/"); // Giriş sonrası anasayfaya yönlendir
    } catch (err) {
      console.error('❌ Login hatası:', err);
      alert("Giriş başarısız: " + err.message);
    }
  };

  return (
    <div>
      <h2>Giriş Yap</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Giriş Yap</button>
      </form>
    </div>
  );
};

export default LoginPage;
