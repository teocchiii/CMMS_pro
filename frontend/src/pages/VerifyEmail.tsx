import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const VerifyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('No se proporcionó un token de verificación.');
            return;
        }

        const verifyToken = async () => {
            try {
                const response = await api.get(`/auth/verify?token=${token}`);
                setStatus('success');
                setMessage(response.data.message || 'Cuenta verificada correctamente.');
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.error || 'El enlace es inválido o ha expirado.');
            }
        };

        verifyToken();
    }, [token]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="glass-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', padding: '2rem' }}>
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader size={48} className="text-primary animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                        <h2 style={{ margin: 0 }}>Verificando...</h2>
                        <p className="text-muted">Estamos verificando tu cuenta, por favor espera.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle size={64} className="text-success" style={{ color: '#10B981' }} />
                        <h2 style={{ margin: 0, color: '#10B981' }}>¡Verificado!</h2>
                        <p className="text-muted">{message}</p>
                        <button className="btn btn-primary w-full mt-4" onClick={() => navigate('/login')}>
                            Ir al Inicio de Sesión
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4">
                        <XCircle size={64} className="text-error" style={{ color: '#EF4444' }} />
                        <h2 style={{ margin: 0, color: '#EF4444' }}>Error de Verificación</h2>
                        <p className="text-muted">{message}</p>
                        <button className="btn btn-secondary w-full mt-4" onClick={() => navigate('/login')}>
                            Volver al Inicio
                        </button>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default VerifyEmail;
