import React, { useState, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { FlaskRound, TestTube, Beaker } from "lucide-react";

const ItemTypes = {
  EQUIPMENT: "equipment",
};

const equipmentIcons = {
  flask: FlaskRound,
  "test-tube": TestTube,
  beaker: Beaker,
};

const DraggableItem = ({ id, icon: Icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.EQUIPMENT,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <button
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab" }}
      className="p-2 border rounded bg-white shadow-md"
    >
      <Icon size={32} />
    </button>
  );
};

const Liquid = ({ color, position }) => (
  <mesh position={position}>
    <cylinderGeometry args={[0.4, 0.4, 0.5, 32]} />
    <meshStandardMaterial color={color} transparent opacity={0.8} />
  </mesh>
);

const Beaker3D = ({ position, liquidLevel, onPour }) => (
  <mesh position={position} onClick={onPour}>
    <cylinderGeometry args={[0.5, 0.5, 1.5, 32]} />
    <meshStandardMaterial color="white" transparent opacity={0.8} />
    {liquidLevel > 0 && <Liquid color="blue" position={[0, -0.4 + liquidLevel, 0]} />}
  </mesh>
);

const TestTube3D = ({ position, liquidLevel, onPour }) => (
  <mesh position={position} onClick={onPour}>
    <cylinderGeometry args={[0.2, 0.2, 1, 32]} />
    <meshStandardMaterial color="blue" />
    {liquidLevel > 0 && <Liquid color="blue" position={[0, -0.3 + liquidLevel, 0]} />}
  </mesh>
);

const Flask3D = ({ position, liquidLevel, onPour }) => (
  <mesh position={position} onClick={onPour}>
    <coneGeometry args={[0.6, 1.2, 32]} />
    <meshStandardMaterial color="red" />
    {liquidLevel > 0 && <Liquid color="red" position={[0, -0.5 + liquidLevel, 0]} />}
  </mesh>
);

const objectMapping = {
  flask: Flask3D,
  "test-tube": TestTube3D,
  beaker: Beaker3D,
};

const DropZone = () => {
  const [droppedItems, setDroppedItems] = useState([]);

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.EQUIPMENT,
    drop: (item, monitor) => {
      if (monitor) {
        setDroppedItems((prev) => [
          ...prev,
          { id: item.id, position: [Math.random() * 2 - 1, 0, Math.random() * 2 - 1], liquidLevel: 0.3 },
        ]);
      }
    },
  }));

  const handlePouring = (fromIndex, toIndex) => {
    setDroppedItems((prev) => {
      const updated = [...prev];
      if (updated[fromIndex].liquidLevel > 0) {
        updated[fromIndex] = { ...updated[fromIndex], liquidLevel: Math.max(0, updated[fromIndex].liquidLevel - 0.1) };
        updated[toIndex] = { ...updated[toIndex], liquidLevel: Math.min(1, updated[toIndex].liquidLevel + 0.1) };
      }
      return updated;
    });
  };

  return (
    <div ref={drop} className="relative w-full h-60 border-dashed border-2 border-gray-500 bg-gray-100 flex justify-center items-center">
      <Canvas style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={0.5} />
        <OrbitControls />
        {droppedItems.map((item, index) => {
          const Component = objectMapping[item.id];
          return Component ? (
            <Component
              key={index}
              position={item.position}
              liquidLevel={item.liquidLevel}
              onPour={() => {
                if (droppedItems.length > 1) {
                  handlePouring(index, (index + 1) % droppedItems.length);
                }
              }}
            />
          ) : null;
        })}
      </Canvas>
    </div>
  );
};

const EquipmentPanel = () => {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch("/api/equipment");
        const data = await response.json();
        setEquipment(data);
      } catch (error) {
        console.error("Error fetching equipment:", error);
        setEquipment([
          { id: "flask", icon: "flask" },
          { id: "test-tube", icon: "test-tube" },
          { id: "beaker", icon: "beaker" },
        ]);
      }
    };
    fetchEquipment();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {equipment.map((item) => {
          const IconComponent = equipmentIcons[item.icon];
          return IconComponent ? <DraggableItem key={item.id} id={item.id} icon={IconComponent} /> : null;
        })}
      </div>
      <DropZone />
    </div>
  );
};
export default EquipmentPanel;