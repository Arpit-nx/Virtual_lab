import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EquipmentPanel from "./EquipmentPanel";

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex justify-center items-center h-screen">
        <EquipmentPanel />
        
      </div>
    </DndProvider>
  );
}

export default App;
