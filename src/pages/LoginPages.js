import React, { useState } from "react";
import { loginLecturer } from "../api/auth"; // API fonksiyonunu çağırıyoruz
import { useNavigate } from "react-router-dom"; // Giriş sonrası yönlendirme için

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginLecturer(email, password);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      alert("Giriş başarılı!");
      navigate("/"); // Giriş sonrası anasayfaya yönlendir
    } catch (err) {
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
