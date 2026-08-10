import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Calendar, Plus, Edit2, Trash2, Search, Activity } from 'lucide-react';
import Modal from '../components/Modal';

interface MaintenancePlan {
    id: number;
    name: string;
    description: string;
    equipment: { id: number, name: string };
    frequency: string;
    lastExecution: string | null;
    nextExecution: string;
    active: boolean;
    equipmentId?: number;
}

const initialForm = {
    name: '', description: '', equipmentId: '', frequency: 'MENSUAL', nextExecution: '', active: true
};

const MaintenancePlans: React.FC = () => {
    const [plans, setPlans] = useState<MaintenancePlan[]>([]);
    const [equipments, setEquipments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MaintenancePlan | null>(null);
    const [formData, setFormData] = useState<any>(initialForm);

    useEffect(() => {
        fetchPlans();
        fetchEquipments();
    }, []);

    const fetchEquipments = async () => {
        try {
            const response = await api.get('/equipment');
            setEquipments(response.data.content || response.data || []);
        } catch(e) {
            console.error('Error fetching equipments', e);
        }
    };

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await api.get('/maintenance-plans');
            setPlans(response.data.content || response.data);
        } catch (error) {
            console.error('Error fetching maintenance plans', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item?: MaintenancePlan) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name || '',
                description: item.description || '',
                equipmentId: item.equipment?.id || item.equipmentId || '',
                frequency: item.frequency || 'MENSUAL',
                nextExecution: item.nextExecution ? item.nextExecution.substring(0, 10) : '',
                active: item.active !== undefined ? item.active : true
            });
        } else {
            setEditingItem(null);
            setFormData(initialForm);
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
                equipment: { id: formData.equipmentId }
            };
            if (editingItem) {
                await api.put(`/maintenance-plans/${editingItem.id}`, payload);
            } else {
                await api.post('/maintenance-plans', payload);
            }
            handleCloseModal();
            fetchPlans();
        } catch (error) {
            console.error('Error saving plan', error);
            alert('Error al guardar el plan de mantenimiento.');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este plan de mantenimiento?')) {
            try {
                await api.delete(`/maintenance-plans/${id}`);
                fetchPlans();
            } catch (error) {
                console.error('Error deleting plan', error);
                alert('No se pudo eliminar el plan.');
            }
        }
    };

    const filteredPlans = plans.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="maintenance-plans-page">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1>Planes de Mantenimiento</h1>
                    <p>Gestiona los mantenimientos preventivos programados.</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={18} /> Nuevo Plan
                </button>
            </div>

            <div className="glass-card mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="input-with-icon" style={{width: '300px'}}>
                        <Search className="input-icon" size={18} />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por nombre o equipo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Plan</th>
                                <th>Equipo</th>
                                <th>Frecuencia</th>
                                <th>Próxima Ejecución</th>
                                <th>Última Ejecución</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="text-center">Cargando...</td></tr>
                            ) : filteredPlans.length === 0 ? (
                                <tr><td colSpan={7} className="text-center">No se encontraron planes</td></tr>
                            ) : (
                                filteredPlans.map(item => {
                                    const isDueSoon = new Date(item.nextExecution).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;
                                    
                                    return (
                                        <tr key={item.id}>
                                            <td className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-muted flex-shrink-0" /> 
                                                    <span>{item.name}</span>
                                                </div>
                                            </td>
                                            <td>{item.equipment.name}</td>
                                            <td>{item.frequency}</td>
                                            <td style={{ color: isDueSoon ? 'var(--status-warning)' : 'inherit', fontWeight: isDueSoon ? 600 : 400 }}>
                                                {new Date(item.nextExecution).toLocaleDateString()}
                                            </td>
                                            <td>{item.lastExecution ? new Date(item.lastExecution).toLocaleDateString() : 'Nunca'}</td>
                                            <td>
                                                {item.active ? (
                                                    <span className="badge badge-success flex items-center gap-1" style={{display: 'inline-flex'}}>
                                                        <Activity size={12} /> Activo
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-error">Inactivo</span>
                                                )}
                                            </td>
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
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                title={editingItem ? 'Editar Plan de Mantenimiento' : 'Nuevo Plan de Mantenimiento'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Nombre del Plan</label>
                        <input 
                            type="text" 
                            className="form-control w-full"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
                        <textarea 
                            className="form-control w-full"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={2}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Frecuencia</label>
                            <select 
                                className="form-control w-full"
                                value={formData.frequency}
                                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                            >
                                <option value="DIARIO">Diario</option>
                                <option value="SEMANAL">Semanal</option>
                                <option value="QUINCENAL">Quincenal</option>
                                <option value="MENSUAL">Mensual</option>
                                <option value="TRIMESTRAL">Trimestral</option>
                                <option value="SEMESTRAL">Semestral</option>
                                <option value="ANUAL">Anual</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Próxima Ejecución</label>
                            <input 
                                type="date" 
                                className="form-control w-full"
                                value={formData.nextExecution}
                                onChange={(e) => setFormData({...formData, nextExecution: e.target.value})}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <input 
                            type="checkbox" 
                            id="active"
                            checked={formData.active}
                            onChange={(e) => setFormData({...formData, active: e.target.checked})}
                            style={{width: 'auto'}}
                        />
                        <label htmlFor="active" className="text-sm font-medium text-gray-300">Plan Activo</label>
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

export default MaintenancePlans;
