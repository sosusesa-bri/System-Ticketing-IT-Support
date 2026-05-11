import { useCallback } from 'react';
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
import { Database, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useLanguage } from '../../../../contexts/LanguageContext';

const TableNode = ({ data }) => {
    return (
        <div className="bg-white rounded-lg shadow-md border border-neutral-300 min-w-[220px] overflow-hidden font-mono text-sm">
            <div className="bg-slate-800 text-white px-3 py-2 font-bold flex justify-between items-center">
                <span>{data.label}</span>
                <Database className="h-4 w-4 opacity-50" />
            </div>
            <div className="flex flex-col">
                {data.columns.map((col, index) => (
                    <div key={index} className="flex justify-between items-center px-3 py-1.5 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 relative">
                        <Handle type="target" position={Position.Left} id={`${col.name}-in`} className="!w-1 !h-1 !bg-transparent !border-none" style={{ left: 0 }} />
                        <div className="flex gap-2 items-center">
                            {col.isPk && <span className="text-[10px] font-bold text-amber-500 w-4">PK</span>}
                            {col.isFk && <span className="text-[10px] font-bold text-blue-500 w-4">FK</span>}
                            {!col.isPk && !col.isFk && <span className="w-4"></span>}
                            <span className="font-semibold text-neutral-700">{col.name}</span>
                        </div>
                        <span className="text-xs text-neutral-400">{col.type}</span>
                        <Handle type="source" position={Position.Right} id={`${col.name}-out`} className="!w-1 !h-1 !bg-transparent !border-none" style={{ right: 0 }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const nodeTypes = { table: TableNode };

const initialNodes = [
    {
        id: 'users',
        type: 'table',
        position: { x: 50, y: 50 },
        data: {
            label: 'users',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'name', type: 'string' },
                { name: 'email', type: 'string' },
                { name: 'password', type: 'string' },
                { name: 'phone', type: 'string' },
                { name: 'department', type: 'string' },
                { name: 'role', type: 'enum' },
                { name: 'language', type: 'string' },
                { name: 'deleted_at', type: 'timestamp' },
            ],
        },
    },
    {
        id: 'tickets',
        type: 'table',
        position: { x: 400, y: 50 },
        data: {
            label: 'tickets',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'ticket_number', type: 'string' },
                { name: 'title', type: 'string' },
                { name: 'status', type: 'enum' },
                { name: 'priority', type: 'enum' },
                { name: 'user_id', type: 'bigint', isFk: true },
                { name: 'category_id', type: 'bigint', isFk: true },
                { name: 'assigned_to', type: 'bigint', isFk: true },
                { name: 'due_at', type: 'timestamp' },
                { name: 'deleted_at', type: 'timestamp' },
            ],
        },
    },
    {
        id: 'ticket_categories',
        type: 'table',
        position: { x: 50, y: 450 },
        data: {
            label: 'ticket_categories',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'name', type: 'string' },
                { name: 'is_active', type: 'boolean' },
            ],
        },
    },
    {
        id: 'ticket_comments',
        type: 'table',
        position: { x: 750, y: 50 },
        data: {
            label: 'ticket_comments',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'ticket_id', type: 'bigint', isFk: true },
                { name: 'user_id', type: 'bigint', isFk: true },
                { name: 'content', type: 'text' },
            ],
        },
    },
    {
        id: 'ticket_attachments',
        type: 'table',
        position: { x: 750, y: 250 },
        data: {
            label: 'ticket_attachments',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'ticket_id', type: 'bigint', isFk: true },
                { name: 'file_path', type: 'string' },
                { name: 'file_type', type: 'string' },
            ],
        },
    },
    {
        id: 'activity_logs',
        type: 'table',
        position: { x: 400, y: 450 },
        data: {
            label: 'activity_logs',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'user_id', type: 'bigint', isFk: true },
                { name: 'loggable_type', type: 'string' },
                { name: 'loggable_id', type: 'bigint' },
                { name: 'action', type: 'string' },
            ],
        },
    },
];

const labelStyle = { fill: '#64748b', fontWeight: 600, fontSize: 11 };
const labelBgStyle = { fill: '#f8fafc', fillOpacity: 0.8 };

const initialEdges = [
    { id: 'e-user-ticket', source: 'users', target: 'tickets', sourceHandle: 'id-out', targetHandle: 'user_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 }, label: '1:N', labelStyle, labelBgStyle },
    { id: 'e-assign-ticket', source: 'users', target: 'tickets', sourceHandle: 'id-out', targetHandle: 'assigned_to-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5 5' }, label: '1:N', labelStyle, labelBgStyle },
    { id: 'e-cat-ticket', source: 'ticket_categories', target: 'tickets', sourceHandle: 'id-out', targetHandle: 'category_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 }, label: '1:N', labelStyle, labelBgStyle },
    { id: 'e-ticket-comment', source: 'tickets', target: 'ticket_comments', sourceHandle: 'id-out', targetHandle: 'ticket_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 }, label: '1:N', labelStyle, labelBgStyle },
    { id: 'e-user-comment', source: 'users', target: 'ticket_comments', sourceHandle: 'id-out', targetHandle: 'user_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 }, label: '1:N', labelStyle, labelBgStyle },
    { id: 'e-ticket-attach', source: 'tickets', target: 'ticket_attachments', sourceHandle: 'id-out', targetHandle: 'ticket_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 }, label: '1:N', labelStyle, labelBgStyle },
    { id: 'e-user-log', source: 'users', target: 'activity_logs', sourceHandle: 'id-out', targetHandle: 'user_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 }, label: '1:N', labelStyle, labelBgStyle },
];

export default function ERDCore() {
    const { language } = useLanguage();
    const isId = language === 'id';
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onDownload = useCallback(() => {
        const diagramElement = document.querySelector('.react-flow');
        if (diagramElement) {
            toPng(diagramElement, { backgroundColor: '#f8fafc' })
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = 'erd-core.png';
                    link.href = dataUrl;
                    link.click();
                });
        }
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-200 bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900">{isId ? 'ERD Sistem Tiket Inti' : 'Core Ticketing ERD'}</h2>
                    <p className="text-xs sm:text-sm text-neutral-500">{isId ? 'Pemetaan database untuk pengguna, tiket, dan aktivitas.' : 'Database mapping for users, tickets, and activities.'}</p>
                </div>
                <button onClick={onDownload} className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-md text-sm font-medium transition-colors border border-primary-200 self-start sm:self-auto">
                    <Download className="h-4 w-4" />
                    Export PNG
                </button>
            </div>
            <div className="flex-1 w-full h-full min-h-[400px] sm:min-h-[500px]">
                <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} nodeTypes={nodeTypes} fitView>
                    <Controls />
                    <MiniMap zoomable pannable nodeClassName={(node) => 'bg-slate-300'} className="hidden sm:block" />
                    <Background color="#cbd5e1" gap={16} />
                </ReactFlow>
            </div>
        </div>
    );
}
