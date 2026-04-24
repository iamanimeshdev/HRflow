# ⚡ Tredence — HR Workflow Designer

> Design, configure, validate, and simulate complex HR logic flows with intuitive hotkeys and drag-and-drop.

<div align="center">

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

<div align="center">

[![Canvas Designer](https://github.com/user-attachments/assets/e44b66ce-4f15-494e-8a79-38c40de3bf50)](https://github.com/user-attachments/assets/e44b66ce-4f15-494e-8a79-38c40de3bf50)&nbsp;&nbsp;[![Live Simulation](https://github.com/user-attachments/assets/b30759ee-a0a6-4e67-b4d8-d4ef846b9877)](https://github.com/user-attachments/assets/b30759ee-a0a6-4e67-b4d8-d4ef846b9877)

</div>

A premium, interactive Visual Workflow Designer built for HR administrators to construct, configure, validate, and simulate complex operational workflows (e.g., employee onboarding, document verification, leave approvals). It features an intuitive, state-of-the-art drag-and-drop interface supercharged with keyboard shortcuts (hotkeys), intelligent auto-alignment, dynamic edge styling, and a sleek dark/light mode aesthetic for a true enterprise SaaS experience.

---

## 🚀 Quick Start (How to Run)

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

##  Architecture Overview

The application is built with a heavy focus on **modularity, scalability, and separation of concerns**.

- **Frontend Framework:** React 18 + Vite
- **Language:** TypeScript
- **Canvas Engine:** React Flow / xyflow
- **State Management:** Zustand (for a lightweight, unopinionated, and highly scalable global store, bypassing React Context re-render traps)
- **Styling:** Tailwind CSS v4

### Folder Structure
- **`src/components/Canvas/`** — Core graph implementation, drag-and-drop orchestration, and connection routing.
- **`src/components/ConfigPanel/`** — Dynamic, data-driven side-panel forms that render inputs conditionally based on the active node type.
- **`src/nodes/`** — Decoupled React components defining the custom visual presentation, handles, and logic for each node type (Start, Task, Approval, Automated, End).
- **`src/hooks/`** — Custom hooks (`useWorkflowStore.ts`, `useValidation.ts`) isolating complex business logic and state mutations from presentation components.
- **`src/utils/`** — Helper functions for graph serialization, JSON parsing, and validation schemas.

---

##  Design Decisions

1. **Zustand over Context API** — Graph state (nodes, edges, selection) updates frequently. React Context would trigger global re-renders. Zustand allows atomic, selector-based state subscriptions, ensuring only modified nodes re-render.
2. **Decoupled Node Logic** — Each custom node in `src/nodes/` is self-contained. Adding a new node type (e.g., "Wait Node") requires simply creating a new component and registering it, satisfying the Open-Closed Principle.
3. **Dynamic Forms Component** — The Config Panel dynamically resolves the required form fields based on the selected node's `type` and `data` schema. This prevents monolithic `switch` statements and makes the UI highly extensible.
4. **Graph-based Validation Engine** — Workflows are validated by traversing the graph (edges/nodes) to detect disjointed graphs, missing configurations, and missing Start/End caps before simulation.
5. **Dark/Light Mode Premium UI** — Opted for a smooth dark and light mode theme to emulate professional tools, enhancing user experience and reducing eye strain for professionals building complex workflows.

---

##  Completed Deliverables

### Core Requirements Fully Implemented
- [x] **React Flow Canvas** — Drag-and-drop interface with dynamic edge routing.
- [x] **Custom Node Types** — Start, Task (Human), Approval (Manager), Automated Step (System), and End Nodes.
- [x] **Node Editing / Configuration Forms** — Context-aware property panel for editing node-specific metadata, assignees, actions, and parameters.
- [x] **Mock API Layer** — Integrated local simulation that validates graph structure and outputs a step-by-step execution log.
- [x] **Workflow Simulator / Sandbox** — A dedicated panel that serializes the active graph, validates constraints, and runs a visual execution simulation.

### Bonus Objectives (Completed)
- [x] **Export/Import as JSON** — Save workflows to disk and restore them flawlessly, demonstrating complex graph state serialization.
- [x] **Mini-map & Zoom Controls** — Comprehensive viewport control system for navigating massive, complex HR workflows effortlessly.
- [x] **Visual Validation Errors** — Highlights disconnected or improperly configured nodes directly on the canvas in real-time.
- [x] **Keyboard Shortcuts (Hotkeys)** — Rapid workflow management hotkeys, enhancing accessibility and speed.
- [x] **Layout Configuration** — Horizontal or Vertical orientation choice via a glassmorphism modal on canvas launch.
- [x] **Auto-Align Utility** — Single-click alignment that respects the user's layout selection and intelligently tidies the graph.
- [x] **Light/Dark Mode Overhaul** — Enhanced light mode visibility with a dotted background grid, contrasting with the dark mode's OLED-optimized design.

---

##  What I Would Add With More Time

I prioritized core architecture, smooth interactions, and robust state management. With additional time, I would implement:

1. **Backend Integration (Node.js/Express)** — Replace the Mock API layer with a real persistent database (PostgreSQL + Prisma) to store workflow templates and execution logs.
2. **Complex Automated Step Actions** — Expand Automated Steps to simulate real third-party integrations (e.g., Slack notifications, Jira ticket creation) with OAuth mock flows.
3. **LLM-Powered Auto-Fill** — Integrate a Large Language Model to intelligently auto-fill complex node configuration forms and suggest workflow steps based on context.
4. **Node Version History** — A diffing system allowing users to track changes to individual node configurations over time.
5. **Comprehensive E2E Testing** — Cypress or Playwright test suites to automate visual validation of drag-and-drop operations and graph connections.

---
