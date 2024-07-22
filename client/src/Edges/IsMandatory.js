import { IconButton } from "@chakra-ui/react";
import React from "react";
import { X } from "react-bootstrap-icons";
import { BezierEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from "reactflow";

const IsMandatory = (props) => {

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
            stroke: "black",
            strokeWidth: 2,
            fill: "none",
            markerEnd:"url(#circle)",
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
          id="circle"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="5"
          orient="auto"
        >
          <circle cx="5" cy="5" r="4" fill="purple" />
        </marker>
      </defs>
    </>
  );
};

export default IsMandatory;
