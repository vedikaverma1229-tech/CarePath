import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const HeartHero3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [viewStyle, setViewStyle] = useState<'sculpted' | 'crystalline'>('sculpted');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      console.warn('WebGL initialization failed:', err);
      setHasWebGLError(true);
      return;
    }

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 460;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 4.6);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- Modern Heart Materials with refined user palette #E85D6A & #FFF5F6 ---
    const primaryHeartMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E85D6A'), // Primary Light Red
      emissive: new THREE.Color('#781A1A'),
      emissiveIntensity: 0.16,
      roughness: 0.22,
      metalness: 0.08,
      clearcoat: 0.65,
      clearcoatRoughness: 0.15,
      sheen: 0.7,
      sheenColor: new THREE.Color('#FFF5F6'), // Soft Rose sheen
      reflectivity: 0.8,
    });

    const wireframeHeartMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#E85D6A'),
      emissive: new THREE.Color('#FDECEF'),
      emissiveIntensity: 0.4,
      wireframe: true,
      roughness: 0.3,
    });

    const vesselMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#C94150'), // Primary Dark for vessels
      roughness: 0.3,
      metalness: 0.12,
      clearcoat: 0.4,
    });

    const glowingVeinMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#FDECEF'),
      emissive: new THREE.Color('#E85D6A'),
      emissiveIntensity: 0.7,
      roughness: 0.3,
    });

    // --- Parametric Cardioid Organic Heart Geometry ---
    // Smooth 3D cardioid volume: x = 16 sin^3(t), y = 13 cos(t) - 5 cos(2t)...
    const createParametricHeartGeometry = () => {
      const uSteps = 56;
      const vSteps = 40;
      const positions: number[] = [];
      const indices: number[] = [];
      const normals: number[] = [];
      const uvs: number[] = [];

      for (let j = 0; j <= vSteps; j++) {
        const v = (j / vSteps) * Math.PI; // 0 to PI (latitude)
        const sinV = Math.sin(v);
        const cosV = Math.cos(v);

        for (let i = 0; i <= uSteps; i++) {
          const u = (i / uSteps) * Math.PI * 2; // 0 to 2PI (longitude)
          const sinU = Math.sin(u);
          const cosU = Math.cos(u);

          // Cardioid curve base
          const baseScale = 0.082;
          const hx = 16 * Math.pow(sinU, 3);
          const hy = 13 * cosU - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u);
          
          // Thickness modulated by sin(v) and position
          const depthScale = 0.78 * (1 - 0.25 * cosU);
          const hz = 10 * cosV * sinU * depthScale;

          const x = hx * baseScale * sinV;
          const y = hy * baseScale + 0.15;
          const z = hz * baseScale * 0.9;

          positions.push(x, y, z);
          uvs.push(i / uSteps, j / vSteps);
        }
      }

      for (let j = 0; j < vSteps; j++) {
        for (let i = 0; i < uSteps; i++) {
          const a = j * (uSteps + 1) + i;
          const b = a + 1;
          const c = (j + 1) * (uSteps + 1) + i;
          const d = c + 1;
          indices.push(a, c, b);
          indices.push(b, c, d);
        }
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geom.setIndex(indices);
      geom.computeVertexNormals();
      return geom;
    };

    const heartGeom = createParametricHeartGeometry();
    const mainHeartMesh = new THREE.Mesh(heartGeom, primaryHeartMaterial);
    rootGroup.add(mainHeartMesh);

    // --- Superior Aorta Arch & Branches ---
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.06, 0.45, 0.08),
      new THREE.Vector3(0.04, 0.95, 0.1),
      new THREE.Vector3(0.3, 1.25, 0.0),
      new THREE.Vector3(0.55, 1.1, -0.2),
      new THREE.Vector3(0.6, 0.7, -0.32),
    ]);
    const aortaMesh = new THREE.Mesh(
      new THREE.TubeGeometry(aortaCurve, 32, 0.14, 16, false),
      vesselMaterial
    );
    rootGroup.add(aortaMesh);

    // Three Brachiocephalic branch tubes
    const branch1Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.12, 1.15, 0.06),
      new THREE.Vector3(0.1, 1.48, 0.1),
    ]);
    rootGroup.add(new THREE.Mesh(new THREE.TubeGeometry(branch1Curve, 10, 0.05, 10, false), vesselMaterial));

    const branch2Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.26, 1.24, 0.01),
      new THREE.Vector3(0.28, 1.54, 0.04),
    ]);
    rootGroup.add(new THREE.Mesh(new THREE.TubeGeometry(branch2Curve, 10, 0.045, 10, false), vesselMaterial));

    const branch3Curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.42, 1.2, -0.06),
      new THREE.Vector3(0.48, 1.5, -0.08),
    ]);
    rootGroup.add(new THREE.Mesh(new THREE.TubeGeometry(branch3Curve, 10, 0.04, 10, false), vesselMaterial));

    // Pulmonary arterial bridge
    const pulmonaryCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.1, 0.45, 0.22),
      new THREE.Vector3(-0.16, 0.85, 0.18),
      new THREE.Vector3(-0.45, 1.0, -0.02),
    ]);
    rootGroup.add(new THREE.Mesh(new THREE.TubeGeometry(pulmonaryCurve, 24, 0.12, 14, false), vesselMaterial));

    // Luminous Coronary Sulcus Line
    const sulcusCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.02, 0.55, 0.48),
      new THREE.Vector3(0.04, 0.18, 0.52),
      new THREE.Vector3(0.02, -0.25, 0.4),
      new THREE.Vector3(-0.01, -0.65, 0.2),
    ]);
    const sulcusMesh = new THREE.Mesh(
      new THREE.TubeGeometry(sulcusCurve, 24, 0.028, 8, false),
      glowingVeinMaterial
    );
    rootGroup.add(sulcusMesh);

    // --- Orbiting Cardiovascular Energy Ring (Glow Halo) ---
    const ringCurve = new THREE.EllipseCurve(0, 0, 1.55, 1.55, 0, 2 * Math.PI, false, 0);
    const ringPoints = ringCurve.getPoints(64);
    const ringGeometry = new THREE.BufferGeometry().setFromPoints(
      ringPoints.map((p) => new THREE.Vector3(p.x, 0, p.y))
    );
    const ringMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color('#F4B6B6'),
      transparent: true,
      opacity: 0.5,
    });
    const orbitRing = new THREE.Line(ringGeometry, ringMaterial);
    orbitRing.rotation.x = Math.PI / 3.2;
    orbitRing.rotation.z = Math.PI / 6;
    scene.add(orbitRing);

    // Floating Rose Particles around the heart
    const particleCount = 36;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.4 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      particlePositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi);
      particlePositions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color('#F4B6B6'),
      size: 0.05,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Studio 3-Point Lighting with #D94A4A & #F4B6B6 Atmosphere ---
    const ambientLight = new THREE.AmbientLight(0xFFF1F1, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFFFFF, 2.8);
    keyLight.position.set(3, 4, 3.5);
    scene.add(keyLight);

    const roseRimLight = new THREE.DirectionalLight(0xF4B6B6, 3.5);
    roseRimLight.position.set(-3.5, 2.5, -2.5);
    scene.add(roseRimLight);

    const innerCoreLight = new THREE.PointLight(0xD94A4A, 2.6, 3.5);
    innerCoreLight.position.set(0, 0, 0.3);
    scene.add(innerCoreLight);

    // --- Interactive Mouse & Touch Drag Controls ---
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.009;
        targetRotationX += deltaY * 0.009;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousemove', handleMouseMove);
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
      }
    };
    domElement.addEventListener('touchmove', handleTouchMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 460;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Physiological double-beat contraction curve
      const beatCycle = (t * 1.15) % 1.0;
      let pulseScale = 1.0;
      if (beatCycle < 0.12) {
        pulseScale = 1.0 + Math.sin((beatCycle / 0.12) * Math.PI) * 0.085;
      } else if (beatCycle >= 0.16 && beatCycle < 0.28) {
        pulseScale = 1.0 + Math.sin(((beatCycle - 0.16) / 0.12) * Math.PI) * 0.05;
      }

      // Smooth hover damping & gentle floating
      targetRotationY += (mouseX * 0.3 - targetRotationY) * 0.05;
      targetRotationX += (-mouseY * 0.2 - targetRotationX) * 0.05;

      rootGroup.position.y = Math.sin(t * 1.1) * 0.07;
      rootGroup.rotation.y = targetRotationY + Math.sin(t * 0.35) * 0.18;
      rootGroup.rotation.x = targetRotationX + Math.cos(t * 0.45) * 0.06;
      rootGroup.rotation.z = Math.sin(t * 0.5) * 0.03;

      rootGroup.scale.set(pulseScale, pulseScale, pulseScale);

      // Rotate orbit ring and particles
      orbitRing.rotation.y = t * 0.12;
      particles.rotation.y = t * 0.05;

      // Pulse core lighting with systolic rhythm
      innerCoreLight.intensity = 2.2 + (pulseScale - 1.0) * 9.0;
      roseRimLight.intensity = 3.0 + (pulseScale - 1.0) * 6.0;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('mousemove', handleMouseMove);
      domElement.removeEventListener('mousedown', handleMouseDown);
      domElement.removeEventListener('touchmove', handleTouchMove);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Exact Soft Rose #F4B6B6 Heart Glow specified in color table */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl animate-pulseGlow"
          style={{ backgroundColor: '#F4B6B6', opacity: 0.45 }}
        />
        <div
          className="w-52 h-52 rounded-full blur-2xl"
          style={{ backgroundColor: '#D94A4A', opacity: 0.18 }}
        />
      </div>

      {/* 3D WebGL Canvas */}
      {!hasWebGLError ? (
        <div
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
          title="CarePath 3D Interactive Heart — Drag to inspect"
        />
      ) : (
        /* Fallback */
        <div className="relative z-10 flex flex-col items-center justify-center p-8">
          <div className="relative w-48 h-48 flex items-center justify-center animate-pulse">
            <svg
              viewBox="0 0 24 24"
              fill="#E85D6A"
              className="w-36 h-36 drop-shadow-[0_12px_24px_rgba(232,93,106,0.3)]"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <span
            className="mt-3 text-xs font-semibold px-3 py-1 rounded-full border"
            style={{ backgroundColor: '#FDECEF', color: '#E85D6A', borderColor: '#FDECEF' }}
          >
            3D Heart Active
          </span>
        </div>
      )}

      {/* Subtle Hint */}
      <div
        className={`absolute bottom-3 right-4 z-20 text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-opacity duration-300 pointer-events-none shadow-xs ${
          isHovered ? 'opacity-90' : 'opacity-40'
        }`}
        style={{
          backgroundColor: '#FFFFFF',
          color: '#202124',
          borderColor: '#EDEDED',
        }}
      >
        Interactive 3D Heart · Drag to rotate
      </div>
    </div>
  );
};
