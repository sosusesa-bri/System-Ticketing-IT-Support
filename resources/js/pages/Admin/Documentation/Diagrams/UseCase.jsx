import { useCallback, useMemo } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Handle,
    Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Users, Download, UserCircle, ShieldAlert } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useLanguage } from '../../../../contexts/LanguageContext';

// Custom Nodes for Use Case
const ActorNode = ({ data }) => (
    <div className="flex flex-col items-center justify-center bg-transparent">
        {data.role === 'admin' ? (
            <ShieldAlert className="h-12 w-12 text-rose-600" strokeWidth={1.5} />
        ) : (
            <UserCircle className="h-12 w-12 text-blue-600" strokeWidth={1.5} />
        )}
        <span className="mt-2 font-bold text-sm text-neutral-800">{data.label}</span>
        <Handle type="source" position={Position.Right} className="!opacity-0" />
        <Handle type="target" position={Position.Left} className="!opacity-0" />
    </div>
);

const UseCaseNode = ({ data }) => (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-full py-3 px-6 shadow-sm min-w-[180px] text-center flex items-center justify-center">
        <Handle type="target" position={Position.Left} className="!opacity-0" />
        <span className="font-semibold text-sm text-blue-900">{data.label}</span>
        <Handle type="source" position={Position.Right} className="!opacity-0" />
    </div>
);

const SystemBoundaryNode = ({ data }) => (
    <div className="border-2 border-dashed border-neutral-400 bg-neutral-50/50 rounded-xl relative" style={{ width: 450, height: 1050 }}>
        <div className="absolute top-0 left-0 w-full bg-neutral-200/50 py-2 border-b-2 border-dashed border-neutral-400 rounded-t-xl text-center">
            <span className="font-bold text-neutral-600 uppercase tracking-wider text-sm">{data.label}</span>
        </div>
    </div>
);

const nodeTypes = {
    actor: ActorNode,
    usecase: UseCaseNode,
    system: SystemBoundaryNode,
};

const defaultEdgeOptions = {
    type: 'straight',
    style: { stroke: '#475569', strokeWidth: 1.5 },
};

export default function UseCase() {
    const { language } = useLanguage();
    const isId = language === 'id';

    const initialNodes = useMemo(() => [
        // Actors
        { id: 'user', type: 'actor', position: { x: 50, y: 250 }, data: { label: isId ? 'Pengguna (Karyawan)' : 'User (Employee)', role: 'user' } },
        { id: 'admin', type: 'actor', position: { x: 800, y: 450 }, data: { label: 'Admin (IT Support)', role: 'admin' } },
        
        // System Boundary
        { id: 'system', type: 'system', position: { x: 250, y: 50 }, data: { label: isId ? 'Sistem Ticketing IT Support' : 'IT Support Ticketing System' } },
        
        // Use Cases
        { id: 'uc1', type: 'usecase', position: { x: 380, y: 150 }, data: { label: isId ? 'Kelola Profil' : 'Manage Profile' } },
        { id: 'uc2', type: 'usecase', position: { x: 380, y: 250 }, data: { label: isId ? 'Buat Tiket' : 'Submit Ticket' } },
        { id: 'uc3', type: 'usecase', position: { x: 380, y: 350 }, data: { label: isId ? 'Lihat Tiket Sendiri' : 'View Own Tickets' } },
        { id: 'uc4', type: 'usecase', position: { x: 380, y: 450 }, data: { label: isId ? 'Tambah Komentar' : 'Add Comments' } },
        { id: 'uc8', type: 'usecase', position: { x: 380, y: 550 }, data: { label: isId ? 'Berikan Rating & Ulasan' : 'Provide Rating & Feedback' } },
        
        { id: 'uc5', type: 'usecase', position: { x: 380, y: 650 }, data: { label: isId ? 'Kelola Semua Tiket' : 'Manage All Tickets' } },
        { id: 'uc6', type: 'usecase', position: { x: 380, y: 750 }, data: { label: isId ? 'Kelola Broadcast' : 'Manage Broadcasts' } },
        { id: 'uc9', type: 'usecase', position: { x: 380, y: 850 }, data: { label: isId ? 'Kelola Tag & FAQ' : 'Manage Tags & FAQ' } },
        { id: 'uc7', type: 'usecase', position: { x: 380, y: 950 }, data: { label: isId ? 'Lihat Laporan & Kesehatan Sistem' : 'View Analytics & System Health' } },
    ], [isId]);

    const initialEdges = useMemo(() => [
        // User connections
        { id: 'e-u-1', source: 'user', target: 'uc1' },
        { id: 'e-u-2', source: 'user', target: 'uc2' },
        { id: 'e-u-3', source: 'user', target: 'uc3' },
        { id: 'e-u-4', source: 'user', target: 'uc4' },
        { id: 'e-u-8', source: 'user', target: 'uc8' },
        
        // Admin connections
        { id: 'e-a-1', source: 'admin', target: 'uc1' },
        { id: 'e-a-4', source: 'admin', target: 'uc4' },
        { id: 'e-a-5', source: 'admin', target: 'uc5' },
        { id: 'e-a-6', source: 'admin', target: 'uc6' },
        { id: 'e-a-9', source: 'admin', target: 'uc9' },
        { id: 'e-a-7', source: 'admin', target: 'uc7' },
    ], []);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onDownload = useCallback(() => {
        const diagramElement = document.querySelector('.react-flow');
        if (diagramElement) {
            toPng(diagramElement, { backgroundColor: '#f8fafc' })
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = 'use-case.png';
                    link.href = dataUrl;
                    link.click();
                });
        }
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="px-6 py-4 border-b border-neutral-200 bg-white flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900">{isId ? 'Diagram Use Case' : 'Use Case Diagram'}</h2>
                    <p className="text-sm text-neutral-500">{isId ? 'Interaksi aktor dengan modul sistem.' : 'Actor interactions with the system modules.'}</p>
                </div>
                <button 
                    onClick={onDownload}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-md text-sm font-medium transition-colors border border-primary-200"
                >
                    <Download className="h-4 w-4" />
                    {isId ? 'Unduh PNG' : 'Export PNG'}
                </button>
            </div>
            <div className="flex-1 w-full h-full min-h-[500px]">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    defaultEdgeOptions={defaultEdgeOptions}
                    fitView
                    attributionPosition="bottom-right"
                >
                    <Controls />
                    <MiniMap zoomable pannable nodeClassName={(node) => {
                        if (node.type === 'actor') return 'bg-neutral-800';
                        if (node.type === 'usecase') return 'bg-blue-400';
                        return 'bg-slate-200';
                    }} />
                    <Background color="#cbd5e1" gap={16} />
                </ReactFlow>
            </div>
        </div>
    );
}
