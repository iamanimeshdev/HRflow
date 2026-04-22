# ⚡ Tredence — HR Workflow Designer
<img width="1919" height="874" alt="image" src="https://github.com/user-attachments/assets/b421549b-3105-4fe5-be0c-b2ea6b4418bc" />



A premium, interactive Visual Workflow Designer built with React, TypeScript, and React Flow. 
Design, configure, validate, and simulate complex HR logic flows through an intuitive drag-and-drop interface.

## Features

- **🖱️ Drag-and-Drop Canvas**: Seamlessly build workflows by dragging nodes from the left palette onto the interactive React Flow canvas.
- **🧩 Custom Node Types**:
  - **🟢 Start Node**: The entry point of your workflow.
  - **🔵 Task Node**: Manual HR tasks with configurable assignees and due dates.
  - **🟠 Approval Node**: Logic gates requiring specific managerial roles.
  - **🟣 Automated Step**: System-level automated actions and webhooks.
  - **🔴 End Node**: The terminal point of the workflow.
- **🔗 Dynamic Edge Routing**: Connections between nodes automatically inherit the exact color of their source node, creating visually distinct and traceable logic paths.
- **🛡️ Real-time Validation Engine**: Built-in rules engine that ensures workflows are structurally sound (e.g., exactly one Start Node, no disconnected edges, valid paths to End Nodes).
- **🕹️ Workflow Simulator**: A step-by-step simulation engine that executes the graph visually, outputting a detailed run log of success states and warnings.
- **💾 Import / Export**: Save your configured workflow state as a lightweight JSON file and instantly import it back to resume work later.

## 🛠️ Technology Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Canvas Engine**: [React Flow (xyflow)](https://reactflow.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository** (or download the source code).
2. **Navigate into the project directory**:
   ```bash
   cd tredence-assignment
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. **Open in Browser**: Navigate to `http://localhost:5173`

## 🧠 Architecture Overview

- **`src/components/Canvas/`**: Contains the core `React Flow` implementation, drop handlers, and keyboard shortcut listeners.
- **`src/components/ConfigPanel/`**: Dynamic side-panel components that render form inputs based on the currently selected node's type.
- **`src/nodes/`**: Individual React components defining the custom visual appearance and layout of each node type.
- **`src/hooks/useWorkflowStore.ts`**: The central Zustand store containing the single source of truth for the graph state, selection state, and simulation logs.
- **`src/hooks/useValidation.ts`**: The logic engine that recursively traverses the graph edges to ensure structural integrity.
- **`src/utils/serializer.ts`**: Helper functions for safely encoding the application state to Base64 JSON and handling File API uploads.

## 💡 How to Use

1. **Build**: Drag a `Start Node` onto the canvas. Drag subsequent nodes (Tasks, Approvals) and connect them by dragging from the bottom handle of one node to the top handle of another.
2. **Configure**: Click on any node to open its specific properties in the right-hand Config Panel.
3. **Validate**: Click the **Validate** button in the top toolbar to check for broken links or missing configurations.
4. **Simulate**: Once validated, click **Run Workflow** to watch the system simulate traversing your logic path!

---

*Designed and engineered with attention to detail.*
