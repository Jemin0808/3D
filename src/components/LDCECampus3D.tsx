import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { CampusBuilding, LDCE_CAMPUS_BUILDINGS, LandmarkTourPoint, CAMPUS_TOUR_STOPS } from '../data/ldceCampusData';

export type LightingMode = 'day' | 'sunset' | 'night';
export type CameraMode = 'orbit' | 'walk' | 'tour';

interface Props {
  selectedBuilding: CampusBuilding | null;
  onSelectBuilding: (building: CampusBuilding | null) => void;
  lightingMode: LightingMode;
  cameraMode: CameraMode;
  onCameraModeChange: (mode: CameraMode) => void;
  activeTourIndex: number;
  onTourIndexChange: (index: number) => void;
  showLabels: boolean;
  showScaleRuler: boolean;
  wireframeMode: boolean;
}

export const LDCECampus3D: React.FC<Props> = ({
  selectedBuilding,
  onSelectBuilding,
  lightingMode,
  cameraMode,
  onCameraModeChange,
  activeTourIndex,
  onTourIndexChange,
  showLabels,
  showScaleRuler,
  wireframeMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const hoveredBuildingIdRef = useRef<string | null>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<CampusBuilding | null>(null);

  // Lighting references
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const streetLightsRef = useRef<THREE.PointLight[]>([]);
  const buildingMaterialsRef = useRef<{
    brick: THREE.MeshStandardMaterial;
    brickAlt: THREE.MeshStandardMaterial;
    concrete: THREE.MeshStandardMaterial;
    glass: THREE.MeshStandardMaterial;
    glassGlowing: THREE.MeshStandardMaterial;
    metal: THREE.MeshStandardMaterial;
    sandstone: THREE.MeshStandardMaterial;
    road: THREE.MeshStandardMaterial;
    grass: THREE.MeshStandardMaterial;
    roof: THREE.MeshStandardMaterial;
  } | null>(null);

  // Controls state
  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbitStateRef = useRef<{
    radius: number;
    theta: number; // azimuthal angle
    phi: number; // polar angle
    target: THREE.Vector3;
  }>({
    radius: 170,
    theta: Math.PI / 4,
    phi: Math.PI / 3.4,
    target: new THREE.Vector3(0, 4, 10),
  });

  // Walk mode state
  const walkStateRef = useRef<{
    position: THREE.Vector3;
    yaw: number;
    pitch: number;
    speed: number;
    keys: { forward: boolean; backward: boolean; left: boolean; right: boolean };
  }>({
    position: new THREE.Vector3(0, 1.8, 140),
    yaw: Math.PI,
    pitch: 0,
    speed: 18,
    keys: { forward: false, backward: false, left: false, right: false },
  });

  // Tour animation target
  const tourLerpRef = useRef<{
    active: boolean;
    startCam: THREE.Vector3;
    targetCam: THREE.Vector3;
    startTarget: THREE.Vector3;
    targetTarget: THREE.Vector3;
    progress: number;
  }>({
    active: false,
    startCam: new THREE.Vector3(),
    targetCam: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    targetTarget: new THREE.Vector3(),
    progress: 1,
  });

  // Tricolor flag wave animation
  const flagMeshRef = useRef<THREE.Mesh | null>(null);

  // Helper to create procedural brick canvas texture fallback if needed
  const createProceduralBrickTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Terracotta brick background
    ctx.fillStyle = '#9b3822';
    ctx.fillRect(0, 0, 512, 512);

    // Brick mortar lines
    ctx.strokeStyle = '#d5c8be';
    ctx.lineWidth = 4;

    const rowH = 16;
    const colW = 32;
    for (let y = 0; y < 512; y += rowH) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();

      const offset = (Math.floor(y / rowH) % 2) * (colW / 2);
      for (let x = offset; x < 512; x += colW) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + rowH);
        ctx.stroke();

        // Subtle noise on bricks
        if (Math.random() > 0.4) {
          ctx.fillStyle = Math.random() > 0.5 ? 'rgba(180, 75, 45, 0.25)' : 'rgba(120, 40, 25, 0.25)';
          ctx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);
        }
      }
    }

    // Concrete band lines every 128px
    ctx.fillStyle = '#a8a29e';
    ctx.fillRect(0, 240, 512, 28);
    ctx.strokeStyle = '#78716c';
    ctx.strokeRect(0, 240, 512, 28);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  // Setup Three.js scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xdbeafe);
    scene.fog = new THREE.FogExp2(0xdbeafe, 0.0035);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.5, 900);
    cameraRef.current = camera;
    camera.position.set(90, 80, 150);
    camera.lookAt(0, 4, 10);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // Load brick texture from generated image
    const textureLoader = new THREE.TextureLoader();
    let brickTex: THREE.Texture;
    try {
      brickTex = textureLoader.load(
        '/src/assets/images/ldce_brick_facade_1791489856184.jpg',
        (tex) => {
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(4, 3);
          tex.colorSpace = THREE.SRGBColorSpace;
        },
        undefined,
        () => {
          // Fallback to procedural texture if loading fails
          brickTex = createProceduralBrickTexture();
          brickTex.repeat.set(6, 4);
        }
      );
      brickTex.wrapS = THREE.RepeatWrapping;
      brickTex.wrapT = THREE.RepeatWrapping;
      brickTex.repeat.set(4, 3);
    } catch {
      brickTex = createProceduralBrickTexture();
      brickTex.repeat.set(6, 4);
    }

    // Materials
    const brickMat = new THREE.MeshStandardMaterial({
      map: brickTex,
      color: 0xcc6045,
      roughness: 0.85,
      metalness: 0.05,
    });

    const brickAltMat = new THREE.MeshStandardMaterial({
      map: brickTex,
      color: 0xb55238,
      roughness: 0.88,
      metalness: 0.04,
    });

    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xd6d3d1,
      roughness: 0.7,
      metalness: 0.1,
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.1,
      metalness: 0.9,
    });

    const glassGlowingMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 0.8,
      roughness: 0.3,
    });

    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.4,
      metalness: 0.8,
    });

    const sandstoneMat = new THREE.MeshStandardMaterial({
      color: 0xc87d55,
      roughness: 0.9,
      metalness: 0.02,
    });

    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.95,
      metalness: 0.05,
    });

    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x3f6212,
      roughness: 0.95,
      metalness: 0.0,
    });

    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x78716c,
      roughness: 0.8,
      metalness: 0.1,
    });

    buildingMaterialsRef.current = {
      brick: brickMat,
      brickAlt: brickAltMat,
      concrete: concreteMat,
      glass: glassMat,
      glassGlowing: glassGlowingMat,
      metal: metalMat,
      sandstone: sandstoneMat,
      road: roadMat,
      grass: grassMat,
      roof: roofMat,
    };

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x334155, 0.4);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
    dirLight.position.set(120, 140, 80);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 400;
    dirLight.shadow.camera.left = -160;
    dirLight.shadow.camera.right = 160;
    dirLight.shadow.camera.top = 160;
    dirLight.shadow.camera.bottom = -160;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Ground Base & Master Terrain
    const groundGeo = new THREE.PlaneGeometry(380, 420);
    const groundMesh = new THREE.Mesh(groundGeo, grassMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -0.05;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Campus Boundary & Outer Roads (Navrangpura / Gujarat University Road)
    const uniRoadGeo = new THREE.PlaneGeometry(360, 24);
    const uniRoad = new THREE.Mesh(uniRoadGeo, roadMat);
    uniRoad.rotation.x = -Math.PI / 2;
    uniRoad.position.set(0, 0.02, 175);
    uniRoad.receiveShadow = true;
    scene.add(uniRoad);

    // Central Campus Boulevard (From Main Gate to Library & Annexe)
    const centralAvenueGeo = new THREE.PlaneGeometry(16, 260);
    const centralAvenue = new THREE.Mesh(centralAvenueGeo, roadMat);
    centralAvenue.rotation.x = -Math.PI / 2;
    centralAvenue.position.set(0, 0.03, 30);
    centralAvenue.receiveShadow = true;
    scene.add(centralAvenue);

    // Cross Boulevards (Connecting East and West Blocks)
    const crossRoad1 = new THREE.Mesh(new THREE.PlaneGeometry(220, 12), roadMat);
    crossRoad1.rotation.x = -Math.PI / 2;
    crossRoad1.position.set(0, 0.03, 70);
    crossRoad1.receiveShadow = true;
    scene.add(crossRoad1);

    const crossRoad2 = new THREE.Mesh(new THREE.PlaneGeometry(220, 12), roadMat);
    crossRoad2.rotation.x = -Math.PI / 2;
    crossRoad2.position.set(0, 0.03, 15);
    crossRoad2.receiveShadow = true;
    scene.add(crossRoad2);

    const crossRoad3 = new THREE.Mesh(new THREE.PlaneGeometry(220, 12), roadMat);
    crossRoad3.rotation.x = -Math.PI / 2;
    crossRoad3.position.set(0, 0.03, -45);
    crossRoad3.receiveShadow = true;
    scene.add(crossRoad3);

    // Pedestrian Walkways & Paving
    const walkwayGeo = new THREE.PlaneGeometry(240, 2);
    const walk1 = new THREE.Mesh(walkwayGeo, concreteMat);
    walk1.rotation.x = -Math.PI / 2;
    walk1.position.set(0, 0.04, 62);
    scene.add(walk1);

    const walk2 = new THREE.Mesh(walkwayGeo, concreteMat);
    walk2.rotation.x = -Math.PI / 2;
    walk2.position.set(0, 0.04, 78);
    scene.add(walk2);

    // Central Lawn in front of Block 1 Admin
    const centralLawnGeo = new THREE.BoxGeometry(34, 0.25, 36);
    const centralLawnMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.9 });
    const centralLawn = new THREE.Mesh(centralLawnGeo, centralLawnMat);
    centralLawn.position.set(0, 0.12, 125);
    centralLawn.receiveShadow = true;
    scene.add(centralLawn);

    // Concrete curb border for central lawn
    const lawnCurbGeo = new THREE.BoxGeometry(36, 0.35, 38);
    const lawnCurbMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 });
    const lawnCurb = new THREE.Mesh(lawnCurbGeo, lawnCurbMat);
    lawnCurb.position.set(0, 0.05, 125);
    scene.add(lawnCurb);

    // Flagpole with Indian Tricolor on central lawn
    const flagPoleGeo = new THREE.CylinderGeometry(0.18, 0.24, 14, 16);
    const flagPole = new THREE.Mesh(flagPoleGeo, metalMat);
    flagPole.position.set(0, 7, 125);
    flagPole.castShadow = true;
    scene.add(flagPole);

    // Tricolor flag geometry
    const flagGeo = new THREE.PlaneGeometry(3.6, 2.2, 10, 6);
    // Create Indian flag texture on canvas
    const flagCanvas = document.createElement('canvas');
    flagCanvas.width = 256;
    flagCanvas.height = 160;
    const fctx = flagCanvas.getContext('2d')!;
    fctx.fillStyle = '#ff9933'; // Saffron
    fctx.fillRect(0, 0, 256, 53);
    fctx.fillStyle = '#ffffff'; // White
    fctx.fillRect(0, 53, 256, 54);
    fctx.fillStyle = '#138808'; // Green
    fctx.fillRect(0, 107, 256, 53);
    // Ashoka Chakra blue circle
    fctx.strokeStyle = '#000080';
    fctx.lineWidth = 3;
    fctx.beginPath();
    fctx.arc(128, 80, 20, 0, Math.PI * 2);
    fctx.stroke();
    for (let i = 0; i < 24; i++) {
      const angle = (i * Math.PI) / 12;
      fctx.beginPath();
      fctx.moveTo(128, 80);
      fctx.lineTo(128 + 20 * Math.cos(angle), 80 + 20 * Math.sin(angle));
      fctx.stroke();
    }
    const flagTex = new THREE.CanvasTexture(flagCanvas);
    const flagMat = new THREE.MeshStandardMaterial({
      map: flagTex,
      side: THREE.DoubleSide,
      roughness: 0.5,
    });
    const flagMesh = new THREE.Mesh(flagGeo, flagMat);
    flagMesh.position.set(1.8, 12.8, 125);
    scene.add(flagMesh);
    flagMeshRef.current = flagMesh;

    // Lampposts with street lights along the central avenue
    const lampPositions = [
      [-9, 150], [9, 150],
      [-9, 100], [9, 100],
      [-9, 50], [9, 50],
      [-9, 0], [9, 0],
      [-9, -40], [9, -40],
      [-9, -80], [9, -80],
    ];

    const streetLights: THREE.PointLight[] = [];
    lampPositions.forEach(([lx, lz]) => {
      // Pole
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 5, 8), metalMat);
      pole.position.set(lx, 2.5, lz);
      pole.castShadow = true;
      scene.add(pole);

      // Light fixture head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 8), new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xfffbeb,
        emissiveIntensity: 0.6,
      }));
      head.position.set(lx, 5.1, lz);
      scene.add(head);

      // Point light
      const pLight = new THREE.PointLight(0xfff1b8, 0, 25);
      pLight.position.set(lx, 5, lz);
      scene.add(pLight);
      streetLights.push(pLight);
    });
    streetLightsRef.current = streetLights;

    // Procedural Campus Trees (Neem, Gulmohar, Banyan)
    const treeTrunkGeo = new THREE.CylinderGeometry(0.35, 0.6, 3.8, 8);
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    const neemFoliageGeo = new THREE.SphereGeometry(2.4, 8, 8);
    const neemMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85 });
    const gulmoharMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.85 }); // Red flowering gulmohar

    const treePositions = [
      // Along avenue
      [-12, 140], [12, 140],
      [-12, 120], [12, 120],
      [-12, 95], [12, 95],
      [-12, 45], [12, 45],
      [-12, 10], [12, 10],
      [-12, -25], [12, -25],
      [-12, -65], [12, -65],
      // Surrounding lawn
      [-18, 125], [18, 125],
      [-18, 115], [18, 115],
      // Near gate
      [-22, 160], [22, 160],
      [-28, 155], [28, 155],
      // Around workshop
      [-90, -45], [-90, -25], [-90, -65],
      // Around sports ground perimeter
      [-145, 10], [-145, 30], [-145, -10],
      [-65, 45], [-65, -25],
      // Near Hostels
      [95, -100], [95, -120], [95, -80],
    ];

    treePositions.forEach(([tx, tz], i) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(tx + (Math.random() - 0.5) * 2, 0, tz + (Math.random() - 0.5) * 2);

      const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
      trunk.position.y = 1.9;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      const foliageMat = i % 4 === 0 ? gulmoharMat : neemMat;
      const foliage = new THREE.Mesh(neemFoliageGeo, foliageMat);
      foliage.position.y = 4.2;
      foliage.scale.set(1 + Math.random() * 0.4, 0.9 + Math.random() * 0.3, 1 + Math.random() * 0.4);
      foliage.castShadow = true;
      treeGroup.add(foliage);

      scene.add(treeGroup);
    });

    // BUILDINGS GENERATION
    const meshesMap = new Map<string, THREE.Group>();

    LDCE_CAMPUS_BUILDINGS.forEach((bldg) => {
      const bldgGroup = new THREE.Group();
      bldgGroup.position.set(bldg.position[0], bldg.position[1], bldg.position[2]);
      if (bldg.rotationY) {
        bldgGroup.rotation.y = bldg.rotationY;
      }
      bldgGroup.name = bldg.id;

      const { width: w, length: l, height: h } = bldg.dimensions;

      if (bldg.id === 'main-gate') {
        // Detailed Main Entrance Gate model
        // Left pillar arch
        const pillarGeo = new THREE.BoxGeometry(4.5, h, 4.5);
        const leftPillar = new THREE.Mesh(pillarGeo, sandstoneMat);
        leftPillar.position.set(-8, h / 2, 0);
        leftPillar.castShadow = true;
        bldgGroup.add(leftPillar);

        const rightPillar = new THREE.Mesh(pillarGeo, sandstoneMat);
        rightPillar.position.set(8, h / 2, 0);
        rightPillar.castShadow = true;
        bldgGroup.add(rightPillar);

        // Central Arch Beam & Cornice
        const archBeamGeo = new THREE.BoxGeometry(22, 2.4, 4.8);
        const archBeam = new THREE.Mesh(archBeamGeo, sandstoneMat);
        archBeam.position.set(0, h - 1.2, 0);
        archBeam.castShadow = true;
        bldgGroup.add(archBeam);

        // Signboard with "L.D. COLLEGE OF ENGINEERING, AHMEDABAD"
        const signCanvas = document.createElement('canvas');
        signCanvas.width = 512;
        signCanvas.height = 96;
        const sctx = signCanvas.getContext('2d')!;
        sctx.fillStyle = '#1e3a8a'; // Institutional navy blue
        sctx.fillRect(0, 0, 512, 96);
        sctx.fillStyle = '#f59e0b'; // Gold border
        sctx.strokeRect(4, 4, 504, 88);
        sctx.fillStyle = '#ffffff';
        sctx.font = 'bold 24px sans-serif';
        sctx.textAlign = 'center';
        sctx.fillText('L.D. COLLEGE OF ENGINEERING', 256, 40);
        sctx.fillStyle = '#fef08a';
        sctx.font = '16px sans-serif';
        sctx.fillText('એલ.ડી. એન્જિનિયરિંગ કોલેજ, અમદાવાદ', 256, 72);
        const signTex = new THREE.CanvasTexture(signCanvas);
        const signMat = new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.3 });
        const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 2.5), signMat);
        signMesh.position.set(0, h - 0.2, 2.5);
        bldgGroup.add(signMesh);

        // Security Gatehouses
        const boothGeo = new THREE.BoxGeometry(6, 4, 6);
        const leftBooth = new THREE.Mesh(boothGeo, brickMat);
        leftBooth.position.set(-14, 2, 0);
        leftBooth.castShadow = true;
        bldgGroup.add(leftBooth);

        const rightBooth = new THREE.Mesh(boothGeo, brickMat);
        rightBooth.position.set(14, 2, 0);
        rightBooth.castShadow = true;
        bldgGroup.add(rightBooth);

      } else if (bldg.id === 'block-6-workshop') {
        // Workshop with industrial Saw-Tooth roof
        // Main base body
        const bodyGeo = new THREE.BoxGeometry(w, h * 0.65, l);
        const bodyMesh = new THREE.Mesh(bodyGeo, brickMat);
        bodyMesh.position.y = (h * 0.65) / 2;
        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;
        bldgGroup.add(bodyMesh);

        // Sawtooth bays on roof
        const numBays = 6;
        const bayLen = l / numBays;
        const bayH = h * 0.35;
        for (let i = 0; i < numBays; i++) {
          const zOffset = -l / 2 + (i + 0.5) * bayLen;
          // Triangular prism representation
          const bayGeo = new THREE.BoxGeometry(w * 0.96, bayH, bayLen * 0.85);
          const bayMesh = new THREE.Mesh(bayGeo, metalMat);
          bayMesh.position.set(0, h * 0.65 + bayH / 2, zOffset);
          bayMesh.castShadow = true;
          bldgGroup.add(bayMesh);

          // Clerestory north-facing glass window strip
          const clerestoryGeo = new THREE.BoxGeometry(w * 0.94, bayH * 0.8, 0.4);
          const clerestory = new THREE.Mesh(clerestoryGeo, glassMat);
          clerestory.position.set(0, h * 0.65 + bayH / 2, zOffset - bayLen * 0.35);
          bldgGroup.add(clerestory);
        }

      } else if (bldg.id === 'block-7-siemens-coe') {
        // Modern Siemens CoE & Computer Department
        // Main brick body with cantilevered glass box
        const mainBody = new THREE.Mesh(new THREE.BoxGeometry(w, h, l), brickMat);
        mainBody.position.y = h / 2;
        mainBody.castShadow = true;
        mainBody.receiveShadow = true;
        bldgGroup.add(mainBody);

        // Prominent horizontal curtain glass ribbon windows
        const numFloors = 3;
        for (let f = 0; f < numFloors; f++) {
          const winH = 2.2;
          const winY = 3.2 + f * 3.8;
          // Front glass ribbon
          const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(w * 0.88, winH, 0.4), glassMat);
          frontGlass.position.set(0, winY, l / 2 + 0.1);
          bldgGroup.add(frontGlass);

          // Horizontal solar louvers
          const louverGeo = new THREE.BoxGeometry(w * 0.9, 0.25, 1.2);
          const louver = new THREE.Mesh(louverGeo, metalMat);
          louver.position.set(0, winY + winH / 2 + 0.2, l / 2 + 0.6);
          bldgGroup.add(louver);
        }

        // Entrance box canopy with "SIEMENS CENTRE OF EXCELLENCE"
        const entryBox = new THREE.Mesh(new THREE.BoxGeometry(18, 4.5, 4), concreteMat);
        entryBox.position.set(0, 2.25, l / 2 + 2);
        entryBox.castShadow = true;
        bldgGroup.add(entryBox);

        // Sign plate
        const coeSignCanvas = document.createElement('canvas');
        coeSignCanvas.width = 512;
        coeSignCanvas.height = 96;
        const cctx = coeSignCanvas.getContext('2d')!;
        cctx.fillStyle = '#0f172a';
        cctx.fillRect(0, 0, 512, 96);
        cctx.fillStyle = '#00a0b0'; // Siemens cyan
        cctx.font = 'bold 28px sans-serif';
        cctx.textAlign = 'center';
        cctx.fillText('SIEMENS', 256, 38);
        cctx.fillStyle = '#ffffff';
        cctx.font = '16px sans-serif';
        cctx.fillText('CENTRE OF EXCELLENCE · COMPUTER DEPT', 256, 72);
        const coeSignTex = new THREE.CanvasTexture(coeSignCanvas);
        const coeSignMat = new THREE.MeshStandardMaterial({ map: coeSignTex, roughness: 0.4 });
        const coeSign = new THREE.Mesh(new THREE.PlaneGeometry(12, 2.2), coeSignMat);
        coeSign.position.set(0, 3, l / 2 + 4.1);
        bldgGroup.add(coeSign);

      } else if (bldg.id === 'sports-ground') {
        // Sports ground: lush turf, clay pitch, boundary rope, pavilion
        // Outer turf oval
        const pitchOval = new THREE.Mesh(
          new THREE.CylinderGeometry(w / 2, w / 2, 0.2, 32),
          new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.9 })
        );
        pitchOval.position.y = 0.1;
        pitchOval.receiveShadow = true;
        bldgGroup.add(pitchOval);

        // Central clay cricket pitch
        const pitchClay = new THREE.Mesh(
          new THREE.BoxGeometry(22, 0.25, 3.6),
          new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.95 })
        );
        pitchClay.position.set(0, 0.15, 0);
        bldgGroup.add(pitchClay);

        // White crease markings & stumps
        const stumps1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.7), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        stumps1.position.set(-10, 0.6, 0);
        bldgGroup.add(stumps1);
        const stumps2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.7), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        stumps2.position.set(10, 0.6, 0);
        bldgGroup.add(stumps2);

        // Spectator Pavilion building
        const pavGeo = new THREE.BoxGeometry(26, 5, 8);
        const pav = new THREE.Mesh(pavGeo, brickMat);
        pav.position.set(0, 2.5, -l / 2 + 4);
        pav.castShadow = true;
        bldgGroup.add(pav);

      } else if (bldg.id === 'block-1-admin') {
        // Main Admin Building: central portico, grand steps, flagpole, wings
        // Central body
        const adminBody = new THREE.Mesh(new THREE.BoxGeometry(w, h, l), brickMat);
        adminBody.position.y = h / 2;
        adminBody.castShadow = true;
        adminBody.receiveShadow = true;
        bldgGroup.add(adminBody);

        // Grand entrance portico
        const porticoGeo = new THREE.BoxGeometry(16, h * 0.9, 6);
        const portico = new THREE.Mesh(porticoGeo, brickAltMat);
        portico.position.set(0, (h * 0.9) / 2, l / 2 + 3);
        portico.castShadow = true;
        bldgGroup.add(portico);

        // Columns under portico
        const colGeo = new THREE.CylinderGeometry(0.5, 0.5, h * 0.85, 12);
        const c1 = new THREE.Mesh(colGeo, concreteMat);
        c1.position.set(-6, (h * 0.85) / 2, l / 2 + 5.5);
        bldgGroup.add(c1);
        const c2 = new THREE.Mesh(colGeo, concreteMat);
        c2.position.set(6, (h * 0.85) / 2, l / 2 + 5.5);
        bldgGroup.add(c2);

        // Concrete parapet band
        const parapet = new THREE.Mesh(new THREE.BoxGeometry(w + 0.8, 1, l + 0.8), concreteMat);
        parapet.position.set(0, h + 0.5, 0);
        bldgGroup.add(parapet);

        // Concrete lintels
        const lintel1 = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.6, l + 0.4), concreteMat);
        lintel1.position.set(0, h * 0.5, 0);
        bldgGroup.add(lintel1);

        // Windows rows
        const numWins = 7;
        const spacing = (w * 0.8) / (numWins - 1);
        for (let i = 0; i < numWins; i++) {
          const wx = -w * 0.4 + i * spacing;
          if (Math.abs(wx) < 7) continue; // skip behind portico
          // Floor 1
          const win1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 0.3), glassMat);
          win1.position.set(wx, 3.5, l / 2 + 0.1);
          bldgGroup.add(win1);
          // Floor 2
          const win2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.2, 0.3), glassMat);
          win2.position.set(wx, 8, l / 2 + 0.1);
          bldgGroup.add(win2);
        }

      } else {
        // Standard academic block (Block 2 Civil, Block 3 Mech, Block 4 Elec, Block 5 Chem, Hostels, Library, etc.)
        // Main massing
        const mainMass = new THREE.Mesh(new THREE.BoxGeometry(w, h, l), brickMat);
        mainMass.position.y = h / 2;
        mainMass.castShadow = true;
        mainMass.receiveShadow = true;
        bldgGroup.add(mainMass);

        // Concrete bands at floor levels
        for (let fl = 1; fl < bldg.floors; fl++) {
          const slabY = (h / bldg.floors) * fl;
          const slab = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.5, l + 0.4), concreteMat);
          slab.position.set(0, slabY, 0);
          bldgGroup.add(slab);
        }

        // Roof parapet
        const roofParapet = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.8, l + 0.4), concreteMat);
        roofParapet.position.set(0, h + 0.4, 0);
        bldgGroup.add(roofParapet);

        // Window bays on front facade with solar chhajjas (louvers)
        const numWinBays = Math.floor(w / 6);
        for (let wb = 0; wb < numWinBays; wb++) {
          const bx = -w / 2 + (wb + 0.5) * (w / numWinBays);
          for (let fl = 0; fl < bldg.floors; fl++) {
            const by = 2.4 + fl * (h / bldg.floors);
            // Window
            const win = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 0.3), glassMat);
            win.position.set(bx, by, l / 2 + 0.1);
            bldgGroup.add(win);

            // Shading chhajja (concrete cantilever)
            const chhajja = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.18, 0.9), concreteMat);
            chhajja.position.set(bx, by + 1.1, l / 2 + 0.45);
            bldgGroup.add(chhajja);
          }
        }

        // Rooftop stairwell / water tank cabin
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(w * 0.2, 2.5, l * 0.2), brickAltMat);
        cabin.position.set(w * 0.3, h + 1.25, -l * 0.2);
        bldgGroup.add(cabin);
      }

      // 3D Tag Marker above building
      const tagCanvas = document.createElement('canvas');
      tagCanvas.width = 256;
      tagCanvas.height = 64;
      const tctx = tagCanvas.getContext('2d')!;
      tctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      tctx.roundRect(4, 4, 248, 56, 12);
      tctx.fill();
      tctx.strokeStyle = '#38bdf8';
      tctx.lineWidth = 2;
      tctx.stroke();
      tctx.fillStyle = '#ffffff';
      tctx.font = 'bold 20px sans-serif';
      tctx.textAlign = 'center';
      tctx.fillText(bldg.code, 128, 38);

      const tagTex = new THREE.CanvasTexture(tagCanvas);
      const tagSpriteMat = new THREE.SpriteMaterial({ map: tagTex, depthTest: false });
      const tagSprite = new THREE.Sprite(tagSpriteMat);
      tagSprite.position.set(0, h + 4.5, 0);
      tagSprite.scale.set(10, 2.5, 1);
      tagSprite.name = `${bldg.id}-label`;
      bldgGroup.add(tagSprite);

      scene.add(bldgGroup);
      meshesMap.set(bldg.id, bldgGroup);
    });

    buildingMeshesRef.current = meshesMap;

    // Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Tricolor flag waving
      if (flagMeshRef.current) {
        const geo = flagMeshRef.current.geometry as THREE.PlaneGeometry;
        const posAttr = geo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          const u = posAttr.getX(i);
          const wave = Math.sin(time * 6 + u * 1.8) * 0.18 * (u / 3.6);
          posAttr.setZ(i, wave);
        }
        posAttr.needsUpdate = true;
      }

      // Camera transitions
      if (cameraMode === 'orbit') {
        const { radius, theta, phi, target } = orbitStateRef.current;
        const camX = target.x + radius * Math.sin(phi) * Math.sin(theta);
        const camY = target.y + radius * Math.cos(phi);
        const camZ = target.z + radius * Math.sin(phi) * Math.cos(theta);
        camera.position.set(camX, camY, camZ);
        camera.lookAt(target);
      } else if (cameraMode === 'walk') {
        const ws = walkStateRef.current;
        const moveVector = new THREE.Vector3();
        if (ws.keys.forward) moveVector.z -= 1;
        if (ws.keys.backward) moveVector.z += 1;
        if (ws.keys.left) moveVector.x -= 1;
        if (ws.keys.right) moveVector.x += 1;
        moveVector.normalize();

        // Rotate movement to camera yaw
        moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), ws.yaw);
        ws.position.addScaledVector(moveVector, ws.speed * delta);

        // Clamp walk boundaries inside campus
        ws.position.x = Math.max(-160, Math.min(160, ws.position.x));
        ws.position.z = Math.max(-180, Math.min(180, ws.position.z));
        ws.position.y = 1.8; // Eye level

        camera.position.copy(ws.position);
        const lookDir = new THREE.Vector3(
          Math.sin(ws.yaw) * Math.cos(ws.pitch),
          Math.sin(ws.pitch),
          Math.cos(ws.yaw) * Math.cos(ws.pitch)
        );
        camera.lookAt(ws.position.clone().add(lookDir));
      } else if (cameraMode === 'tour' && tourLerpRef.current.active) {
        const t = tourLerpRef.current;
        t.progress += delta * 0.8;
        if (t.progress >= 1) {
          t.progress = 1;
          t.active = false;
        }
        // Smooth easeInOutCubic
        const factor = t.progress < 0.5 ? 4 * t.progress * t.progress * t.progress : 1 - Math.pow(-2 * t.progress + 2, 3) / 2;
        camera.position.lerpVectors(t.startCam, t.targetCam, factor);
        const curTarget = new THREE.Vector3().lerpVectors(t.startTarget, t.targetTarget, factor);
        camera.lookAt(curTarget);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  // Update lighting conditions based on selected lighting mode
  useEffect(() => {
    if (!sceneRef.current || !dirLightRef.current || !hemiLightRef.current || !ambientLightRef.current) return;
    const scene = sceneRef.current;
    const dirLight = dirLightRef.current;
    const hemiLight = hemiLightRef.current;
    const ambientLight = ambientLightRef.current;
    const mats = buildingMaterialsRef.current;

    if (lightingMode === 'day') {
      scene.background = new THREE.Color(0xdbeafe);
      scene.fog = new THREE.FogExp2(0xdbeafe, 0.0028);
      dirLight.color.setHex(0xfffbeb);
      dirLight.intensity = 1.8;
      dirLight.position.set(120, 140, 80);
      hemiLight.color.setHex(0xe0f2fe);
      hemiLight.groundColor.setHex(0x334155);
      hemiLight.intensity = 0.55;
      ambientLight.color.setHex(0xffffff);
      ambientLight.intensity = 0.65;

      streetLightsRef.current.forEach((pl) => (pl.intensity = 0));
      if (mats) {
        mats.glass.emissive.setHex(0x000000);
      }
    } else if (lightingMode === 'sunset') {
      // Golden Hour over Ahmedabad
      scene.background = new THREE.Color(0xfdba74);
      scene.fog = new THREE.FogExp2(0xfdba74, 0.0035);
      dirLight.color.setHex(0xf97316);
      dirLight.intensity = 2.4;
      dirLight.position.set(160, 45, 120);
      hemiLight.color.setHex(0xfde047);
      hemiLight.groundColor.setHex(0x7c2d12);
      hemiLight.intensity = 0.7;
      ambientLight.color.setHex(0xffedd5);
      ambientLight.intensity = 0.5;

      streetLightsRef.current.forEach((pl) => (pl.intensity = 6));
      if (mats) {
        mats.glass.emissive.setHex(0xca8a04);
        mats.glass.emissiveIntensity = 0.35;
      }
    } else if (lightingMode === 'night') {
      // Midnight campus
      scene.background = new THREE.Color(0x020617);
      scene.fog = new THREE.FogExp2(0x020617, 0.0045);
      dirLight.color.setHex(0x38bdf8);
      dirLight.intensity = 0.35;
      dirLight.position.set(60, 100, 40);
      hemiLight.color.setHex(0x1e293b);
      hemiLight.groundColor.setHex(0x020617);
      hemiLight.intensity = 0.25;
      ambientLight.color.setHex(0x0f172a);
      ambientLight.intensity = 0.3;

      streetLightsRef.current.forEach((pl) => (pl.intensity = 18));
      if (mats) {
        mats.glass.emissive.setHex(0xfacc15);
        mats.glass.emissiveIntensity = 0.9;
      }
    }
  }, [lightingMode]);

  // Wireframe toggle
  useEffect(() => {
    if (!buildingMaterialsRef.current) return;
    const mats = buildingMaterialsRef.current;
    mats.brick.wireframe = wireframeMode;
    mats.brickAlt.wireframe = wireframeMode;
    mats.concrete.wireframe = wireframeMode;
    mats.sandstone.wireframe = wireframeMode;
  }, [wireframeMode]);

  // Label visibility toggle
  useEffect(() => {
    buildingMeshesRef.current.forEach((bldgGroup, bldgId) => {
      const label = bldgGroup.getObjectByName(`${bldgId}-label`);
      if (label) {
        label.visible = showLabels;
      }
    });
  }, [showLabels]);

  // Selected building highlight
  useEffect(() => {
    buildingMeshesRef.current.forEach((bldgGroup, bldgId) => {
      const isSelected = selectedBuilding?.id === bldgId;
      bldgGroup.position.y = isSelected ? 0.8 : 0;
    });

    if (selectedBuilding && cameraRef.current && cameraMode === 'orbit') {
      // Focus orbit on selected building
      orbitStateRef.current.target.set(
        selectedBuilding.position[0],
        selectedBuilding.position[1] + 4,
        selectedBuilding.position[2]
      );
      orbitStateRef.current.radius = Math.max(50, Math.sqrt(selectedBuilding.dimensions.width ** 2 + selectedBuilding.dimensions.length ** 2) * 1.5);
    }
  }, [selectedBuilding, cameraMode]);

  // Landmark Tour transition trigger
  const triggerTourStop = useCallback((stop: LandmarkTourPoint) => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    tourLerpRef.current = {
      active: true,
      startCam: cam.position.clone(),
      targetCam: new THREE.Vector3(...stop.cameraPosition),
      startTarget: orbitStateRef.current.target.clone(),
      targetTarget: new THREE.Vector3(...stop.targetPosition),
      progress: 0,
    };
    orbitStateRef.current.target.set(...stop.targetPosition);
    const targetBldg = LDCE_CAMPUS_BUILDINGS.find((b) => b.id === stop.buildingId) || null;
    onSelectBuilding(targetBldg);
  }, [onSelectBuilding]);

  useEffect(() => {
    if (cameraMode === 'tour') {
      const stop = CAMPUS_TOUR_STOPS[activeTourIndex];
      if (stop) {
        triggerTourStop(stop);
      }
    }
  }, [activeTourIndex, cameraMode, triggerTourStop]);

  // Raycasting for Mouse Interaction (Click & Hover)
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      const dx = e.clientX - prevMousePosRef.current.x;
      const dy = e.clientY - prevMousePosRef.current.y;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };

      if (cameraMode === 'orbit') {
        const os = orbitStateRef.current;
        os.theta -= dx * 0.007;
        os.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, os.phi - dy * 0.007));
      } else if (cameraMode === 'walk') {
        const ws = walkStateRef.current;
        ws.yaw -= dx * 0.005;
        ws.pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, ws.pitch - dy * 0.005));
      }
      return;
    }

    if (!containerRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    // Collect all building child meshes
    const candidates: THREE.Object3D[] = [];
    buildingMeshesRef.current.forEach((grp) => {
      candidates.push(...grp.children);
    });

    const intersects = raycaster.intersectObjects(candidates, true);
    if (intersects.length > 0) {
      // Find parent building group
      let obj: THREE.Object3D | null = intersects[0].object;
      let matchedBldgId: string | null = null;
      while (obj && obj !== sceneRef.current) {
        if (buildingMeshesRef.current.has(obj.name)) {
          matchedBldgId = obj.name;
          break;
        }
        obj = obj.parent;
      }

      if (matchedBldgId && matchedBldgId !== hoveredBuildingIdRef.current) {
        hoveredBuildingIdRef.current = matchedBldgId;
        const bldg = LDCE_CAMPUS_BUILDINGS.find((b) => b.id === matchedBldgId) || null;
        setHoveredBuilding(bldg);
      }
    } else {
      if (hoveredBuildingIdRef.current) {
        hoveredBuildingIdRef.current = null;
        setHoveredBuilding(null);
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const wasDragging = Math.abs(e.clientX - prevMousePosRef.current.x) > 4 || Math.abs(e.clientY - prevMousePosRef.current.y) > 4;
    isDraggingRef.current = false;

    if (!wasDragging && hoveredBuilding) {
      onSelectBuilding(hoveredBuilding);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (cameraMode === 'orbit') {
      const os = orbitStateRef.current;
      os.radius = Math.max(20, Math.min(320, os.radius + e.deltaY * 0.15));
    }
  };

  // Keyboard navigation for First-Person Walk Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = walkStateRef.current.keys;
      if (e.key === 'w' || e.key === 'ArrowUp') keys.forward = true;
      if (e.key === 's' || e.key === 'ArrowDown') keys.backward = true;
      if (e.key === 'a' || e.key === 'ArrowLeft') keys.left = true;
      if (e.key === 'd' || e.key === 'ArrowRight') keys.right = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keys = walkStateRef.current.keys;
      if (e.key === 'w' || e.key === 'ArrowUp') keys.forward = false;
      if (e.key === 's' || e.key === 'ArrowDown') keys.backward = false;
      if (e.key === 'a' || e.key === 'ArrowLeft') keys.left = false;
      if (e.key === 'd' || e.key === 'ArrowRight') keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none bg-slate-950">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Floating Hover Indicator */}
      {hoveredBuilding && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none z-20 flex items-center gap-2.5 px-4 py-2 bg-slate-950/85 backdrop-blur-md border border-slate-700/60 rounded-xl shadow-xl text-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-semibold text-slate-100">{hoveredBuilding.name}</span>
          <span className="text-slate-400">·</span>
          <span className="text-cyan-300 font-mono">{hoveredBuilding.code}</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-400">{hoveredBuilding.dimensions.width}m × {hoveredBuilding.dimensions.length}m</span>
        </div>
      )}

      {/* Real-World Architectural Scale Ruler */}
      {showScaleRuler && (
        <div className="absolute bottom-6 left-6 z-20 pointer-events-none bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-lg p-3 text-xs text-slate-300">
          <div className="flex items-center justify-between mb-1.5 font-mono text-[11px] text-slate-400">
            <span>0m</span>
            <span>25m</span>
            <span>50m</span>
            <span>100m</span>
          </div>
          <div className="w-48 h-2 bg-slate-800 rounded flex overflow-hidden border border-slate-700">
            <div className="w-1/4 bg-white/90" />
            <div className="w-1/4 bg-slate-900" />
            <div className="w-1/4 bg-white/90" />
            <div className="w-1/4 bg-slate-900" />
          </div>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
            <span>LDCE Campus Scale (1:1 Metric)</span>
            <span className="font-mono text-cyan-400">~60 Acres</span>
          </div>
        </div>
      )}

      {/* Walk mode on-screen virtual d-pad for mobile/touch */}
      {cameraMode === 'walk' && (
        <div className="absolute bottom-6 right-6 z-20 flex flex-col items-center gap-1 bg-slate-900/80 backdrop-blur-md p-2.5 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 font-mono mb-1">WALK CONTROLS</span>
          <button
            onPointerDown={() => (walkStateRef.current.keys.forward = true)}
            onPointerUp={() => (walkStateRef.current.keys.forward = false)}
            className="w-10 h-10 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 rounded-lg text-slate-200 font-bold text-sm"
          >
            ↑
          </button>
          <div className="flex gap-1">
            <button
              onPointerDown={() => (walkStateRef.current.keys.left = true)}
              onPointerUp={() => (walkStateRef.current.keys.left = false)}
              className="w-10 h-10 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 rounded-lg text-slate-200 font-bold text-sm"
            >
              ←
            </button>
            <button
              onPointerDown={() => (walkStateRef.current.keys.backward = true)}
              onPointerUp={() => (walkStateRef.current.keys.backward = false)}
              className="w-10 h-10 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 rounded-lg text-slate-200 font-bold text-sm"
            >
              ↓
            </button>
            <button
              onPointerDown={() => (walkStateRef.current.keys.right = true)}
              onPointerUp={() => (walkStateRef.current.keys.right = false)}
              className="w-10 h-10 bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 rounded-lg text-slate-200 font-bold text-sm"
            >
              →
            </button>
          </div>
          <span className="text-[9px] text-slate-400 mt-1">WASD / Drag Look</span>
        </div>
      )}
    </div>
  );
};
