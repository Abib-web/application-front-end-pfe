import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import "./styles/LoginPage.css";
import { use } from "react";
import Spinner from "../components/Spinner/Spinner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, status } = useSelector((state) => state.auth);
  let user = {};
  const handleLogin = (e) => {
    
    e.preventDefault();
    dispatch(loginUser({ email, password })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
         user = res.payload.user;
      }
    });
  };

  useEffect(() => {
    
    if (status === "succeeded") {
      navigate("/");
    }else{
      setInterval(() => {
        <Spinner />
      }, 2000);
    }
  }, [status, navigate]);
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Connexion</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="email">Nom d'utilisateur</label>
          <input
            id="email"
            type="text"
            placeholder="Entrez votre nom"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            placeholder="Entrez votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;