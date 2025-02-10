import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const RoleForm = () => {
    return (
        <div className="admin-layout">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <nav>
                    <ul>
                        <li><Link to="/admin/dashboard">Dashboard</Link></li>
                        <li><Link to="/admin/users">Users</Link></li>
                        <li><Link to="/admin/settings">Settings</Link></li>
                    </ul>
                </nav>
            </header>
            <main className="admin-content">
                <Outlet />
            </main>
            <footer className="admin-footer">
                <p>&copy; 2025 Your Company</p>
            </footer>
        </div>
    );
};

export default RoleForm;