import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Users as UsersIcon, Search, Plus } from 'lucide-react';
import Modal from '../components/Modal';

interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
    active: boolean;
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        password: '',
        role: 'TECHNICIAN'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            setUsers(response.data.content || response.data || []);
        } catch (error) {
            console.error('Error fetching users', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(item => 
        item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        switch(role) {
            case 'ADMIN': return <span className="badge badge-error">Administrador</span>;
            case 'SUPERVISOR': return <span className="badge badge-warning">Supervisor</span>;
            case 'TECHNICIAN': return <span className="badge badge-success">Técnico</span>;
            default: return <span className="badge badge-info">{role}</span>;
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await api.post('/users', formData);
            setIsModalOpen(false);
            fetchUsers();
            setFormData({ username: '', email: '', fullName: '', password: '', role: 'TECHNICIAN' });
        } catch (error: any) {
            console.error('Error creating user', error);
            alert(error.response?.data?.message || 'Error al crear usuario. Verifica que el correo o usuario no existan.');
        } finally {
            setSubmitting(false);
        }
    };

    // Check if user is admin to show the add button
    let currentUserRole = '';
    try {
        const userObj = JSON.parse(localStorage.getItem('user') || '{}');
        currentUserRole = userObj.role || '';
    } catch(e) {}
    
    const isAdmin = currentUserRole === 'ROLE_ADMIN' || currentUserRole === 'ADMIN';

    return (
        <div className="users-page">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1>Usuarios</h1>
                    <p>Gestiona los usuarios y accesos del sistema.</p>
                </div>
                {isAdmin && (
                    <button className="btn btn-primary flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} /> Nuevo Usuario
                    </button>
                )}
            </div>

            <div className="glass-card mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="input-with-icon" style={{width: '300px'}}>
                        <Search className="input-icon" size={18} />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por usuario o correo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Nombre Completo</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center">Cargando...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan={6} className="text-center">No se encontraron usuarios</td></tr>
                            ) : (
                                filteredUsers.map(item => (
                                    <tr key={item.id}>
                                        <td>#{item.id}</td>
                                        <td className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <UsersIcon size={16} className="text-muted flex-shrink-0" /> 
                                                <span>{item.username}</span>
                                            </div>
                                        </td>
                                        <td>{item.fullName}</td>
                                        <td>{item.email}</td>
                                        <td>{getRoleBadge(item.role)}</td>
                                        <td>
                                            {item.active ? (
                                                <span className="badge badge-success">Activo</span>
                                            ) : (
                                                <span className="badge badge-error">Inactivo</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Nuevo Usuario"
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nombre Completo</label>
                        <input
                            type="text"
                            name="fullName"
                            className="form-control"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="form-label">Nombre de Usuario</label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Correo Electrónico</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Rol</label>
                        <select
                            name="role"
                            className="form-control"
                            value={formData.role}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="TECHNICIAN">Técnico</option>
                            <option value="SUPERVISOR">Supervisor</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Users;
