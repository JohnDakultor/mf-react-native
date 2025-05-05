// Tree.tsx
import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import Svg, { Circle, Line, Text as SvgText, G } from "react-native-svg";
import * as d3 from "d3-hierarchy";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type TreeNode = {
  name: string;
  attributes: {
    status: string;
    level: string;
    interestRate: string;
    joinDate: string;
    totalSavings: string;
  };
  children?: TreeNode[];
};

const NODE_RADIUS = 16;
const NODE_SPACING_X = 120;
const NODE_SPACING_Y = 80;

interface TreeProps {
  treeData: TreeNode;
  onNodeSelect: (node: TreeNode) => void;
}

const Tree: React.FC<TreeProps> = ({ treeData, onNodeSelect }) => {
    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree<TreeNode>().nodeSize([NODE_SPACING_X, NODE_SPACING_Y]);
    const treeDataLayout = treeLayout(root);
  
    const nodes = treeDataLayout.descendants();
    const links = treeDataLayout.links();
  
    // horizontal centering
    const screenWidth = Dimensions.get("window").width;
    const rootNode = nodes[0];
    const offsetX = screenWidth / 2 - rootNode.x;
  
    // vertical centering: shift root (at y=0) down into view
    const minY = Math.min(...nodes.map(d => d.y));
    const offsetY = NODE_RADIUS + 20 - minY;             // pad 20px above
  
    const minX = Math.min(...nodes.map(d => d.x));
    const maxX = Math.max(...nodes.map(d => d.x));
    const maxY = Math.max(...nodes.map(d => d.y));
    const svgWidth = maxX - minX + 200;
    const svgHeight = maxY - minY + 200;
  
    return (
      <Svg width={svgWidth} height={svgHeight}>
        {links.map((link, i) => (
          <Line
            key={i}
            x1={link.source.x + offsetX}
            y1={link.source.y + offsetY}
            x2={link.target.x + offsetX}
            y2={link.target.y + offsetY}
            stroke="#ccc"
          />
        ))}
  
        {nodes.map((node, i) => {
          const fill = node.data.attributes.status === "active" ? "#4CAF50" : "#9E9E9E";
          const tap = Gesture.Tap().onEnd(() => onNodeSelect(node.data));
  
          return (
            <GestureDetector key={i} gesture={tap}>
              <G>
                <Circle
                  cx={node.x + offsetX}
                  cy={node.y + offsetY}
                  r={NODE_RADIUS}
                  fill={fill}
                />
                <SvgText
                  x={node.x + offsetX}
                  y={node.y + offsetY - NODE_RADIUS - 6}
                  fontSize="12"
                  fill="#333"
                  textAnchor="middle"
                >
                  {node.data.name}
                </SvgText>
                <SvgText
                  x={node.x + offsetX}
                  y={node.y + offsetY + NODE_RADIUS + 12}
                  fontSize="10"
                  fill="#333"
                  textAnchor="middle"
                >
                  {node.data.attributes.level}
                </SvgText>
              </G>
            </GestureDetector>
          );
        })}
      </Svg>
    );
  };
  
  export default Tree;