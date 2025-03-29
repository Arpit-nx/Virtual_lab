import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Plane, ContactShadows, Html } from "@react-three/drei";

// Beaker Component
function Beaker({ position, liquid, color }) {
  return (
    <group position={position}>
      {/* Beaker Body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>

      {/* Liquid Inside Beaker */}
      <mesh position={[0, -0.75 + liquid / 2, 0]}>
        <cylinderGeometry args={[0.45, 0.45, liquid, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function LabScene() {
  const [liquidBeaker1, setLiquidBeaker1] = useState(1.0); // Full HCl
  const [liquidBeaker2, setLiquidBeaker2] = useState(1.0); // Full NaOH
  const [reactionData, setReactionData] = useState(null);
  const [reactionResult, setReactionResult] = useState("");
  const [beakerColor, setBeakerColor] = useState({ hcl: "blue", naoh: "red" });

  useEffect(() => {
    // Fetch Experiment Data from Flask
    fetch("http://127.0.0.1:5000/experiment/HCl%20%2B%20NaOH%20Neutralization")
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error fetching experiment:", data.error);
        } else {
          setReactionData(data);
        }
      })
      .catch((error) => console.error("Request failed:", error));
  }, []);

  // Function to transfer liquid from Beaker 1 → Beaker 2
  const transferLiquid = () => {
    if (liquidBeaker1 >= 0.2) {
      setLiquidBeaker1((prev) => prev - 0.2);
      setLiquidBeaker2((prev) => (prev + 0.2 <= 2.0 ? prev + 0.2 : 2.0)); // Prevent overflow
    }
  };

  // Function to perform reaction
  const performReaction = () => {
    if (liquidBeaker1 > 0 && liquidBeaker2 > 0) {
      const reactionVolume = Math.min(liquidBeaker1, liquidBeaker2);
      setLiquidBeaker1((prev) => prev - reactionVolume);
      setLiquidBeaker2((prev) => prev - reactionVolume);

      // Change color to green to indicate neutralization
      setBeakerColor({ hcl: "green", naoh: "green" });

      // Show Reaction Result
      const reactionText = reactionData?.observations?.[0] || "Reaction Complete: Salt and Water formed!";
      setReactionResult(reactionText);
    } else {
      setReactionResult("Not enough liquid for reaction!");
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <Canvas shadows camera={{ position: [0, 3, 5], fov: 75 }}>
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />

        {/* Floor */}
        <Plane rotation={[-Math.PI / 2, 0, 0]} args={[10, 10]} receiveShadow>
          <meshStandardMaterial color="lightgray" />
        </Plane>

        {/* Shadows */}
        <ContactShadows position={[0, -0.49, 0]} opacity={0.5} width={10} height={10} blur={1} />

        {/* Beakers */}
        <Beaker position={[-1, 0.75, 0]} liquid={liquidBeaker1} color={beakerColor.hcl} />
        <Beaker position={[1, 0.75, 0]} liquid={liquidBeaker2} color={beakerColor.naoh} />

        {/* Controls */}
        <OrbitControls />
      </Canvas>

      {/* Buttons and Result Display */}
      <div style={buttonContainerStyle}>
        <button onClick={transferLiquid} style={buttonStyle}>Pour</button>
        <button onClick={performReaction} style={buttonStyle}>Mix & React</button>
        {reactionResult && <p style={resultStyle}>{reactionResult}</p>}
      </div>
    </div>
  );
}

// Styling
const buttonContainerStyle = {
  position: "absolute",
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const buttonStyle = {
  padding: "10px",
  fontSize: "16px",
  background: "#16a085",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
  margin: "5px",
};

const resultStyle = {
  marginTop: "10px",
  color: "black",
  fontSize: "16px",
  fontWeight: "bold",
};

export default LabScene;
