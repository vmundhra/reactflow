![](https://github.com/xyflow/web/blob/main/assets/codesandbox-header-ts.png?raw=true)

# React Flow Pipeline

A simple, interactive node-based pipeline builder created with React Flow. This project demonstrates basic CRUD operations for nodes in a visual pipeline interface, built on top of the React Flow starter template.

## Features

- Visual node-based pipeline interface
- Interactive node creation and management
- CRUD operations for nodes with wrench/trash icons
- Animated edge connections
- Customizable node styling
- Automatic node ID management
- Responsive layout with grid snapping
- Header node with custom styling
- Regular nodes with consistent square dimensions

## Tech Stack

- React
- TypeScript
- React Flow (@xyflow/react)
- React Markdown
- Vite

## Getting Started

You can get this template without forking/cloning the repo using \`degit\`:

\`\`\`bash
npx degit [your-repo-url] your-app-name
\`\`\`

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
\`\`\`bash
npm install # or \`pnpm install\` or \`yarn install\`
\`\`\`

2. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

While the development server is running, changes you make to the code will be automatically reflected in the browser!

## Usage

- **Add Node**: Click the "Add Node" button in the top right corner
- **Connect Nodes**: Drag from one node's handle to another's
- **Edit Node**: Click the wrench icon on any node
- **Delete Node**: Click the trash icon on any node
- **Move Nodes**: Drag nodes to reposition them
- **Pan & Zoom**: Use mouse wheel and drag on canvas

## Project Structure

\`\`\`
src/
├── components/     # Reusable components (NodeControls)
├── nodes/         # Node type definitions and implementations
│   ├── ButtonNode.tsx
│   ├── types.ts
│   └── index.ts
├── App.tsx        # Main application component
└── styles.css     # Global styles
\`\`\`

## Future Enhancements

- Additional node types
- Custom edge types
- Node configuration panel
- Save/Load functionality
- Advanced routing options

## Resources

Links:
- [React Flow - Docs](https://reactflow.dev)
- [React Flow - Discord](https://discord.com/invite/Bqt6xrs)

Learn:
- [React Flow – Custom Nodes](https://reactflow.dev/learn/customization/custom-nodes)
- [React Flow – Layouting](https://reactflow.dev/learn/layouting/layouting)

## License

MIT`;
