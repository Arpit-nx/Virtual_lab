import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Plane, ContactShadows, Html } from "@react-three/drei";

function Beaker({ position, liquid, setLiquid, color, onPour }) {
  const [selected, setSelected] = useState(false);

  // Handle clicking to pour
  const handleClick = () => {
    if (liquid > 0.2) {
      setLiquid((prev) => prev - 0.2); // Reduce liquid in this beaker
      onPour(0.2); // Add liquid to the other beaker
    }
  };

  return (
    <group position={position}>
      {/* Beaker Body */}
      <mesh
        onPointerDown={() => setSelected(true)}
        onPointerUp={() => setSelected(false)}
        onClick={handleClick} // Click to pour
        castShadow
      >
        <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
        <meshStandardMaterial color={selected ? "red" : "white"} transparent opacity={0.8} />
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
  const [liquidBeaker1, setLiquidBeaker1] = useState(1.0); // Full
  const [liquidBeaker2, setLiquidBeaker2] = useState(0.3); // Partially filled

  // Function to transfer liquid from Beaker 1 → Beaker 2
  const transferLiquid = () => {
    if (liquidBeaker1 >= 0.2) {
      setLiquidBeaker1((prev) => prev - 0.2);
      setLiquidBeaker2((prev) => (prev + 0.2 <= 1.2 ? prev + 0.2 : 1.2)); // Prevent overflow
    }
  };

  return (
    <Canvas shadows camera={{ position: [0, 3, 5], fov: 75 }}>
      {/* Soft Ambient Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />

      {/* Floor with Shadows */}
      <Plane rotation={[-Math.PI / 2, 0, 0]} args={[10, 10]} receiveShadow>
        <meshStandardMaterial color="lightgray" />
      </Plane>

      {/* Realistic Contact Shadows */}
      <ContactShadows position={[0, -0.49, 0]} opacity={0.5} width={10} height={10} blur={1} />

      {/* Beakers */}
      <Beaker position={[-1, 0.75, 0]} liquid={liquidBeaker1} setLiquid={setLiquidBeaker1} color="blue" onPour={setLiquidBeaker2} />
      <Beaker position={[1, 0.75, 0]} liquid={liquidBeaker2} setLiquid={setLiquidBeaker2} color="red" onPour={setLiquidBeaker1} />

      {/* Transfer Button Inside Scene */}
      <Html position={[0, 2, 0]}>
        <button onClick={transferLiquid} style={buttonStyle}>Transfer Liquid</button>
      </Html>

      {/* Camera Controls */}
      <OrbitControls />
    </Canvas>
  );
}

// Styling for Button
const buttonStyle = {
  position: "absolute",
  padding: "10px",
  fontSize: "16px",
  background: "#16a085",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
};

export default LabScene;