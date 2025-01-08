import React, { useState } from 'react';
import { BaseEdge, getBezierPath } from '@xyflow/react';
import type { Edge, EdgeProps } from '@xyflow/react';

interface CustomEdgeProps extends EdgeProps {
  onEdgeClick?: (evt: React.MouseEvent, edge: Edge) => void;
}

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  selected,
  animated,
  onEdgeClick
}: CustomEdgeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleEdgeClick = (evt: React.MouseEvent<SVGGElement, MouseEvent>) => {
    evt.stopPropagation();
    if (onEdgeClick) {
      onEdgeClick(evt, { id } as Edge);
    }
  };

  return (
    <g
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleEdgeClick}
      style={{ cursor: 'pointer' }}
    >
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeDasharray: '5 5',
          animation: animated ? 'flow 1s linear infinite' : 'none',
          stroke: '#4CAF50',
          strokeWidth: 2,
        }}
      />
      {isHovered && (
        <g transform={`translate(${labelX - 10} ${labelY - 10})`}>
          <circle
            r="12"
            fill="white"
            stroke="#ff0000"
            strokeWidth="2"
            opacity="0.8"
          />
          <path
            d="M-6 -6 L6 6 M-6 6 L6 -6"
            stroke="#ff0000"
            strokeWidth="2"
            opacity="0.8"
          />
        </g>
      )}
    </g>
  );
}; 