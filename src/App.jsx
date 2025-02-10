import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { initializeAuth } from "./redux/authSlice";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';
import DeviceDetails from './components/RealTime/DeviceDetails';
import StationsDashboard from './components/RealTime/RealTimeDashboard';
import DeviceList from './components/DeviceList/DeviceList';
import Header from './components/Header/Header';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';
import LoginPage from './pages/LoginPage';
import NavBar from './components/NavBar/NavBar';
import ForecastDetails from './components/tendances/ForecastDetails';
import StationsHistory from './components/history/StationsHistory';
import AlertsLogs from './components/AlertLogs/AlertsLogs';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth()); // Charge l'authentification au démarrage
  }, [dispatch]);

  return (
    <ThemeProvider>
      <Router>
        <Header />
        <div className="app-container">
          <NavBar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/connexion" element={<LoginPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/devices" element={<DeviceList />} />
              <Route path="/real-time" element={<StationsDashboard />} />
              <Route path="/real-time/:id" element={<DeviceDetails />} />
              <Route path="/tendances/:id" element={<ForecastDetails />} />
              <Route path="/tendances" element={<ForecastDetails />} />
              <Route path="/history" element={<StationsHistory />} />
              <Route path="/alertes" element={<AlertsLogs />} />

              {/* Routes protégées pour l'administration */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;