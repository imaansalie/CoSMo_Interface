import { IconButton } from "@chakra-ui/react";
import React from "react";
import { X } from "react-bootstrap-icons";
import { BezierEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from "reactflow";

const SubConstructorEdge = (props) => {

    //destructure props
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data } = props;
    //calculate path and label position for edge
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
  const { setEdges } = useReactFlow();

  const handleDelete=()=>{
    console.log(`Deleting edge with id: ${id}`);
    setEdges((prevEdges) => prevEdges.filter((edge)=>edge.id !== id));
  }

  return (
    <>
    {/* Render path for the edge */}
      <path
        id={id}
        style={{
            stroke: "purple",
            strokeWidth: 2,
            fill: "none",
            markerEnd:"url(#arrowhead)",
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
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="8"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,7 L10,3.5 z" fill="purple" />
        </marker>
      </defs>
    </>
  );
};

export default SubConstructorEdge;
