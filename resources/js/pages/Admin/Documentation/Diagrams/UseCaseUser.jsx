import { useCallback, useMemo } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useLanguage } from '../../../../contexts/LanguageContext';

const ActorNode = ({ data }) => (
    <div className="flex flex-col items-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <div className="mt-2 font-bold text-slate-800 bg-white px-2 py-1 rounded shadow-sm border">{data.label}</div>
        <Handle type="source" position={Position.Right} className="!bg-transparent !border-none" />
    </div>
);

const UseCaseNode = ({ data }) => (
    <div className="px-6 py-3 bg-white border-2 border-emerald-500 rounded-[50%] shadow-md font-medium text-center text-slate-700 dark:text-white min-w-[160px]">
        <Handle type="target" position={Position.Left} className="!bg-transparent !border-none" />
        {data.label}
        <Handle type="source" position={Position.Right} className="!bg-transparent !border-none" />
        <Handle type="target" position={Position.Right} id="target-right" className="!bg-transparent !border-none" />
        <Handle type="source" position={Position.Left} id="source-left" className="!bg-transparent !border-none" />
    </div>
);

const nodeTypes = { actor: ActorNode, useCase: UseCaseNode };
const defaultEdgeOptions = { type: 'straight', style: { stroke: '#94a3b8', strokeWidth: 2 } };

const getNodes = (lang) => {
    const d = lang === 'id';
    return [
        { id: 'actor_user', type: 'actor', position: { x: 50, y: 300 }, data: { label: d ? 'Pengguna (Karyawan)' : 'User (Employee)' } },
        { id: 'uc1', type: 'useCase', position: { x: 350, y: 50 }, data: { label: d ? 'Registrasi & Login' : 'Register & Login' } },
        { id: 'uc2', type: 'useCase', position: { x: 350, y: 150 }, data: { label: d ? 'Buat Tiket' : 'Create Ticket' } },
        { id: 'uc3', type: 'useCase', position: { x: 350, y: 250 }, data: { label: d ? 'Lacak Status Tiket' : 'Track Ticket Status' } },
        { id: 'uc4', type: 'useCase', position: { x: 350, y: 350 }, data: { label: d ? 'Tambah Komentar ke Tiket' : 'Add Comment to Ticket' } },
        { id: 'uc5', type: 'useCase', position: { x: 350, y: 450 }, data: { label: d ? 'Buka Ulang Tiket Tertutup' : 'Reopen Closed Ticket' } },
        { id: 'uc6', type: 'useCase', position: { x: 350, y: 550 }, data: { label: d ? 'Kelola Profil & Bahasa' : 'Manage Profile & Language' } },
        { id: 'uc_upload', type: 'useCase', position: { x: 700, y: 250 }, data: { label: d ? 'Unggah Lampiran' : 'Upload Attachment' } },
        { id: 'uc_notif', type: 'useCase', position: { x: 700, y: 150 }, data: { label: d ? 'Kirim Notifikasi' : 'Send Notification' } },
    ];
};

const initialEdges = [
    { id: 'e1', source: 'actor_user', target: 'uc1' },
    { id: 'e2', source: 'actor_user', target: 'uc2' },
    { id: 'e3', source: 'actor_user', target: 'uc3' },
    { id: 'e4', source: 'actor_user', target: 'uc4' },
    { id: 'e5', source: 'actor_user', target: 'uc5' },
    { id: 'e6', source: 'actor_user', target: 'uc6' },
    { id: 'e-inc-notif', source: 'uc2', target: 'uc_notif', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '5 5' }, label: '<<include>>', labelStyle: { fill: '#f59e0b', fontWeight: 600, fontSize: 11 }, labelBgStyle: { fill: '#f8fafc', fillOpacity: 0.8 } },
    { id: 'e-ext-upload1', source: 'uc_upload', sourceHandle: 'source-left', target: 'uc2', targetHandle: 'target-right', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }, label: '<<extend>>', labelStyle: { fill: '#3b82f6', fontWeight: 600, fontSize: 11 }, labelBgStyle: { fill: '#f8fafc', fillOpacity: 0.8 } },
    { id: 'e-ext-upload2', source: 'uc_upload', sourceHandle: 'source-left', target: 'uc4', targetHandle: 'target-right', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }, label: '<<extend>>', labelStyle: { fill: '#3b82f6', fontWeight: 600, fontSize: 11 }, labelBgStyle: { fill: '#f8fafc', fillOpacity: 0.8 } },
];

export default function UseCaseUser() {
    const { language } = useLanguage();
    const isId = language === 'id';
    const nodeData = useMemo(() => getNodes(language), [language]);
    const [nodes, , onNodesChange] = useNodesState(nodeData);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    const onDownload = useCallback(() => {
        const el = document.querySelector('.react-flow');
        if (el) toPng(el, { backgroundColor: '#f8fafc' }).then((url) => { const a = document.createElement('a'); a.download = 'use-case-user.png'; a.href = url; a.click(); });
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-200 bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900">{isId ? 'Use Case Aktor Pengguna' : 'User Actor Use Cases'}</h2>
                    <p className="text-xs sm:text-sm text-neutral-500">{isId ? 'Kemampuan yang tersedia untuk karyawan.' : 'Capabilities available to standard employees.'}</p>
                </div>
                <button onClick={onDownload} className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-md text-sm font-medium transition-colors border border-primary-200 self-start sm:self-auto">
                    <Download className="h-4 w-4" />Export PNG
                </button>
            </div>
            <div className="flex-1 w-full h-full min-h-[400px] sm:min-h-[500px]">
                <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} nodeTypes={nodeTypes} defaultEdgeOptions={defaultEdgeOptions} fitView>
                    <Controls /><MiniMap zoomable pannable className="hidden sm:block" /><Background color="#cbd5e1" gap={16} />
                </ReactFlow>
            </div>
        </div>
    );
}
