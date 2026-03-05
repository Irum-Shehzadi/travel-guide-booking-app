import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";

// Floating location markers on the globe
function LocationMarker({ position, label, delay = 0 }) {
    const ref = useRef();
    const glowRef = useRef();

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() + delay;
        if (ref.current) {
            ref.current.scale.setScalar(1 + Math.sin(t * 2) * 0.15);
        }
        if (glowRef.current) {
            glowRef.current.material.opacity = 0.4 + Math.sin(t * 3) * 0.3;
        }
    });

    return (
        <group position={position}>
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial color="#60a5fa" transparent opacity={0.4} />
            </mesh>
            <mesh ref={ref}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>
            <Html distanceFactor={5} position={[0, 0.12, 0]}>
                <div style={{
                    color: "#e0f2fe",
                    fontSize: "10px",
                    fontWeight: "600",
                    textShadow: "0 0 8px rgba(96, 165, 250, 0.8)",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    fontFamily: "'Inter', sans-serif"
                }}>
                    {label}
                </div>
            </Html>
        </group>
    );
}

// Particle field around globe
function ParticleField({ count = 200 }) {
    const ref = useRef();
    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 2.5 + Math.random() * 2;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        return positions;
    }, [count]);

    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.rotation.y = clock.getElapsedTime() * 0.02;
            ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.01) * 0.1;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.015}
                color="#60a5fa"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

// The main globe mesh
function GlobeMesh() {
    const globeRef = useRef();
    const atmosphereRef = useRef();
    const wireframeRef = useRef();

    const atmosphereMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true,
        });
    }, []);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (globeRef.current) {
            globeRef.current.rotation.y = t * 0.15;
        }
        if (wireframeRef.current) {
            wireframeRef.current.rotation.y = t * 0.15;
        }
        if (atmosphereRef.current) {
            atmosphereRef.current.rotation.y = t * 0.1;
        }
    });

    const locations = [
        { lat: 33.6844, lng: 73.0479, label: "Islamabad" },
        { lat: 35.8819, lng: 74.4643, label: "Hunza" },
        { lat: 35.3206, lng: 75.5551, label: "Skardu" },
        { lat: 34.0151, lng: 71.5249, label: "Peshawar" },
        { lat: 25.3960, lng: 68.3578, label: "Mohenjo Daro" },
        { lat: 30.3753, lng: 69.3451, label: "Quetta" },
    ];

    const latLngToVector3 = (lat, lng, radius = 1.52) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        return [
            -(radius * Math.sin(phi) * Math.cos(theta)),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta),
        ];
    };

    return (
        <group>
            <Sphere ref={globeRef} args={[1.5, 64, 64]}>
                <meshPhongMaterial
                    color="#1e3a5f"
                    transparent
                    opacity={0.85}
                    shininess={50}
                />
            </Sphere>

            <Sphere ref={wireframeRef} args={[1.52, 32, 32]}>
                <meshBasicMaterial
                    color="#3b82f6"
                    wireframe
                    transparent
                    opacity={0.15}
                />
            </Sphere>

            <mesh ref={atmosphereRef} material={atmosphereMaterial}>
                <sphereGeometry args={[1.8, 64, 64]} />
            </mesh>

            {locations.map((loc, i) => (
                <LocationMarker
                    key={loc.label}
                    position={latLngToVector3(loc.lat, loc.lng)}
                    label={loc.label}
                    delay={i * 0.5}
                />
            ))}
        </group>
    );
}

const Globe3D = () => {
    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            <Canvas
                camera={{ position: [0, 0, 4.5], fov: 45 }}
                style={{ background: "transparent" }}
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={0.3} />
                <directionalLight position={[5, 3, 5]} intensity={1} color="#ffffff" />
                <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#3b82f6" />
                <pointLight position={[0, 0, 5]} intensity={0.5} color="#60a5fa" />

                <GlobeMesh />
                <ParticleField count={300} />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={(2 * Math.PI) / 3}
                />
            </Canvas>
        </div>
    );
};

export default Globe3D;
