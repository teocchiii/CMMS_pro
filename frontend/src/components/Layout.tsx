import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Wrench, Package, Calendar, LogOut, Settings } from 'lucide-react';
import './Layout.css';

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-container">
            <aside className="sidebar glass-card">
                <div className="sidebar-header">
                    <h2>CMMS Pro</h2>
                    <p className="user-role">{user?.role}</p>
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                        <LayoutDashboard size={20} /> Dashboard
                    </NavLink>
                    <NavLink to="/work-orders" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                        <Wrench size={20} /> Órdenes
                    </NavLink>
                    <NavLink to="/equipment" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                        <Package size={20} /> Equipos
                    </NavLink>
                    <NavLink to="/spare-parts" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                        <Settings size={20} /> Repuestos
                    </NavLink>
                    <NavLink to="/maintenance-plans" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                        <Calendar size={20} /> Planes
                    </NavLink>
                    {user?.role === 'ROLE_ADMIN' && (
                        <NavLink to="/users" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                            <Users size={20} /> Usuarios
                        </NavLink>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="avatar">{user?.username.charAt(0).toUpperCase()}</div>
                        <span className="username">{user?.username}</span>
                    </div>
                    <button onClick={handleLogout} className="logout-btn" title="Cerrar sesión">
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
