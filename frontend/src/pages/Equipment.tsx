import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Package, Plus, Edit2, Trash2, Search, Download, FileText, FileSpreadsheet } from 'lucide-react';
import Modal from '../components/Modal';

interface EquipmentData {
    id: number;
    name: string;
    description: string;
    serialNumber: string;
    model: string;
    manufacturer: string;
    installationDate: string;
    status: string;
    code: string;
    category: string;
}

const initialForm = {
    name: '', code: '', description: '', category: 'ELECTRICO', 
    status: 'OPERATIVO', model: '', serialNumber: '', manufacturer: '', installationDate: ''
};

const Equipment: React.FC = () => {
    const [equipment, setEquipment] = useState<EquipmentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<EquipmentData | null>(null);
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        try {
            setLoading(true);
            const response = await api.get('/equipment');
            setEquipment(response.data.content || response.data);
        } catch (error) {
            console.error('Error fetching equipment', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item?: EquipmentData) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name || '',
                code: item.code || '',
                description: item.description || '',
                category: item.category || 'ELECTRICO',
                status: item.status || 'OPERATIVO',
                model: item.model || '',
                serialNumber: item.serialNumber || '',
                manufacturer: item.manufacturer || '',
                installationDate: item.installationDate ? item.installationDate.split('T')[0] : ''
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
            if (editingItem) {
                await api.put(`/equipment/${editingItem.id}`, formData);
            } else {
                await api.post('/equipment', formData);
            }
            handleCloseModal();
            fetchEquipment();
        } catch (error) {
            console.error('Error saving equipment', error);
            alert('Error al guardar el equipo.');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este equipo?')) {
            try {
                await api.delete(`/equipment/${id}`);
                fetchEquipment();
            } catch (error) {
                console.error('Error deleting equipment', error);
                alert('No se pudo eliminar. Puede que tenga registros asociados.');
            }
        }
    };

    const handleDownloadPdf = async () => {
        try {
            const response = await api.get('/reports/equipment/pdf', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'equipos.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading PDF', error);
            alert('Error al descargar el PDF.');
        }
    };

    const handleDownloadExcel = async () => {
        try {
            const response = await api.get('/reports/equipment/excel', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'equipos.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading Excel', error);
            alert('Error al descargar el Excel.');
        }
    };

    const filteredEquipment = equipment.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'ACTIVO': return <span className="badge badge-success">Activo</span>;
            case 'INACTIVO': return <span className="badge badge-error">Inactivo</span>;
            case 'EN_MANTENIMIENTO': return <span className="badge badge-warning">Mantenimiento</span>;
            default: return <span className="badge badge-info">{status}</span>;
        }
    };

    return (
        <div className="equipment-page">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1>Equipos</h1>
                    <p>Gestiona los equipos y maquinaria del sistema.</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-secondary" onClick={handleDownloadPdf}>
                        <FileText size={18} /> Exportar PDF
                    </button>
                    <button className="btn btn-secondary" onClick={handleDownloadExcel}>
                        <FileSpreadsheet size={18} /> Exportar Excel
                    </button>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        <Plus size={18} /> Nuevo Equipo
                    </button>
                </div>
            </div>

            <div className="glass-card mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="input-with-icon" style={{width: '300px'}}>
                        <Search className="input-icon" size={18} />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por nombre o serie..."
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
                                <th>Nombre</th>
                                <th>No. Serie</th>
                                <th>Fabricante</th>
                                <th>Instalación</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="text-center">Cargando...</td></tr>
                            ) : filteredEquipment.length === 0 ? (
                                <tr><td colSpan={7} className="text-center">No se encontraron equipos</td></tr>
                            ) : (
                                filteredEquipment.map(item => (
                                    <tr key={item.id}>
                                        <td>#{item.id}</td>
                                        <td className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <Package size={16} className="text-muted flex-shrink-0" /> 
                                                <span>{item.name}</span>
                                            </div>
                                        </td>
                                        <td>{item.serialNumber}</td>
                                        <td>{item.manufacturer}</td>
                                        <td>{item.installationDate ? new Date(item.installationDate).toLocaleDateString() : 'N/A'}</td>
                                        <td>{getStatusBadge(item.status)}</td>
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
                title={editingItem ? 'Editar Equipo' : 'Nuevo Equipo'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Código</label>
                            <input 
                                type="text" 
                                className="form-control w-full"
                                value={formData.code}
                                onChange={(e) => setFormData({...formData, code: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                            <input 
                                type="text" 
                                className="form-control w-full"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>
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
                            <label className="block text-sm font-medium text-gray-300 mb-1">Categoría</label>
                            <select 
                                className="form-control w-full"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="ELECTRICO">Eléctrico</option>
                                <option value="HIDRAULICO">Hidráulico</option>
                                <option value="MECANICO">Mecánico</option>
                                <option value="NEUMATICO">Neumático</option>
                                <option value="OTRO">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Estado</label>
                            <select 
                                className="form-control w-full"
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                            >
                                <option value="OPERATIVO">Operativo</option>
                                <option value="EN_MANTENIMIENTO">En Mantenimiento</option>
                                <option value="FUERA_DE_SERVICIO">Fuera de Servicio</option>
                                <option value="DADO_DE_BAJA">Dado de Baja</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Modelo</label>
                            <input 
                                type="text" 
                                className="form-control w-full"
                                value={formData.model}
                                onChange={(e) => setFormData({...formData, model: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">No. Serie</label>
                            <input 
                                type="text" 
                                className="form-control w-full"
                                value={formData.serialNumber}
                                onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Fabricante</label>
                            <input 
                                type="text" 
                                className="form-control w-full"
                                value={formData.manufacturer}
                                onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Instalación</label>
                        <input 
                            type="date" 
                            className="form-control w-full"
                            value={formData.installationDate}
                            onChange={(e) => setFormData({...formData, installationDate: e.target.value})}
                        />
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

export default Equipment;
