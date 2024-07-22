import { IconButton } from "@chakra-ui/react";
import React from "react";
import { X } from "react-bootstrap-icons";
import { BezierEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from "reactflow";

const InstanceEdge = (props) => {

    //destructure props
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data } = props;
    //calculate path and label position for edge
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
  const { setEdges } = useReactFlow();

  return (
    <>
    {/* Render path for the edge */}
      <path
        id={id}
        style={{
            stroke: "purple",
            strokeWidth: 2,
            fill: "none",
            markerEnd:"url(#double-arrowhead)",
        }}    
        d={edgePath} //set the path data
      />
      {/* Render label for edge */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
            <IconButton
            aria-label="Delete Edge"
            icon={<X />}
            color="red"
            border="none"
            bg="transparent"
            size="small"
            onClick={() =>
              setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== id))
            }
          />
        </div>
      </EdgeLabelRenderer>

    {/* Define marker at the end of path (arrowhead) */}
      <defs>
      <marker id="double-arrowhead" markerWidth="20" markerHeight="10" refX="14.5" refY="5" orient="auto">
        {/* <!-- First arrowhead --> */}
        <path
          d="M0,2 L6,5 L0,8" 
          fill="none"
          stroke="purple"
          strokeWidth="1"
        />
        {/* <!-- Second arrowhead --> */}
        <path
          d="M8,2 L14,5 L8,8"
          fill="none"
          stroke="purple"
          strokeWidth="1"
        />
      </marker>
      </defs>
    </>
  );
};

export default InstanceEdge;
