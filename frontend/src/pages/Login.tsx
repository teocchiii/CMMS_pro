import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { Lock, User as UserIcon } from 'lucide-react';
import './Login.css';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await api.post('/auth/login', { username, password });
            const { token, id, username: userStr, email, roles } = response.data;
            
            login(token, { id, username: userStr, email, role: roles[0] });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error de autenticación. Verifica tus credenciales.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass-card">
                <div className="login-header">
                    <h1>CMMS Pro</h1>
                    <p>Bienvenido de vuelta. Inicia sesión para continuar.</p>
                </div>
                
                {error && <div className="login-error">{error}</div>}
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Usuario</label>
                        <div className="input-with-icon">
                            <UserIcon className="input-icon" size={18} />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ingresa tu usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <div className="input-with-icon">
                            <Lock className="input-icon" size={18} />
                            <input
                                type="password"
                                className="form-control"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary w-full mt-4" disabled={isLoading}>
                        {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-gray-400">
                    ¿No tienes una cuenta? <Link to="/register" className="text-primary hover:underline">Regístrate aquí</Link>
                </div>

                <div className="login-footer">
                    <p>Contacta al administrador si olvidaste tu contraseña.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
