import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import Modal from '../components/Modal';

interface WorkOrder {
    id: number;
    orderNumber: string;
    equipment: { id: number; name: string };
    assignedTo: { id: number; username: string } | null;
    type: string;
    priority: string;
    status: string;
    description: string;
    scheduledDate: string;
    equipmentId?: number;
    assignedToId?: number;
}

const initialForm = {
    orderNumber: '', equipmentId: '', assignedToId: '', type: 'PREVENTIVO', priority: 'MEDIA', status: 'PENDIENTE', description: '', diagnosis: '', solution: ''
};

const WorkOrders: React.FC = () => {
    const [orders, setOrders] = useState<WorkOrder[]>([]);
    const [equipments, setEquipments] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<WorkOrder | null>(null);
    const [formData, setFormData] = useState<any>(initialForm);

    useEffect(() => {
        fetchOrders();
        fetchDependencies();
    }, []);

    const fetchDependencies = async () => {
        try {
            const [eqRes, usersRes] = await Promise.all([
                api.get('/equipment'),
                api.get('/users') // Asumiendo que existe un endpoint de users para asignación
            ]);
            setEquipments(eqRes.data.content || eqRes.data || []);
            setUsers(usersRes.data.content || usersRes.data || []);
        } catch(e) {
            console.error('Error fetching dependencies', e);
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/work-orders');
            setOrders(response.data.content || response.data);
        } catch (error) {
            console.error('Error fetching work orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item?: WorkOrder) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                orderNumber: item.orderNumber || '',
                equipmentId: item.equipment?.id || item.equipmentId || '',
                assignedToId: item.assignedTo?.id || item.assignedToId || '',
                type: item.type || 'PREVENTIVO',
                priority: item.priority || 'MEDIA',
                status: item.status || 'PENDIENTE',
                description: item.description || ''
            });
        } else {
            setEditingItem(null);
            setFormData({...initialForm, orderNumber: `WO-${Date.now()}`}); // Autogenerate order number for new ones
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData(initialForm);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                equipment: { id: formData.equipmentId },
                assignedTo: formData.assignedToId ? { id: formData.assignedToId } : null
            };
            if (editingItem) {
                await api.put(`/work-orders/${editingItem.id}`, payload);
            } else {
                await api.post('/work-orders', payload);
            }
            handleCloseModal();
            fetchOrders();
        } catch (error) {
            console.error('Error saving order', error);
            alert('Error al guardar la orden de trabajo.');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar esta orden?')) {
            try {
                await api.delete(`/work-orders/${id}`);
                fetchOrders();
            } catch (error) {
                console.error('Error deleting order', error);
                alert('No se pudo eliminar la orden.');
            }
        }
    };

    const filteredOrders = orders.filter(item => 
        item.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'COMPLETADA': return <span className="badge badge-success">Completada</span>;
            case 'EN_PROGRESO': return <span className="badge badge-warning">En Progreso</span>;
            case 'CANCELADA': return <span className="badge badge-error">Cancelada</span>;
            case 'PENDIENTE': return <span className="badge badge-info">Pendiente</span>;
            default: return <span className="badge badge-info">{status}</span>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch(priority) {
            case 'CRITICA': return <span className="badge badge-error">Crítica</span>;
            case 'ALTA': return <span style={{color: '#EF4444', fontWeight: 600}}>Alta</span>;
            case 'MEDIA': return <span style={{color: '#F59E0B', fontWeight: 600}}>Media</span>;
            case 'BAJA': return <span style={{color: '#10B981', fontWeight: 600}}>Baja</span>;
            default: return <span>{priority}</span>;
        }
    };

    return (
        <div className="work-orders-page">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1>Órdenes de Trabajo</h1>
                    <p>Gestiona y asigna las tareas de mantenimiento.</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={18} /> Nueva Orden
                </button>
            </div>

            <div className="glass-card mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="input-with-icon" style={{width: '300px'}}>
                        <Search className="input-icon" size={18} />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por equipo, orden o desc..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-secondary">
                        <Filter size={18} /> Filtrar
                    </button>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Orden</th>
                                <th>Equipo</th>
                                <th>Tipo</th>
                                <th>Prioridad</th>
                                <th>Estado</th>
                                <th>Asignado A</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="text-center">Cargando...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan={7} className="text-center">No se encontraron órdenes</td></tr>
                            ) : (
                                filteredOrders.map(item => (
                                    <tr key={item.id}>
                                        <td className="font-medium text-info">{item.orderNumber}</td>
                                        <td>{item.equipment.name}</td>
                                        <td>{item.type}</td>
                                        <td>{getPriorityBadge(item.priority)}</td>
                                        <td>{getStatusBadge(item.status)}</td>
                                        <td>{item.assignedTo ? item.assignedTo.username : 'Sin Asignar'}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleOpenModal(item)} className="btn btn-secondary" style={{padding: '0.4rem', color: '#60A5FA'}}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} className="btn btn-danger" style={{padding: '0.4rem'}}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                title={editingItem ? 'Editar Orden' : 'Nueva Orden'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Nº Orden</label>
                            <input 
                                type="text" 
                                className="form-control w-full"
                                value={formData.orderNumber}
                                onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Equipo</label>
                            <select 
                                className="form-control w-full"
                                value={formData.equipmentId}
                                onChange={(e) => setFormData({...formData, equipmentId: e.target.value})}
                                required
                            >
                                <option value="">Seleccione un equipo</option>
                                {equipments.map(eq => (
                                    <option key={eq.id} value={eq.id}>{eq.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
                        <textarea 
                            className="form-control w-full"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={2}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Tipo</label>
                            <select 
                                className="form-control w-full"
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                            >
                                <option value="PREVENTIVO">Preventivo</option>
                                <option value="CORRECTIVO">Correctivo</option>
                                <option value="PREDICTIVO">Predictivo</option>
                                <option value="EMERGENCIA">Emergencia</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Prioridad</label>
                            <select 
                                className="form-control w-full"
                                value={formData.priority}
                                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                            >
                                <option value="BAJA">Baja</option>
                                <option value="MEDIA">Media</option>
                                <option value="ALTA">Alta</option>
                                <option value="CRITICA">Crítica</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
                            <select 
                                className="form-control w-full"
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="PENDIENTE">Pendiente</option>
                                <option value="EN_PROGRESO">En Progreso</option>
                                <option value="COMPLETADA">Completada</option>
                                <option value="CANCELADA">Cancelada</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Asignar A (Opcional)</label>
                        <select 
                            className="form-control w-full"
                            value={formData.assignedToId}
                            onChange={(e) => setFormData({...formData, assignedToId: e.target.value})}
                        >
                            <option value="">Sin Asignar</option>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.username}</option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default WorkOrders;
