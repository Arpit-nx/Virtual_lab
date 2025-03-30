

// import React, { useState } from "react";
// import { useDrag, useDrop, DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import { FaFlask, FaVial, FaTint, FaFunnelDollar, FaPencilRuler, FaThermometer, FaBalanceScale, FaSyringe } from "react-icons/fa";

// const ItemTypes = {
//   EQUIPMENT: "equipment",
// };

// const equipmentList = [
//   { id: "beaker", name: "Beaker", icon: <FaFlask /> },
//   { id: "test-tube", name: "Test Tube", icon: <FaVial /> },
//   { id: "burette", name: "Burette", icon: <FaTint /> },
//   { id: "funnel", name: "Funnel", icon: <FaFunnelDollar /> },
//   { id: "pipette", name: "Pipette", icon: <FaSyringe /> },
//   { id: "glass-rod", name: "Glass Rod", icon: <FaPencilRuler /> },
//   { id: "ph-indicator", name: "pH Indicator", icon: <FaThermometer /> },
//   { id: "measuring-cylinder", name: "Measuring Cylinder", icon: <FaBalanceScale /> },
// ];

// const DraggableItem = ({ item }) => {
//   const [{ isDragging }, drag] = useDrag(() => ({
//     type: ItemTypes.EQUIPMENT,
//     item,
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   }));

//   return (
//     <li ref={drag} style={{ ...listItemStyle, opacity: isDragging ? 0.5 : 1 }}>
//       {item.icon}
//     </li>
//   );
// };

// const DropZone = () => {
//   const [droppedItems, setDroppedItems] = useState([]);

//   const [, drop] = useDrop(() => ({
//     accept: ItemTypes.EQUIPMENT,
//     drop: (item) => setDroppedItems((prev) => [...prev, item]),
//   }));

//   return (
//     <div ref={drop} style={dropZoneStyle}>
//       {droppedItems.map((item, index) => (
//         <div key={index} style={droppedItemStyle}>{item.icon}</div>
//       ))}
//     </div>
//   );
// };

// const ExperimentMenu = () => {
//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div style={menuStyle}>
//         <h3 style={{ color: "white" }}>Equipments</h3>
//         <ul style={listStyle}>
//           {equipmentList.map((item) => (
//             <DraggableItem key={item.id} item={item} />
//           ))}
//         </ul>
//       </div>
//       <DropZone />
//     </DndProvider>
//   );
// };

// // Styling
// const menuStyle = {
//   width: "200px",
//   padding: "10px",
//   backgroundColor: "black",
//   borderRight: "1px solid #ddd",
//   height: "100vh",
// };

// const listStyle = {
//   listStyle: "none",
//   padding: 0,
//   display: "grid",
//   gridTemplateColumns: "repeat(2, 1fr)",
//   gap: "10px",
// };

// const listItemStyle = {
//   padding: "10px",
//   cursor: "grab",
//   borderRadius: "10px",
//   backgroundColor: "grey",
//   textAlign: "center",
//   fontSize: "24px",
// };

// const dropZoneStyle = {
//   width: "300px",
//   height: "300px",
//   border: "2px dashed gray",
//   margin: "20px",
//   display: "flex",
//   flexWrap: "wrap",
//   gap: "10px",
//   justifyContent: "center",
//   alignItems: "center",
// };

// const droppedItemStyle = {
//   fontSize: "24px",
// };

// export default ExperimentMenu;

import React from "react";
import { useDrag } from "react-dnd";
import { FaFlask, FaVial, FaTint, FaFunnelDollar, FaPencilRuler, FaThermometer, FaBalanceScale, FaSyringe } from "react-icons/fa";

const ItemTypes = {
  EQUIPMENT: "equipment",
};

const equipmentList = [
  { id: "beaker", name: "Beaker", icon: <FaFlask /> },
  { id: "test-tube", name: "Test Tube", icon: <FaVial /> },
  { id: "burette", name: "Burette", icon: <FaTint /> },
  { id: "funnel", name: "Funnel", icon: <FaFunnelDollar /> },
  { id: "pipette", name: "Pipette", icon: <FaSyringe /> },
  { id: "glass-rod", name: "Glass Rod", icon: <FaPencilRuler /> },
  { id: "ph-indicator", name: "pH Indicator", icon: <FaThermometer /> },
  { id: "measuring-cylinder", name: "Measuring Cylinder", icon: <FaBalanceScale /> },
];

const DraggableItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.EQUIPMENT,
    item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <li ref={drag} style={{ ...listItemStyle, opacity: isDragging ? 0.5 : 1 }}>
      {item.icon}
    </li>
  );
};

const ExperimentMenu = () => {
  return (
    <div style={menuStyle}>
      <h3 style={{ color: "white" }}>Equipments</h3>
      <ul style={listStyle}>
        {equipmentList.map((item) => (
          <DraggableItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
};

// Styling
const menuStyle = {
  width: "200px",
  padding: "10px",
  backgroundColor: "black",
  borderRight: "1px solid #ddd",
  height: "100vh",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "10px",
};

const listItemStyle = {
  padding: "10px",
  cursor: "grab",
  borderRadius: "10px",
  backgroundColor: "grey",
  textAlign: "center",
  fontSize: "24px",
};

// These are kept for reference but not currently used
const dropZoneStyle = {
  width: "300px",
  height: "300px",
  border: "2px dashed gray",
  margin: "20px",
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  justifyContent: "center",
  alignItems: "center",
};

const droppedItemStyle = {
  fontSize: "24px",
  cursor: "pointer",
};

export default ExperimentMenu;