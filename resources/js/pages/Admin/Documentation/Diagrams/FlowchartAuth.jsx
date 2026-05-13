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
    const isId = lang === 'id';
    return [
        { id: 'start', type: 'terminal', position: { x: 250, y: 50 }, data: { label: isId ? 'Mulai' : 'Start' } },
        { id: 'nav_login', type: 'process', position: { x: 250, y: 150 }, data: { label: isId ? 'Pengguna mengunjungi /login' : 'User visits /login' } },
        { id: 'has_acc', type: 'decision', position: { x: 225, y: 250 }, data: { label: isId ? 'Punya Akun?' : 'Has Account?' } },

        { id: 'nav_register', type: 'process', position: { x: 450, y: 275 }, data: { label: isId ? 'Navigasi ke /register' : 'Navigate to /register' } },
        { id: 'fill_register', type: 'process', position: { x: 450, y: 375 }, data: { label: isId ? 'Isi Formulir (Nama, Dept, dll)' : 'Submit Form (Name, Dept, etc)' } },
        { id: 'val_register', type: 'decision', position: { x: 425, y: 475 }, data: { label: isId ? 'Valid?' : 'Valid?' } },
        { id: 'reg_success', type: 'process', position: { x: 450, y: 625 }, data: { label: isId ? 'Akun Dibuat' : 'Account Created' } },

        { id: 'fill_login', type: 'process', position: { x: 250, y: 400 }, data: { label: isId ? 'Masukkan Email & Kata Sandi' : 'Enter Email & Password' } },
        { id: 'val_login', type: 'decision', position: { x: 225, y: 500 }, data: { label: isId ? 'Kredensial Valid?' : 'Valid Credentials?' } },
        { id: 'session_start', type: 'process', position: { x: 250, y: 650 }, data: { label: isId ? 'Sesi Dimulai' : 'Session Started' } },

        { id: 'check_role', type: 'decision', position: { x: 225, y: 750 }, data: { label: isId ? 'Peran == Admin?' : 'Role == Admin?' } },

        { id: 'dash_admin', type: 'process', position: { x: 50, y: 875 }, data: { label: isId ? 'Arahkan ke /admin/dashboard' : 'Redirect to /admin/dashboard' } },
        { id: 'dash_user', type: 'process', position: { x: 400, y: 875 }, data: { label: isId ? 'Arahkan ke /dashboard' : 'Redirect to /dashboard' } },

        { id: 'end', type: 'terminal', position: { x: 250, y: 1000 }, data: { label: isId ? 'Selesai' : 'End' } },
    ];
};

const getEdges = (lang) => {
    const isId = lang === 'id';
    const yes = isId ? 'Ya' : 'Yes';
    const no = isId ? 'Tidak' : 'No';
    return [
        { id: 'e1', source: 'start', target: 'nav_login' },
        { id: 'e2', source: 'nav_login', target: 'has_acc' },

        { id: 'e3', source: 'has_acc', sourceHandle: 'yes', target: 'fill_login', label: yes },
        { id: 'e4', source: 'has_acc', sourceHandle: 'no', target: 'nav_register', label: no },

        { id: 'e5', source: 'nav_register', target: 'fill_register' },
        { id: 'e6', source: 'fill_register', target: 'val_register' },
        { id: 'e7', source: 'val_register', sourceHandle: 'yes', target: 'reg_success', label: yes },
        { id: 'e8', source: 'val_register', sourceHandle: 'no', target: 'nav_register', label: no, type: 'step', sourceHandleId: 'no', targetHandleId: 'right' },
        { id: 'e9', source: 'reg_success', target: 'nav_login' },

        { id: 'e10', source: 'fill_login', target: 'val_login' },
        { id: 'e11', source: 'val_login', sourceHandle: 'yes', target: 'session_start', label: yes },
        { id: 'e12', source: 'val_login', sourceHandle: 'no', target: 'nav_login', label: no, type: 'step', sourceHandleId: 'no', targetHandleId: 'right' },

        { id: 'e13', source: 'session_start', target: 'check_role' },
        { id: 'e14', source: 'check_role', sourceHandle: 'yes', target: 'dash_admin', label: yes },
        { id: 'e15', source: 'check_role', sourceHandle: 'no', target: 'dash_user', label: no },

        { id: 'e16', source: 'dash_admin', target: 'end' },
        { id: 'e17', source: 'dash_user', target: 'end' },
    ];
};

export default function FlowchartAuth() {
    const { language } = useLanguage();
    const isId = language === 'id';

    const initialNodes = useMemo(() => getNodes(language), [language]);
    const initialEdges = useMemo(() => getEdges(language), [language]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onDownload = useCallback(() => {
        const diagramElement = document.querySelector('.react-flow');
        if (diagramElement) {
            toPng(diagramElement, { backgroundColor: '#f8fafc' })
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = 'flowchart-auth.png';
                    link.href = dataUrl;
                    link.click();
                });
        }
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-200 bg-white flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-neutral-900">{isId ? 'Alur Autentikasi' : 'Authentication Flow'}</h2>
                    <p className="text-xs sm:text-sm text-neutral-500">{isId ? 'Registrasi, Login, dan pengalihan berbasis peran.' : 'Registration, Login, and Role-based redirection.'}</p>
                </div>
                <button onClick={onDownload} className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-md text-sm font-medium transition-colors border border-primary-200 self-start sm:self-auto">
                    <Download className="h-4 w-4" />
                    Export PNG
                </button>
            </div>
            <div className="flex-1 w-full h-full min-h-[400px] sm:min-h-[500px]">
                <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} nodeTypes={nodeTypes} defaultEdgeOptions={defaultEdgeOptions} fitView>
                    <Controls />
                    <MiniMap zoomable pannable className="hidden sm:block" />
                    <Background color="#cbd5e1" gap={16} />
                </ReactFlow>
            </div>
        </div>
    );
}
