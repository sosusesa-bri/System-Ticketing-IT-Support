import { useCallback, useMemo } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, Handle, Position, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useLanguage } from '../../../../contexts/LanguageContext';

const ProcessNode = ({ data }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500 font-medium text-center text-neutral-800 dark:text-white min-w-[150px]">
        <Handle type="target" position={Position.Top} className="w-2 h-2" />
        {data.label}
        <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
);

const DecisionNode = ({ data }) => (
    <div className="px-4 py-4 shadow-md bg-amber-50 border-2 border-amber-500 font-medium text-neutral-900 text-center transform rotate-45 w-24 h-24 flex items-center justify-center">
        <div className="transform -rotate-45 text-xs whitespace-normal">{data.label}</div>
        <Handle type="target" position={Position.Top} className="w-2 h-2 transform -rotate-45 translate-x-3 -translate-y-3" />
        <Handle type="source" position={Position.Bottom} id="yes" className="w-2 h-2 transform -rotate-45 -translate-x-3 translate-y-3" />
        <Handle type="source" position={Position.Right} id="no" className="w-2 h-2 transform -rotate-45 translate-x-3 translate-y-3" />
    </div>
);

const TerminalNode = ({ data }) => (
    <div className="px-5 py-2 shadow-md rounded-full bg-slate-800 text-white font-medium text-center min-w-[120px]">
        <Handle type="target" position={Position.Top} className="w-2 h-2" />
        {data.label}
        <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
);

const nodeTypes = { process: ProcessNode, decision: DecisionNode, terminal: TerminalNode };
const defaultEdgeOptions = { type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' }, style: { stroke: '#64748b', strokeWidth: 2 } };

const getNodes = (lang) => {
    const d = lang === 'id';
    return [
        { id: 'start', type: 'terminal', position: { x: 250, y: 50 }, data: { label: d ? 'Pengguna Ingin Membuat Tiket' : 'User Wants to Submit Ticket' } },
        { id: 'fill_form', type: 'process', position: { x: 250, y: 150 }, data: { label: d ? 'Isi Formulir Tiket (Judul, Deskripsi, Kategori, Prioritas)' : 'Fill Ticket Form (Title, Desc, Category, Priority)' } },
        { id: 'attach_file', type: 'decision', position: { x: 225, y: 250 }, data: { label: d ? 'Lampirkan Berkas?' : 'Attach File?' } },
        { id: 'upload_file', type: 'process', position: { x: 450, y: 275 }, data: { label: d ? 'Pilih & Unggah Berkas' : 'Select & Upload File' } },
        { id: 'validate_file', type: 'decision', position: { x: 425, y: 375 }, data: { label: d ? 'Valid (<10MB)?' : 'Valid (<10MB)?' } },
        { id: 'submit', type: 'process', position: { x: 250, y: 450 }, data: { label: d ? 'Kirim Permintaan Tiket' : 'Submit Ticket Request' } },
        { id: 'create_record', type: 'process', position: { x: 250, y: 550 }, data: { label: d ? 'Sistem Membuat Tiket (Status: OPEN)' : 'System Creates Ticket (Status: OPEN)' } },
        { id: 'notify', type: 'process', position: { x: 250, y: 650 }, data: { label: d ? 'Sistem Mengirim Notifikasi ke Admin IT' : 'System Notifies IT Admin' } },
        { id: 'end', type: 'terminal', position: { x: 250, y: 750 }, data: { label: d ? 'Tiket Terlihat di Dasbor Pengguna' : 'Ticket Visible on User Dashboard' } },
    ];
};

const getEdges = (lang) => {
    const y = lang === 'id' ? 'Ya' : 'Yes';
    const n = lang === 'id' ? 'Tidak' : 'No';
    return [
        { id: 'e1', source: 'start', target: 'fill_form' },
        { id: 'e2', source: 'fill_form', target: 'attach_file' },
        { id: 'e3', source: 'attach_file', sourceHandle: 'yes', target: 'upload_file', label: y },
        { id: 'e4', source: 'attach_file', sourceHandle: 'no', target: 'submit', label: n },
        { id: 'e5', source: 'upload_file', target: 'validate_file' },
        { id: 'e6', source: 'validate_file', sourceHandle: 'yes', target: 'submit', label: y, type: 'step' },
        { id: 'e7', source: 'validate_file', sourceHandle: 'no', target: 'upload_file', label: n, type: 'step' },
        { id: 'e8', source: 'submit', target: 'create_record' },
        { id: 'e9', source: 'create_record', target: 'notify' },
        { id: 'e10', source: 'notify', target: 'end' },
    ];
};

export default function FlowchartTicket() {
    const { language } = useLanguage();
    const isId = language === 'id';
    const initialNodes = useMemo(() => getNodes(language), [language]);
    const initialEdges = useMemo(() => getEdges(language), [language]);
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    const onDownload = useCallback(() => {
        const el = document.querySelector('.react-flow');
        if (el) toPng(el, { backgroundColor: '#f8fafc' }).then((url) => { const a = document.createElement('a'); a.download = 'flowchart-ticket.png'; a.href = url; a.click(); });
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-200 bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900">{isId ? 'Alur Pembuatan Tiket' : 'Ticket Creation Flow'}</h2>
                    <p className="text-xs sm:text-sm text-neutral-500">{isId ? 'Bagaimana pengguna mengirim tiket dan pemrosesan sistem.' : 'How users submit tickets and system processing.'}</p>
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
