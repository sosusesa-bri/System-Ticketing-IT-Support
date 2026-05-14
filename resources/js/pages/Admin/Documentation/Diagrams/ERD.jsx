import { useCallback, useState } from 'react';
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
import { Database, Download, ZoomIn } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useLanguage } from '../../../../contexts/LanguageContext';

// Custom Node for ERD Tables
const TableNode = ({ data }) => {
    return (
        <div className="bg-white rounded-lg shadow-md border border-neutral-300 min-w-[200px] overflow-hidden font-mono text-sm">
            <div className="bg-slate-800 text-white px-3 py-2 font-bold flex justify-between items-center">
                <span>{data.label}</span>
                <Database className="h-4 w-4 opacity-50" />
            </div>
            <div className="flex flex-col">
                {data.columns.map((col, index) => (
                    <div key={index} className="flex justify-between items-center px-3 py-1.5 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 relative">
                        {/* Target handles for incoming FK connections */}
                        <Handle type="target" position={Position.Left} id={`${col.name}-in`} className="!w-1 !h-1 !bg-transparent !border-none" style={{ left: 0 }} />
                        
                        <div className="flex gap-2 items-center">
                            {col.isPk && <span className="text-[10px] font-bold text-amber-500 w-4">PK</span>}
                            {col.isFk && <span className="text-[10px] font-bold text-blue-500 w-4">FK</span>}
                            {!col.isPk && !col.isFk && <span className="w-4"></span>}
                            <span className="font-semibold text-neutral-700">{col.name}</span>
                        </div>
                        <span className="text-xs text-neutral-400">{col.type}</span>

                        {/* Source handles for outgoing FK connections */}
                        <Handle type="source" position={Position.Right} id={`${col.name}-out`} className="!w-1 !h-1 !bg-transparent !border-none" style={{ right: 0 }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

const nodeTypes = {
    table: TableNode,
};

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
                { name: 'role', type: 'enum' },
                { name: 'department', type: 'string' },
                { name: 'phone', type: 'string' },
                { name: 'language', type: 'string' },
                { name: 'theme', type: 'string' },
                { name: 'notification_preferences', type: 'json' },
                { name: 'last_login_at', type: 'timestamp' },
            ],
        },
    },
    {
        id: 'ticket_categories',
        type: 'table',
        position: { x: 50, y: 500 },
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
        id: 'tickets',
        type: 'table',
        position: { x: 400, y: 50 },
        data: {
            label: 'tickets',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'ticket_number', type: 'string' },
                { name: 'title', type: 'string' },
                { name: 'user_id', type: 'bigint', isFk: true },
                { name: 'category_id', type: 'bigint', isFk: true },
                { name: 'assigned_to', type: 'bigint', isFk: true },
                { name: 'status', type: 'enum' },
                { name: 'priority', type: 'enum' },
                { name: 'rating', type: 'integer' },
                { name: 'feedback_notes', type: 'text' },
                { name: 'first_responded_at', type: 'timestamp' },
                { name: 'due_at', type: 'timestamp' },
                { name: 'response_due_at', type: 'timestamp' },
                { name: 'is_escalated', type: 'boolean' },
                { name: 'escalation_level', type: 'integer' },
            ],
        },
    },
    {
        id: 'ticket_comments',
        type: 'table',
        position: { x: 400, y: 580 },
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
        position: { x: 400, y: 780 },
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
        id: 'tags',
        type: 'table',
        position: { x: 50, y: 700 },
        data: {
            label: 'tags',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'name', type: 'string' },
                { name: 'color', type: 'string' },
            ],
        },
    },
    {
        id: 'ticket_tag',
        type: 'table',
        position: { x: 400, y: 950 },
        data: {
            label: 'ticket_tag',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'ticket_id', type: 'bigint', isFk: true },
                { name: 'tag_id', type: 'bigint', isFk: true },
            ],
        },
    },
    {
        id: 'faqs',
        type: 'table',
        position: { x: 800, y: 550 },
        data: {
            label: 'faqs',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'question', type: 'string' },
                { name: 'answer', type: 'text' },
                { name: 'category', type: 'string' },
                { name: 'sort_order', type: 'integer' },
                { name: 'is_active', type: 'boolean' },
            ],
        },
    },
    {
        id: 'faq_attachments',
        type: 'table',
        position: { x: 800, y: 800 },
        data: {
            label: 'faq_attachments',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'faq_id', type: 'bigint', isFk: true },
                { name: 'file_name', type: 'string' },
                { name: 'file_path', type: 'string' },
                { name: 'file_type', type: 'string' },
                { name: 'file_size', type: 'integer' },
            ],
        },
    },
    {
        id: 'kb_categories',
        type: 'table',
        position: { x: 800, y: 50 },
        data: {
            label: 'kb_categories',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'name', type: 'string' },
                { name: 'slug', type: 'string' },
                { name: 'is_active', type: 'boolean' },
            ],
        },
    },
    {
        id: 'kb_articles',
        type: 'table',
        position: { x: 800, y: 250 },
        data: {
            label: 'kb_articles',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'category_id', type: 'bigint', isFk: true },
                { name: 'author_id', type: 'bigint', isFk: true },
                { name: 'title', type: 'string' },
                { name: 'status', type: 'enum' },
                { name: 'views_count', type: 'integer' },
            ],
        },
    },
    {
        id: 'notification_broadcasts',
        type: 'table',
        position: { x: 1200, y: 50 },
        data: {
            label: 'notification_broadcasts',
            columns: [
                { name: 'id', type: 'bigint', isPk: true },
                { name: 'title', type: 'string' },
                { name: 'message', type: 'text' },
                { name: 'type', type: 'string' },
                { name: 'audience', type: 'string' },
                { name: 'sender_id', type: 'bigint', isFk: true },
                { name: 'is_sent', type: 'boolean' },
            ],
        },
    },
    {
        id: 'notifications',
        type: 'table',
        position: { x: 1200, y: 350 },
        data: {
            label: 'notifications',
            columns: [
                { name: 'id', type: 'uuid', isPk: true },
                { name: 'type', type: 'string' },
                { name: 'notifiable_id', type: 'bigint', isFk: true },
                { name: 'data', type: 'json' },
                { name: 'read_at', type: 'timestamp' },
            ],
        },
    },
];

const initialEdges = [
    { id: 'e-user-ticket', source: 'users', target: 'tickets', sourceHandle: 'id-out', targetHandle: 'user_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 } },
    { id: 'e-assign-ticket', source: 'users', target: 'tickets', sourceHandle: 'id-out', targetHandle: 'assigned_to-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5 5' } },
    { id: 'e-cat-ticket', source: 'ticket_categories', target: 'tickets', sourceHandle: 'id-out', targetHandle: 'category_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 } },
    { id: 'e-ticket-comment', source: 'tickets', target: 'ticket_comments', sourceHandle: 'id-out', targetHandle: 'ticket_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 } },
    { id: 'e-ticket-attach', source: 'tickets', target: 'ticket_attachments', sourceHandle: 'id-out', targetHandle: 'ticket_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 } },
    { id: 'e-tag-ticket-tag', source: 'tags', target: 'ticket_tag', sourceHandle: 'id-out', targetHandle: 'tag_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 } },
    { id: 'e-ticket-ticket-tag', source: 'tickets', target: 'ticket_tag', sourceHandle: 'id-out', targetHandle: 'ticket_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 } },
    { id: 'e-faq-attach', source: 'faqs', target: 'faq_attachments', sourceHandle: 'id-out', targetHandle: 'faq_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 } },
    { id: 'e-kb-cat-article', source: 'kb_categories', target: 'kb_articles', sourceHandle: 'id-out', targetHandle: 'category_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 } },
    { id: 'e-user-kb-article', source: 'users', target: 'kb_articles', sourceHandle: 'id-out', targetHandle: 'author_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 } },
    { id: 'e-user-broadcast', source: 'users', target: 'notification_broadcasts', sourceHandle: 'id-out', targetHandle: 'sender_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 } },
    { id: 'e-user-notification', source: 'users', target: 'notifications', sourceHandle: 'id-out', targetHandle: 'notifiable_id-in', animated: false, style: { stroke: '#94a3b8', strokeWidth: 2 } },
];

export default function ERD() {
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
                    link.download = 'erd-diagram.png';
                    link.href = dataUrl;
                    link.click();
                });
        }
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="px-6 py-4 border-b border-neutral-200 bg-white flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900">{isId ? 'Diagram Relasi Entitas (ERD)' : 'Entity Relationship Diagram (ERD)'}</h2>
                    <p className="text-sm text-neutral-500">{isId ? 'Pemetaan skema database untuk Sistem Ticketing IT Support.' : 'Database schema mapping for Sistem Ticketing IT Support.'}</p>
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
                    fitView
                    attributionPosition="bottom-right"
                >
                    <Controls />
                    <MiniMap zoomable pannable nodeClassName={(node) => 'bg-slate-300'} />
                    <Background color="#cbd5e1" gap={16} />
                </ReactFlow>
            </div>
        </div>
    );
}
