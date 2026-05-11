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
        id: 'notification_broadcasts',
        type: 'table',
        position: { x: 50, y: 50 },
        data: {
            label: 'notification_broadcasts',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'author_id', type: 'bigint', isFk: true },
                { name: 'title', type: 'string' },
                { name: 'body', type: 'text' },
                { name: 'target_role', type: 'string' },
                { name: 'scheduled_at', type: 'timestamp' },
            ],
        },
    },
    {
        id: 'notification_templates',
        type: 'table',
        position: { x: 50, y: 350 },
        data: {
            label: 'notification_templates',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'name', type: 'string' },
                { name: 'subject', type: 'string' },
                { name: 'body_template', type: 'text' },
            ],
        },
    },
    {
        id: 'notification_attachments',
        type: 'table',
        position: { x: 450, y: 50 },
        data: {
            label: 'notification_attachments',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'broadcast_id', type: 'bigint', isFk: true },
                { name: 'file_path', type: 'string' },
            ],
        },
    },
    {
        id: 'notification_delivery_logs',
        type: 'table',
        position: { x: 450, y: 250 },
        data: {
            label: 'notification_delivery_logs',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'broadcast_id', type: 'bigint', isFk: true },
                { name: 'user_id', type: 'bigint', isFk: true },
                { name: 'status', type: 'string' },
                { name: 'read_at', type: 'timestamp' },
            ],
        },
    },
    {
        id: 'notification_automation_rules',
        type: 'table',
        position: { x: 450, y: 450 },
        data: {
            label: 'notification_automation_rules',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'event_name', type: 'string' },
                { name: 'template_id', type: 'bigint', isFk: true },
                { name: 'is_active', type: 'boolean' },
            ],
        },
    },
];

const labelStyle = { fill: '#64748b', fontWeight: 600, fontSize: 11 };
const labelBgStyle = { fill: '#f8fafc', fillOpacity: 0.8 };

const initialEdges = [
    { id: 'e-broad-attach', source: 'notification_broadcasts', target: 'notification_attachments', sourceHandle: 'id-out', targetHandle: 'broadcast_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 }, label: '1:N', labelStyle, labelBgStyle },
    { id: 'e-broad-log', source: 'notification_broadcasts', target: 'notification_delivery_logs', sourceHandle: 'id-out', targetHandle: 'broadcast_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 }, label: '1:N', labelStyle, labelBgStyle },
    { id: 'e-temp-auto', source: 'notification_templates', target: 'notification_automation_rules', sourceHandle: 'id-out', targetHandle: 'template_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 }, label: '1:N', labelStyle, labelBgStyle },
];

export default function ERDNotification() {
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
                    link.download = 'erd-notification.png';
                    link.href = dataUrl;
                    link.click();
                });
        }
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-200 bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900">{isId ? 'ERD Sistem Notifikasi' : 'Notification System ERD'}</h2>
                    <p className="text-xs sm:text-sm text-neutral-500">{isId ? 'Pemetaan database untuk broadcast, template, dan log pengiriman.' : 'Database mapping for broadcasts, templates, and delivery logs.'}</p>
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
