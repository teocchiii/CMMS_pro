import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock } from 'lucide-react';
import './Login.css'; // Reutilizamos los estilos del login

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/auth/register', {
                username,
                email,
                fullName,
                password,
                role: 'TECHNICIAN'
            });
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al registrar usuario. Verifica tus datos.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass-card">
                <div className="login-header">
                    <h1>CMMS Pro</h1>
                    <p>Crea una cuenta para empezar.</p>
                </div>

                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleRegister} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Nombre Completo</label>
                        <div className="input-with-icon">
                            <User className="input-icon" size={18} />
                            <input 
                                type="text" 
                                className="form-control"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required 
                                placeholder="Ej. Juan Pérez"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Nombre de Usuario</label>
                        <div className="input-with-icon">
                            <User className="input-icon" size={18} />
                            <input 
                                type="text" 
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required 
                                placeholder="jperez"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Correo Electrónico</label>
                        <div className="input-with-icon">
                            <Mail className="input-icon" size={18} />
                            <input 
                                type="email" 
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                                placeholder="jperez@empresa.com"
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-4">
                        Registrarse
                    </button>
                </form>
                
                <div className="mt-6 text-center text-sm text-gray-400">
                    ¿Ya tienes una cuenta? <Link to="/login" className="text-primary hover:underline">Inicia Sesión aquí</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
