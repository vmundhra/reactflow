![](https://github.com/xyflow/web/blob/main/assets/codesandbox-header-ts.png?raw=true)

# React Flow Pipeline

A visual pipeline builder using React Flow, allowing users to create, edit, and manage data processing pipelines.

## Features

- Drag and drop interface for pipeline creation
- Multiple node types:
  - Source nodes for data input
  - Button nodes for transformations and actions
- Node editing with custom modals
- Real-time pipeline visualization
- Connection management between nodes
- CRUD operations for all nodes

## Example Pipeline Flow

![Example Pipeline Flow](public/ExampleA.png)

In this example pipeline:
1. **Data Source**: The entry point that fetches data from an API endpoint
2. **Mutation A**: First transformation step of the data
3. **Analysis A**: Processing and analysis of the transformed data
4. **Pipeline Output**: Final output of the processed data

Each node can be edited, deleted, or connected to other nodes to create a complete data processing pipeline.

## Tech Stack

- React
- TypeScript
- React Flow (@xyflow/react)
- Vite

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Click "Add Node" to add new nodes to the pipeline
2. Drag nodes to position them
3. Connect nodes by dragging from one node's output handle to another node's input handle
4. Edit nodes by clicking the edit button (🔧) in the top-right corner
5. Delete nodes using the delete button (🗑️) in the top-right corner

## Future Enhancements

- Additional node types for different data operations
- Data preview functionality
- Pipeline validation
- Save/Load pipeline configurations
- Real-time data processing
- Export/Import pipeline definitions

## Resources

Links:
- [React Flow - Docs](https://reactflow.dev)
- [React Flow - Discord](https://discord.com/invite/Bqt6xrs)

Learn:
- [React Flow – Custom Nodes](https://reactflow.dev/learn/customization/custom-nodes)
- [React Flow – Layouting](https://reactflow.dev/learn/layouting/layouting)

## License

MIT`;
