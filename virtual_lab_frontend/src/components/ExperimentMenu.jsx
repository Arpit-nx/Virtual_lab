import React from "react";

function ExperimentMenu({ addEquipment }) {
  const equipmentList = [
    "Beaker",
    "Test Tube",
    "Burette",
    "Funnel",
    "Pipette",
    "Glass Rod",
    "pH Indicator",
    "Measuring Cylinder",
  ];

  return (
    <div style={menuStyle}>
      <h3>Equipments</h3>
      <ul style={listStyle}>
        {equipmentList.map((item) => (
          <li key={item} style={listItemStyle} onClick={() => addEquipment(item)}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Styling
const menuStyle = {
  width: "200px",
  padding: "10px",
  background: "#f8f9fa",
  borderRight: "1px solid #ddd",
  height: "100vh",
};

const listStyle = {
  listStyle: "none",
  padding: 0,
};

const listItemStyle = {
  padding: "10px",
  cursor: "pointer",
  borderBottom: "1px solid #ddd",
  backgroundColor: "#e0e0e0",
  margin: "5px 0",
  textAlign: "center",
};

export default ExperimentMenu;
