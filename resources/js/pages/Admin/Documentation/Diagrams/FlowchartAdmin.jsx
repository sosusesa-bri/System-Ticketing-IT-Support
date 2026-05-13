import { useCallback, useMemo } from 'react';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, Handle, Position, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useLanguage } from '../../../../contexts/LanguageContext';

const ProcessNode = ({ data }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-rose-500 font-medium text-center text-neutral-800 dark:text-white min-w-[150px]">
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
        { id: 'start', type: 'terminal', position: { x: 250, y: 50 }, data: { label: d ? 'Admin Menerima Notifikasi Tiket' : 'Admin Receives Ticket Notification' } },
        { id: 'review', type: 'process', position: { x: 250, y: 150 }, data: { label: d ? 'Tinjau Detail Tiket' : 'Review Ticket Details' } },
        { id: 'need_more_info', type: 'decision', position: { x: 225, y: 250 }, data: { label: d ? 'Butuh Info?' : 'Need Info?' } },
        { id: 'add_comment', type: 'process', position: { x: 450, y: 275 }, data: { label: d ? 'Tambahkan Komentar untuk Pengguna' : 'Add Comment for User' } },
        { id: 'wait_reply', type: 'process', position: { x: 450, y: 375 }, data: { label: d ? 'Tunggu Balasan Pengguna' : 'Wait for User Reply' } },
        { id: 'assign_tech', type: 'process', position: { x: 250, y: 400 }, data: { label: d ? 'Tugaskan ke Teknisi' : 'Assign to Technician' } },
        { id: 'update_status_process', type: 'process', position: { x: 250, y: 500 }, data: { label: d ? 'Ubah Status ke: DIPROSES' : 'Change Status to: ON PROCESS' } },
        { id: 'fix_issue', type: 'process', position: { x: 250, y: 600 }, data: { label: d ? 'Lakukan Perbaikan / Selesaikan Masalah' : 'Perform Fix / Resolve Issue' } },
        { id: 'write_solution', type: 'process', position: { x: 250, y: 700 }, data: { label: d ? 'Tulis Catatan Solusi' : 'Write Solution Notes' } },
        { id: 'update_status_closed', type: 'process', position: { x: 250, y: 800 }, data: { label: d ? 'Ubah Status ke: DITUTUP' : 'Change Status to: CLOSED' } },
        { id: 'notify_user', type: 'process', position: { x: 250, y: 900 }, data: { label: d ? 'Sistem Mengirim Notifikasi ke Pengguna' : 'System Notifies User' } },
        { id: 'end', type: 'terminal', position: { x: 250, y: 1000 }, data: { label: d ? 'SLA Berhenti' : 'SLA Clock Stops' } },
    ];
};

const getEdges = (lang) => {
    const y = lang === 'id' ? 'Ya' : 'Yes';
    const n = lang === 'id' ? 'Tidak' : 'No';
    return [
        { id: 'e1', source: 'start', target: 'review' },
        { id: 'e2', source: 'review', target: 'need_more_info' },
        { id: 'e3', source: 'need_more_info', sourceHandle: 'yes', target: 'add_comment', label: y },
        { id: 'e4', source: 'need_more_info', sourceHandle: 'no', target: 'assign_tech', label: n },
        { id: 'e5', source: 'add_comment', target: 'wait_reply' },
        { id: 'e6', source: 'wait_reply', target: 'review', type: 'step' },
        { id: 'e7', source: 'assign_tech', target: 'update_status_process' },
        { id: 'e8', source: 'update_status_process', target: 'fix_issue' },
        { id: 'e9', source: 'fix_issue', target: 'write_solution' },
        { id: 'e10', source: 'write_solution', target: 'update_status_closed' },
        { id: 'e11', source: 'update_status_closed', target: 'notify_user' },
        { id: 'e12', source: 'notify_user', target: 'end' },
    ];
};

export default function FlowchartAdmin() {
    const { language } = useLanguage();
    const isId = language === 'id';
    const initialNodes = useMemo(() => getNodes(language), [language]);
    const initialEdges = useMemo(() => getEdges(language), [language]);
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    const onDownload = useCallback(() => {
        const el = document.querySelector('.react-flow');
        if (el) toPng(el, { backgroundColor: '#f8fafc' }).then((url) => { const a = document.createElement('a'); a.download = 'flowchart-admin.png'; a.href = url; a.click(); });
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-200 bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900">{isId ? 'Pemrosesan Tiket Admin' : 'Admin Ticket Processing'}</h2>
                    <p className="text-xs sm:text-sm text-neutral-500">{isId ? 'Bagaimana IT Support menangani tiket dari peninjauan hingga penutupan.' : 'How IT Support handles a ticket from review to closure.'}</p>
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
