# ⚡ Tredence — HR Workflow Designer

<img width="1919" height="874" alt="image" src="https://github.com/user-attachments/assets/b421549b-3105-4fe5-be0c-b2ea6b4418bc" />

A premium, interactive Visual Workflow Designer built for HR administrators to construct, configure, validate, and simulate complex operational workflows (e.g., employee onboarding, document verification, leave approvals) through an intuitive, state-of-the-art drag-and-drop interface.

##  Quick Start (How to Run)

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/iamanimeshdev/HRflow.git
      ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```
4. **Open in Browser**: Navigate to `http://localhost:5173`

---

## Architecture Overview

The application is built with a heavy focus on **modularity, scalability, and separation of concerns**. 

- **Frontend Framework:** React 18 + Vite 
- **Language:** TypeScript 
- **Canvas Engine:** React Flow / xyflow 
- **State Management:** Zustand (for a lightweight, unopinionated, and highly scalable global store, bypassing React Context re-render traps)
- **Styling:** Tailwind CSS v4 

### Folder Structure
- **`src/components/Canvas/`**: Contains the core graph implementation, drag-and-drop orchestration, and connection routing.
- **`src/components/ConfigPanel/`**: Dynamic, data-driven side-panel forms that render inputs conditionally based on the active node type.
- **`src/nodes/`**: Decoupled React components defining the custom visual presentation, handles, and logic for each node type (Start, Task, Approval, Automated, End).
- **`src/hooks/`**: Custom hooks (`useWorkflowStore.ts`, `useValidation.ts`) isolating complex business logic and state mutations from presentation components.
- **`src/utils/`**: Helper functions for graph serialization, JSON parsing, and validation schemas.

---

##  Design Decisions

1. **Zustand over Context API**: Graph state (nodes, edges, selection) updates frequently. React Context would trigger global re-renders. Zustand allows atomic, selector-based state subscriptions, ensuring only modified nodes re-render.
2. **Decoupled Node Logic**: Each custom node in `src/nodes/` is self-contained. Adding a new node type (e.g., "Wait Node") requires simply creating a new component and registering it, satisfying the Open-Closed Principle.
3. **Dynamic Forms Component**: The Config Panel dynamically resolves the required form fields based on the selected node's `type` and `data` schema. This prevents monolithic `switch` statements and makes the UI highly extensible.
4. **Graph-based Validation Engine**: Workflows are validated by traversing the graph (edges/nodes) to detect disjointed graphs, missing configurations, and missing Start/End caps before simulation.
5. **Dark-Mode Premium UI**: Opted for a sleek, OLED-optimized dark theme ("full dark") to emulate professional SaaS tools, reducing eye strain for admins building complex flows.

---

##  Completed Deliverables

### Core Requirements Fully Implemented:
- [x] **React Flow Canvas**: Drag-and-drop interface with dynamic edge routing.
- [x] **Custom Node Types**: Start, Task (Human), Approval (Manager), Automated Step (System), and End Nodes.
- [x] **Node Editing / Configuration Forms**: Context-aware property panel for editing node-specific metadata, assignees, actions, and parameters.
- [x] **Mock API Layer**: Integrated local simulation that validates graph structure and outputs a step-by-step execution log.
- [x] **Workflow Simulator / Sandbox**: A dedicated panel that serializes the active graph, validates constraints, and runs a visual execution simulation.

### Bonus Objectives (Completed)
- **Export/Import as JSON**: Users can save their workflow to disk and restore it flawlessly, demonstrating complex graph state serialization.
- **Mini-map & Zoom Controls**: Implemented a comprehensive viewport control system (React Flow MiniMap and Controls) for navigating massive, complex HR workflows effortlessly.
- **Visual Validation Errors**: The validation engine highlights disconnected or improperly configured nodes directly on the canvas in real-time, drastically improving UX and discoverability of errors.

---

##  What I Would Add With More Time
 
I prioritized core architecture, smooth interactions, and robust state management. If I had additional time, I would implement:

1. **Backend Integration (Node.js/Express)**: Replace the Mock API layer with a real persistent database (PostgreSQL + Prisma) to store workflow templates and execution logs.
2. **Complex Automated Step Actions**: Expand the Automated Steps to simulate real third-party integrations (e.g., Slack notifications, Jira ticket creation) with OAuth mock flows.
3. **LLM-Powered Auto-Fill**: Integrate a Large Language Model to intelligently auto-fill complex node configuration forms and suggest workflow steps based on context.
4. **Node Version History**: Implement a diffing system allowing users to track changes to individual node configurations over time.
5. **Comprehensive E2E Testing**: Add Cypress or Playwright test suites to automate the visual validation of drag-and-drop operations and graph connections.
6. **Undo / Redo Functionality**: Integrate a robust state-history stack allowing users to safely backtrack changes during the design process.

---
