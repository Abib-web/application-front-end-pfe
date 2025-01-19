// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import RealTime from './pages/RealTime';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import AdminUsers from './pages/admin/AdminUsers';
import AdminConfig from './pages/admin/AdminConfig';
import AdminDevices from './pages/admin/AdminDevices';
import ProtectedRoute from './components/ProtectedRoute';
import DeviceDetails from './components/DeviceList/DeviceDetails';
import DeviceList from './components/DeviceList/DeviceList';
import Header from './components/Header/Header';
import { ThemeProvider } from './contexts/ThemeContext'; // Assurez-vous que vous importez le ThemeProvider correctement
import './App.css';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <ThemeProvider>  {/* Le ThemeProvider doit envelopper toute l'application */}
      <Router>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/real-time" element={<RealTime />} />
            <Route path="/devices" element={<DeviceList />} />
            <Route path="/device/:deviceName" element={<DeviceDetails />} />
            <Route path="/dashboard" element={<ProtectedRoute requiredRole="user" />}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route path="/profile" element={<ProtectedRoute requiredRole="user" />}>
              <Route index element={<Profile />} />
            </Route>
            <Route path="/notifications" element={<ProtectedRoute requiredRole="user" />}>
              <Route index element={<Notifications />} />
            </Route>
            <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin" />}>
              <Route index element={<AdminUsers />} />
            </Route>
            <Route path="/admin/config" element={<ProtectedRoute requiredRole="admin" />}>
              <Route index element={<AdminConfig />} />
            </Route>
            <Route path="/admin/devices" element={<ProtectedRoute requiredRole="admin" />}>
              <Route index element={<AdminDevices />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
}

export default App;
