import React from "react";
import ExperimentMenu from "./components/ExperimentMenu";
import LabScene from "./components/LabScene";
import Instructions from "./components/Instructions";
import Chatbot from "./components/Chatbot"; // Importing the chatbot
import "./App.css";
import EquipmentPanel from "./components/EquipmentalPanel";

function App() {
  return (
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
  );
}

export default App;
