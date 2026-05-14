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
    MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { GitCommit, Download } from 'lucide-react';
import { toPng } from 'html-to-image';

// Custom Flow Nodes
const ProcessNode = ({ data }) => (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500 font-medium text-center text-neutral-800 min-w-[150px]">
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

const nodeTypes = {
    process: ProcessNode,
    decision: DecisionNode,
    terminal: TerminalNode,
};

const defaultEdgeOptions = {
    type: 'smoothstep',
    markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
    style: { stroke: '#64748b', strokeWidth: 2 },
};

const initialNodes = [
    { id: 'start', type: 'terminal', position: { x: 250, y: 50 }, data: { label: 'Start' } },
    { id: 'create', type: 'process', position: { x: 250, y: 150 }, data: { label: 'User Creates Ticket' } },
    { id: 'status_open', type: 'process', position: { x: 250, y: 250 }, data: { label: 'Status: OPEN' } },
    { id: 'notify_admin', type: 'process', position: { x: 250, y: 350 }, data: { label: 'Notify Admins' } },
    { id: 'admin_review', type: 'process', position: { x: 250, y: 450 }, data: { label: 'Admin Reviews & Assigns' } },
    { id: 'status_process', type: 'process', position: { x: 250, y: 550 }, data: { label: 'Status: ON PROCESS' } },
    { id: 'fix_issue', type: 'process', position: { x: 250, y: 650 }, data: { label: 'Technician Fixes Issue' } },
    { id: 'add_solution', type: 'process', position: { x: 250, y: 750 }, data: { label: 'Add Solution Notes' } },
    { id: 'status_close', type: 'process', position: { x: 250, y: 850 }, data: { label: 'Status: CLOSED' } },
    
    { id: 'user_verify', type: 'decision', position: { x: 225, y: 950 }, data: { label: 'Issue Fixed?' } },
    
    { id: 'reopen', type: 'process', position: { x: 450, y: 975 }, data: { label: 'Status: REOPENED' } },
    { id: 'end', type: 'terminal', position: { x: 250, y: 1150 }, data: { label: 'End' } },
];

const initialEdges = [
    { id: 'e1', source: 'start', target: 'create' },
    { id: 'e2', source: 'create', target: 'status_open' },
    { id: 'e3', source: 'status_open', target: 'notify_admin' },
    { id: 'e4', source: 'notify_admin', target: 'admin_review' },
    { id: 'e5', source: 'admin_review', target: 'status_process' },
    { id: 'e6', source: 'status_process', target: 'fix_issue' },
    { id: 'e7', source: 'fix_issue', target: 'add_solution' },
    { id: 'e8', source: 'add_solution', target: 'status_close' },
    { id: 'e9', source: 'status_close', target: 'user_verify' },
    
    { id: 'e10', source: 'user_verify', sourceHandle: 'yes', target: 'end', label: 'Yes' },
    { id: 'e11', source: 'user_verify', sourceHandle: 'no', target: 'reopen', label: 'No' },
    { id: 'e12', source: 'reopen', target: 'status_process', sourceHandle: 'top', targetHandle: 'right', type: 'step' },
];

export default function Flowchart() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onDownload = useCallback(() => {
        const diagramElement = document.querySelector('.react-flow');
        if (diagramElement) {
            toPng(diagramElement, { backgroundColor: '#f8fafc' })
                .then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = 'flowchart.png';
                    link.href = dataUrl;
                    link.click();
                });
        }
    }, []);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="px-6 py-4 border-b border-neutral-200 bg-white flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900">System Flowchart</h2>
                    <p className="text-sm text-neutral-500">Core Ticket Lifecycle Workflow.</p>
                </div>
                <button 
                    onClick={onDownload}
                    className="flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-md text-sm font-medium transition-colors border border-primary-200"
                >
                    <Download className="h-4 w-4" />
                    Export PNG
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
                    <MiniMap zoomable pannable />
                    <Background color="#cbd5e1" gap={16} />
                </ReactFlow>
            </div>
        </div>
    );
}
