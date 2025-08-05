import React, { useState } from "react";
import { registerLecturer } from "../api/auth";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    department_id: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerLecturer(formData);
      alert("Kayıt başarılı!");
      navigate("/login");
    } catch (err) {
      alert("Kayıt başarısız: " + err.message);
    }
  };

  return (
    <div>
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Ünvan" onChange={handleChange} required />
        <input name="first_name" placeholder="Ad" onChange={handleChange} required />
        <input name="last_name" placeholder="Soyad" onChange={handleChange} required />
        <input name="department_id" placeholder="Departman ID" onChange={handleChange} required />
        <input name="email" type="email" placeholder="E-posta" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Şifre" onChange={handleChange} required />
        <button type="submit">Kaydol</button>
      </form>
    </div>
  );
};

export default RegisterPage;
