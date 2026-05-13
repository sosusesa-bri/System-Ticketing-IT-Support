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
import { Users, Download, UserCircle, ShieldAlert } from 'lucide-react';
import { toPng } from 'html-to-image';

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
    <div className="px-6 py-3 rounded-[100%] bg-white border-2 border-primary-500 shadow-sm flex items-center justify-center min-w-[160px] min-h-[60px] text-center text-sm font-medium text-neutral-800 dark:text-white">
        <Handle type="target" position={Position.Left} className="!opacity-0" />
        {data.label}
        <Handle type="source" position={Position.Right} className="!opacity-0" />
    </div>
);

const SystemBoundaryNode = ({ data }) => (
    <div className="w-[500px] h-[800px] border-2 border-dashed border-neutral-400 bg-slate-50/50 rounded-xl relative pointer-events-none">
        <div className="absolute top-0 left-0 w-full bg-neutral-200 text-neutral-700 font-bold px-4 py-2 rounded-t-lg border-b border-neutral-400">
            {data.label}
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

const initialNodes = [
    // Actors
    { id: 'user', type: 'actor', position: { x: 50, y: 250 }, data: { label: 'User (Employee)', role: 'user' } },
    { id: 'admin', type: 'actor', position: { x: 800, y: 350 }, data: { label: 'Admin (IT Support)', role: 'admin' } },
    
    // System Boundary
    { id: 'system', type: 'system', position: { x: 200, y: 50 }, data: { label: 'Sistem Ticketing IT Support' } },
    
    // Use Cases
    { id: 'uc1', type: 'usecase', position: { x: 350, y: 150 }, data: { label: 'Manage Profile' } },
    { id: 'uc2', type: 'usecase', position: { x: 350, y: 250 }, data: { label: 'Submit Ticket' } },
    { id: 'uc3', type: 'usecase', position: { x: 350, y: 350 }, data: { label: 'View Own Tickets' } },
    { id: 'uc4', type: 'usecase', position: { x: 350, y: 450 }, data: { label: 'Add Comments' } },
    
    { id: 'uc5', type: 'usecase', position: { x: 350, y: 550 }, data: { label: 'Manage All Tickets' } },
    { id: 'uc6', type: 'usecase', position: { x: 350, y: 650 }, data: { label: 'Manage Broadcasts' } },
    { id: 'uc7', type: 'usecase', position: { x: 350, y: 750 }, data: { label: 'View Analytics & Reports' } },
];

const initialEdges = [
    // User connections
    { id: 'e-u-1', source: 'user', target: 'uc1' },
    { id: 'e-u-2', source: 'user', target: 'uc2' },
    { id: 'e-u-3', source: 'user', target: 'uc3' },
    { id: 'e-u-4', source: 'user', target: 'uc4' },
    
    // Admin connections (Admin inherits some user capabilities contextually, but specifically mapping core admin tasks)
    { id: 'e-a-1', source: 'admin', target: 'uc1' },
    { id: 'e-a-4', source: 'admin', target: 'uc4' },
    { id: 'e-a-5', source: 'admin', target: 'uc5' },
    { id: 'e-a-6', source: 'admin', target: 'uc6' },
    { id: 'e-a-7', source: 'admin', target: 'uc7' },
];

export default function UseCase() {
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
                    <h2 className="text-xl font-bold text-neutral-900">Use Case Diagram</h2>
                    <p className="text-sm text-neutral-500">Actor interactions with the system modules.</p>
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
