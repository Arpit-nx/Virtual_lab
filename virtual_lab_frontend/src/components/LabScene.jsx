import React, { useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Plane, ContactShadows, Html } from "@react-three/drei";

// Beaker Component
function Beaker({ position, liquid, color, label }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, -0.75 + liquid / 2, 0]}>
        <cylinderGeometry args={[0.45, 0.45, liquid, 32]} />
        <meshStandardMaterial color={color} transparent opacity={0.6} />
      </mesh>
      <Html position={[0, 1, 0]}>
        <div>{label}</div>
      </Html>
    </group>
  );
}

// Bubbles Component
function Bubbles({ position }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color="white" transparent opacity={0.8} />
    </mesh>
  );
}

// Scene Component (Contains 3D logic and useFrame)
function Scene({ liquidBeaker1, setLiquidBeaker1, liquidBeaker2, setLiquidBeaker2, beakerColor, pouring, bubbles }) {
  useFrame(() => {
    if (pouring && liquidBeaker1 >= 0.02) {
      setLiquidBeaker1((prev) => prev - 0.02);
      setLiquidBeaker2((prev) => (prev + 0.02 <= 2.0 ? prev + 0.02 : prev));
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      <Plane rotation={[-Math.PI / 2, 0, 0]} args={[10, 10]} receiveShadow>
        <meshStandardMaterial color="lightgray" />
      </Plane>
      <ContactShadows position={[0, -0.49, 0]} opacity={0.5} width={10} height={10} blur={1} />
      <Beaker position={[-1, 0.75, 0]} liquid={liquidBeaker1} color={beakerColor.hcl} label="HCl" />
      <Beaker position={[1, 0.75, 0]} liquid={liquidBeaker2} color={beakerColor.naoh} label="NaOH" />
      {bubbles.map((bubble, i) => (
        <Bubbles key={i} position={bubble.position} />
      ))}
      <OrbitControls />
    </>
  );
}

// Main LabScene Component
function LabScene() {
  const [liquidBeaker1, setLiquidBeaker1] = useState(1.0); // HCl
  const [liquidBeaker2, setLiquidBeaker2] = useState(1.0); // NaOH
  const [beakerColor, setBeakerColor] = useState({ hcl: "blue", naoh: "red" });
  const [reactionResult, setReactionResult] = useState("");
  const [pouring, setPouring] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  const [experimentId, setExperimentId] = useState(null);

  useEffect(() => {
    // Fetch chemical data
    fetch("http://127.0.0.1:5000/api/chemicals", { mode: "cors" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((chemicals) => {
        const hcl = chemicals.find((c) => c.formula === "HCl") || { properties: { color: "blue" } };
        const naoh = chemicals.find((c) => c.formula === "NaOH") || { properties: { color: "red" } };
        setBeakerColor({ hcl: hcl.properties.color, naoh: naoh.properties.color });
      })
      .catch((err) => console.error("Failed to fetch chemicals:", err));

    // Start experiment
    fetch("http://127.0.0.1:5000/api/experiments/start", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "HCl + NaOH Neutralization" }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setExperimentId(data.experiment_id))
      .catch((err) => console.error("Failed to start experiment:", err));
  }, []);

  const startPouring = () => setPouring(true);
  const stopPouring = () => setPouring(false);

  const performReaction = async () => {
    if (liquidBeaker1 > 0 && liquidBeaker2 > 0) {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/experiments/react", {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hcl_volume: liquidBeaker1, naoh_volume: liquidBeaker2 }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        setLiquidBeaker1(data.remaining_hcl);
        setLiquidBeaker2(data.remaining_naoh);
        setBeakerColor({ hcl: data.color, naoh: data.color });
        setReactionResult(data.result);

        // Add bubbles for 2 seconds
        const newBubbles = Array(10)
          .fill()
          .map(() => ({
            position: [Math.random() * 0.8 - 0.4, Math.random() * liquidBeaker2 - 0.75, Math.random() * 0.8 - 0.4],
          }));
        setBubbles(newBubbles);
        setTimeout(() => setBubbles([]), 2000);

        // Save experiment
        await fetch("http://127.0.0.1:5000/api/experiments/save", {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            experiment_id: experimentId,
            steps: [{ hcl_volume: liquidBeaker1, naoh_volume: liquidBeaker2, result: data.result }],
          }),
        });

        // Get explanation from Gemini
        const chatResponse = await fetch("http://127.0.0.1:5000/chatbot", {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: `Explain this: ${data.result}` }),
        });
        if (!chatResponse.ok) throw new Error(`HTTP error! status: ${chatResponse.status}`);
        const chatData = await chatResponse.json();
        setReactionResult(`${data.result}\n\n${chatData.reply}`);
      } catch (err) {
        console.error("Reaction error:", err);
        setReactionResult("Error during reaction!");
      }
    } else {
      setReactionResult("Not enough liquid for reaction!");
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <Canvas shadows camera={{ position: [0, 3, 5], fov: 75 }}>
        <Scene
          liquidBeaker1={liquidBeaker1}
          setLiquidBeaker1={setLiquidBeaker1}
          liquidBeaker2={liquidBeaker2}
          setLiquidBeaker2={setLiquidBeaker2}
          beakerColor={beakerColor}
          pouring={pouring}
          bubbles={bubbles}
        />
      </Canvas>
      <div style={buttonContainerStyle}>
        <button onMouseDown={startPouring} onMouseUp={stopPouring} style={buttonStyle}>
          Pour
        </button>
        <button onClick={performReaction} style={buttonStyle}>
          Mix & React
        </button>
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
  whiteSpace: "pre-wrap",
};

export default LabScene;
