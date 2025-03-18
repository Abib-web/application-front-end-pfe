import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
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
        </div>
    );
};

export default AdminLayout;