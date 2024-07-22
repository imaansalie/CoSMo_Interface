import { IconButton } from "@chakra-ui/react";
import { color } from "framer-motion";
import React from "react";
import { X } from "react-bootstrap-icons";
import { BezierEdge, EdgeLabelRenderer, getBezierPath, useReactFlow } from "reactflow";

const Role = (props) => {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props;
  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
  const { setEdges } = useReactFlow();

  return (
    <>
    {/* Render path for the edge */}
      <path
        id={id}
        style={{
            stroke: "black",
            strokeWidth: 2,
            fill: "none",
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
    </>
  );
};

export default Role;
