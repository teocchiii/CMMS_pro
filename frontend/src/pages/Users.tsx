import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Users as UsersIcon, Search } from 'lucide-react';

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

    return (
        <div className="users-page">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1>Usuarios</h1>
                    <p>Gestiona los usuarios y accesos del sistema.</p>
                </div>
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
                                        <td className="font-medium flex items-center gap-2">
                                            <UsersIcon size={16} className="text-muted" /> {item.username}
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
        </div>
    );
};

export default Users;
