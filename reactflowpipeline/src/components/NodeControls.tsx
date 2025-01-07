import { Node } from '@xyflow/react';

type NodeControlsProps = {
  node: Node;
  onEdit: (node: Node) => void;
  onDelete: (node: Node) => void;
};

export function NodeControls({ node, onEdit, onDelete }: NodeControlsProps) {
  return (
    <div className="node-controls">
      <button 
        className="node-control-button"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(node);
        }}
      >
        <WrenchIcon />
      </button>
      <button
        className="node-control-button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(node);
        }}
      >
        <TrashIcon />
      </button>
    </div>
  );
}

function WrenchIcon() {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  );
} 