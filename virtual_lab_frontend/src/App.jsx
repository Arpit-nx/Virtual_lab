import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ExperimentMenu from "./components/ExperimentMenu";
import LabScene from "./components/LabScene";
import Instructions from "./components/Instructions";
import Chatbot from "./components/Chatbot";
import "./App.css";
import EquipmentPanel from "./components/EquipmentalPanel";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <aside className="menu">
          <ExperimentMenu />
        </aside>
        <main className="lab-view">
          <LabScene />
          <EquipmentPanel />
        </main>
        <section className="instructions">
          <Instructions />
        </section>

        {/* AI Chatbot at Bottom Right */}
        <Chatbot />
      </div>
    </DndProvider>
  );
}

export default App;