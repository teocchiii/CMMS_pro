import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Package, Wrench, CheckCircle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface SummaryKpis {
    totalEquipment: number;
    pendingOrders: number;
    inProgressOrders: number;
    completedOrders: number;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState<SummaryKpis | null>(null);
    const [ordersByStatus, setOrdersByStatus] = useState<any[]>([]);
    const [equipmentByStatus, setEquipmentByStatus] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [summaryRes, ordersRes, equipmentRes] = await Promise.all([
                api.get('/dashboard/summary'),
                api.get('/dashboard/orders-by-status'),
                api.get('/dashboard/equipment-status')
            ]);
            
            setSummary(summaryRes.data);
            
            const formattedOrdersData = Object.keys(ordersRes.data).map(key => ({
                name: key.replace('_', ' '),
                value: ordersRes.data[key]
            })).filter(item => item.value > 0);
            
            const formattedEquipmentData = Object.keys(equipmentRes.data).map(key => ({
                name: key.replace(/_/g, ' '),
                cantidad: equipmentRes.data[key]
            })).filter(item => item.cantidad > 0);
            
            setOrdersByStatus(formattedOrdersData);
            setEquipmentByStatus(formattedEquipmentData);
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        }
    };

    const COLORS = ['#F59E0B', '#3B82F6', '#10B981', '#EF4444'];

    return (
        <div className="dashboard">
            <header className="mb-6">
                <h1>Dashboard de Mantenimiento</h1>
                <p>Resumen general del estado de CMMS.</p>
            </header>

            {summary && (
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="glass-card flex items-center gap-4">
                        <div className="icon-wrapper" style={{background: 'rgba(59, 130, 246, 0.2)', color: '#3B82F6', flexShrink: 0}}>
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-muted" style={{margin: 0, fontSize: '0.875rem'}}>Total Equipos</p>
                            <h2 style={{margin: 0, lineHeight: 1}}>{summary.totalEquipment}</h2>
                        </div>
                    </div>
                    
                    <div className="glass-card flex items-center gap-4">
                        <div className="icon-wrapper" style={{background: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B', flexShrink: 0}}>
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-muted" style={{margin: 0, fontSize: '0.875rem'}}>Órdenes Pendientes</p>
                            <h2 style={{margin: 0, lineHeight: 1}}>{summary.pendingOrders}</h2>
                        </div>
                    </div>
                    
                    <div className="glass-card flex items-center gap-4">
                        <div className="icon-wrapper" style={{background: 'rgba(99, 102, 241, 0.2)', color: '#6366F1', flexShrink: 0}}>
                            <Wrench size={24} />
                        </div>
                        <div>
                            <p className="text-muted" style={{margin: 0, fontSize: '0.875rem'}}>En Progreso</p>
                            <h2 style={{margin: 0, lineHeight: 1}}>{summary.inProgressOrders}</h2>
                        </div>
                    </div>
                    
                    <div className="glass-card flex items-center gap-4">
                        <div className="icon-wrapper" style={{background: 'rgba(16, 185, 129, 0.2)', color: '#10B981', flexShrink: 0}}>
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-muted" style={{margin: 0, fontSize: '0.875rem'}}>Completadas</p>
                            <h2 style={{margin: 0, lineHeight: 1}}>{summary.completedOrders}</h2>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="glass-card">
                    <h3>Órdenes por Estado</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={ordersByStatus}
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {ordersByStatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ background: 'rgba(30, 41, 59, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="glass-card">
                    <h3>Estado de Equipos</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={equipmentByStatus} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} tickMargin={10} />
                                <YAxis stroke="#cbd5e1" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ background: 'rgba(30, 41, 59, 0.9)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                />
                                <Bar dataKey="cantidad" fill="#6366F1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="glass-card mt-4 text-center">
                <h3>Acciones Rápidas</h3>
                <div className="flex justify-center gap-16 mt-6">
                    <button onClick={() => navigate('/work-orders')} className="btn btn-secondary flex items-center justify-center gap-2 px-8 py-3">
                        <Wrench size={18} /> Ir a Órdenes
                    </button>
                    <button onClick={() => navigate('/equipment')} className="btn btn-secondary flex items-center justify-center gap-2 px-8 py-3">
                        <Package size={18} /> Ir a Equipos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
