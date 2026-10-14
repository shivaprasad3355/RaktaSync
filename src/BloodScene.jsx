import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

  
function BloodDrop() {
  const drop = useRef();

  useFrame((state, delta) => {
    if (!drop.current) return;

    drop.current.rotation.y += delta * 0.25;

    drop.current.rotation.x = THREE.MathUtils.damp(
      drop.current.rotation.x,
      state.pointer.y * 0.08,
      3,
      delta
    );
  });

  return (
    <group ref={drop} position={[0, 0, 0]}>
      {/* Outer red glow */}
      <mesh scale={[1.12, 1.12, 1.12]}>
        <sphereGeometry args={[0.72, 48, 48]} />
        <meshBasicMaterial
          color="#ff003c"
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Main glossy blood drop */}
      <mesh position={[0, -0.12, 0]} scale={[1, 1.12, 0.72]}>
        <sphereGeometry args={[0.68, 64, 64]} />
        <meshPhysicalMaterial
          color="#b00025"
          metalness={0.18}
          roughness={0.16}
          clearcoat={1}
          clearcoatRoughness={0.08}
          emissive="#700018"
          emissiveIntensity={0.45}
        />
      </mesh>

      {/* Pointed upper tip */}
      <mesh position={[0, 0.72, 0]} rotation={[0, 0, Math.PI]}>
        <coneGeometry args={[0.34, 0.88, 48]} />
        <meshPhysicalMaterial
          color="#e00032"
          metalness={0.12}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.08}
          emissive="#9c0025"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* Bright highlight */}
      <mesh position={[-0.22, 0.1, 0.49]} scale={[0.09, 0.22, 0.035]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#ffd5df"
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Heart symbol */}
      <mesh position={[0, 0.02, 0.51]}>
        <torusGeometry args={[0.15, 0.025, 12, 48]} />
        <meshBasicMaterial color="#fff0f4" />
      </mesh>

      {/* Bottom red rim */}
      <pointLight
        position={[0, -0.2, 1.5]}
        color="#ff123f"
        intensity={2}
        distance={4}
      />
    </group>
  );
}


function SceneContents() {
  const particles = useRef();

  useFrame((state, delta) => {
    if (!particles.current) return;

    particles.current.rotation.y += delta * 0.025;
    particles.current.rotation.x = THREE.MathUtils.damp(
      particles.current.rotation.x,
      state.pointer.y * 0.12,
      3,
      delta
    );
  });

  return (
    <>
      {/* Keep the canvas transparent so the CSS background shows through. */}
      <fog attach="fog" args={["#080508", 6, 14]} />

      <ambientLight intensity={0.8} />

      <pointLight
        position={[2, 3, 4]}
        intensity={30}
        distance={12}
        color="#ff2448"
      />

      <pointLight
        position={[-3, 0, 2]}
        intensity={20}
        distance={10}
        color="#9d0027"
      />

      <pointLight
        position={[0, -2, -3]}
        intensity={15}
        distance={10}
        color="#ff102e"
      />

      
      {/* Cinematic red rim light */}
      <spotLight
        position={[-3, 1, -2]}
        intensity={35}
        angle={0.7}
        penumbra={1}
        distance={12}
        color="#ff003c"
      />

      {/* Soft white highlight on the glossy surface */}
      <pointLight
        position={[-1, 2, 3]}
        intensity={8}
        distance={7}
        color="#ffd6df"
      />


      <Stars
        radius={30}
        depth={20}
        count={500}
        factor={2}
        saturation={0}
        fade
        speed={0.3}
      />

      <group ref={particles}>
        {Array.from({ length: 65 }, (_, i) => {
          const angle = i * 2.399;
          const radius = 1.8 + (i % 7) * 0.24;

          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                ((i * 17) % 40) / 10 - 2,
                Math.sin(angle) * radius - 0.5,
              ]}
            >
              <sphereGeometry
                args={[0.018 + (i % 3) * 0.008, 8, 8]}
              />
              <meshBasicMaterial
                color={i % 3 === 0 ? "#ff2448" : "#7c1029"}
              />
            </mesh>
          );
        })}
      </group>

      <BloodDrop />
    </>
  );
}

export default function BloodScene() {
  return (
    <div className="webgl-scene" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <SceneContents />
      </Canvas>
    </div>
  );
}