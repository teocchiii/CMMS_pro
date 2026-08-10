import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Settings, Plus, Edit2, Trash2, Search, AlertTriangle } from 'lucide-react';
import Modal from '../components/Modal';

interface SparePart {
    id: number;
    code: string;
    name: string;
    description: string;
    stockQuantity: number;
    minimumStock: number;
    unitCost: number;
    supplier: string;
}

const initialForm = {
    code: '', name: '', description: '', stockQuantity: 0, minimumStock: 0, unitCost: 0, supplier: ''
};

const SpareParts: React.FC = () => {
    const [parts, setParts] = useState<SparePart[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<SparePart | null>(null);
    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        fetchParts();
    }, []);

    const fetchParts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/spare-parts');
            setParts(response.data.content || response.data);
        } catch (error) {
            console.error('Error fetching spare parts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item?: SparePart) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                code: item.code || '',
                name: item.name || '',
                description: item.description || '',
                stockQuantity: item.stockQuantity || 0,
                minimumStock: item.minimumStock || 0,
                unitCost: item.unitCost || 0,
                supplier: item.supplier || ''
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
                await api.put(`/spare-parts/${editingItem.id}`, formData);
            } else {
                await api.post('/spare-parts', formData);
            }
            handleCloseModal();
            fetchParts();
        } catch (error) {
            console.error('Error saving spare part', error);
            alert('Error al guardar el repuesto.');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de eliminar este repuesto?')) {
            try {
                await api.delete(`/spare-parts/${id}`);
                fetchParts();
            } catch (error) {
                console.error('Error deleting spare part', error);
                alert('No se pudo eliminar el repuesto.');
            }
        }
    };

    const filteredParts = parts.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="spare-parts-page">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1>Repuestos</h1>
                    <p>Gestiona el inventario de repuestos y materiales.</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={18} /> Nuevo Repuesto
                </button>
            </div>

            <div className="glass-card mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="input-with-icon" style={{width: '300px'}}>
                        <Search className="input-icon" size={18} />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Buscar por código o nombre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Stock Actual</th>
                                <th>Stock Mínimo</th>
                                <th>Costo Unit.</th>
                                <th>Proveedor</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={8} className="text-center">Cargando...</td></tr>
                            ) : filteredParts.length === 0 ? (
                                <tr><td colSpan={8} className="text-center">No se encontraron repuestos</td></tr>
                            ) : (
                                filteredParts.map(item => {
                                    const isLowStock = item.stockQuantity <= item.minimumStock;
                                    
                                    return (
                                        <tr key={item.id}>
                                            <td className="font-medium text-info">{item.code}</td>
                                            <td className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Settings size={16} className="text-muted flex-shrink-0" /> 
                                                    <span>{item.name}</span>
                                                </div>
                                            </td>
                                            <td style={{ color: isLowStock ? 'var(--status-error)' : 'inherit', fontWeight: isLowStock ? 600 : 400 }}>
                                                {item.stockQuantity}
                                            </td>
                                            <td>{item.minimumStock}</td>
                                            <td>S/. {item.unitCost.toFixed(2)}</td>
                                            <td>{item.supplier}</td>
                                            <td>
                                                {isLowStock ? (
                                                    <span className="badge badge-error flex items-center gap-1" style={{display: 'inline-flex'}}>
                                                        <AlertTriangle size={12} /> Bajo Stock
                                                    </span>
                                                ) : (
                                                    <span className="badge badge-success">Suficiente</span>
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
                title={editingItem ? 'Editar Repuesto' : 'Nuevo Repuesto'}
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
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Stock Actual</label>
                            <input 
                                type="number" 
                                className="form-control w-full"
                                value={formData.stockQuantity}
                                onChange={(e) => setFormData({...formData, stockQuantity: parseInt(e.target.value) || 0})}
                                required
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Stock Mínimo</label>
                            <input 
                                type="number" 
                                className="form-control w-full"
                                value={formData.minimumStock}
                                onChange={(e) => setFormData({...formData, minimumStock: parseInt(e.target.value) || 0})}
                                required
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Costo Unitario</label>
                            <input 
                                type="number" 
                                step="0.01"
                                className="form-control w-full"
                                value={formData.unitCost}
                                onChange={(e) => setFormData({...formData, unitCost: parseFloat(e.target.value) || 0})}
                                required
                                min="0"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Proveedor</label>
                        <input 
                            type="text" 
                            className="form-control w-full"
                            value={formData.supplier}
                            onChange={(e) => setFormData({...formData, supplier: e.target.value})}
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

export default SpareParts;
