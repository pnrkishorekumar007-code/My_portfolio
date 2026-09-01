import { useMemo, useState, useRef, useEffect } from 'react';
import { useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import '../shaders/RevealMaterial';
import { isTouchDevice } from '../../../utils/deviceDetect';
/**
 * CorridorDecorations - Dekoracje korytarza.
 * 
 * Proste pÅ‚askie plane'y z teksturami - styl rysunkowy 2D w Å›wiecie 3D.
 * 
 * Korytarz (per segment, 80 units):
 *   Drzwi: relZ -18 (left), -32 (right), -48 (left), -62 (right)
 *   corridorWidth: ~3.5 per side
 *   corridorHeight: 3.5
 *   Bezpieczne strefy dekoracji: -5 do -15, -20 do -30, -34 do -46, -50 do -60, -64 do -75
 */

// Globalne zmienne dla useFrame, aby uniknÄ…Ä‡ alokacji pamiÄ™ci w kaÅ¼dej klatce i zapobiec Å›cinkom (GC stalls)
const tempPos = new THREE.Vector3();
const tempRot = new THREE.Quaternion();
const tempScale = new THREE.Vector3();
const tempCamDir = new THREE.Vector3();
const tempEuler = new THREE.Euler();
const tempQuat = new THREE.Quaternion();


const CABIN_SKETCH_URL = '/fonts/CabinSketch-Regular.woff';

const PictureContent = ({ imagePath, imagePaintedPath, width, height, isPainted }) => {
    const texture = useTexture(imagePath);
    // Render nothing if no painted path, but we still call the hook unconditionally to respect hook rules
    const paintedTexture = useTexture(imagePaintedPath || imagePath);

    const materialRef = useRef();

    useEffect(() => {
        if (!materialRef.current || !imagePaintedPath) return;

        if (isPainted) {
            gsap.to(materialRef.current, {
                uProgress: 1.0,
                duration: 0.8,
                ease: 'power2.out',
                overwrite: true
            });
        } else {
            gsap.to(materialRef.current, {
                uProgress: 0.0,
                duration: 0.5,
                ease: 'power2.out',
                overwrite: true
            });
        }
    }, [isPainted, imagePaintedPath]);

    return (
        <group position={[0, 0, 0.01]}> {/* Lekko przed ramkÄ… */}
            {imagePaintedPath && (
                <mesh position={[0, 0, -0.001]}>
                    <planeGeometry args={[width, height]} />
                    <meshBasicMaterial color="#fcf3c6"
                        map={paintedTexture}
                        transparent={true}
                        alphaTest={0.5}
                        side={THREE.DoubleSide}
                        roughness={0.9}
                    />
                </mesh>
            )}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[width, height]} />
                {imagePaintedPath ? (
                    <revealMaterial color="#fcf3c6"
                        ref={materialRef}
                        map={texture}
                        transparent={true}
                        alphaTest={0.1}
                        side={THREE.DoubleSide}
                        roughness={0.9}
                        uProgress={0.0}
                    />
                ) : (
                    <meshBasicMaterial color="#fcf3c6"
                        map={texture}
                        transparent={true}
                        alphaTest={0.1} // KLUCZOWE: Naprawia przezroczystoÅ›Ä‡ (wycina tÅ‚o)
                        side={THREE.DoubleSide}
                        roughness={0.5}
                    />
                )}
            </mesh>
        </group>
    );
};

const InspectableFrame = ({ frame, wallX, frameTexture, framePaintedTexture, CABIN_SKETCH_URL, setCameraOverride }) => {
    const { camera, viewport } = useThree();
    const groupRef = useRef();
    const frameMaterialRef = useRef();
    const framePaintedRef = useRef();
    const compileFramesRef = useRef(0);
    const hideDelayRef = useRef();

    // Zapisujemy oryginalnÄ… pozycjÄ™ i rotacjÄ™ na Å›cianie
    const originalPos = useMemo(() => new THREE.Vector3(
        frame.side === 'left' ? -wallX + (frame.offsetFromWall || 0) : wallX - (frame.offsetFromWall || 0),
        frame.y,
        frame.z
    ), [frame, wallX]);

    const originalRot = useMemo(() => new THREE.Euler(
        0, frame.side === 'left' ? Math.PI / 2 : -Math.PI / 2, 0
    ), [frame.side]);

    const [isHovered, setIsHovered] = useState(false);
    const [isInspected, setIsInspected] = useState(false);

    // Sprawdzamy czy to urzÄ…dzenie dotykowe (telefon/tablet) by caÅ‚kowicie wyÅ‚Ä…czyÄ‡ efekt hover i podnieÅ›Ä‡ wydajnoÅ›Ä‡
    const isTouch = useMemo(() => isTouchDevice(), []);
    // Zostawiamy teÅ¼ stary mechanizm Å¼eby odÅ‚Ä…czyÄ‡ na ekstremalnie wÄ…skich ekranach w ogÃ³le inspected
    const isMobile = viewport.width < 5 || viewport.aspect < 0.8 || isTouch;

    // Kiedy komponent znika, na wszelki wypadek wyÅ‚Ä…czamy override
    useEffect(() => {
        return () => {
            if (isInspected) {
                if (setCameraOverride) setCameraOverride(false);
                window.dispatchEvent(new CustomEvent('inspectChange', { detail: false }));
            }
        };
    }, [isInspected, setCameraOverride]);

    useEffect(() => {
        if (isHovered && !isMobile) document.body.style.cursor = 'pointer';
        else document.body.style.cursor = 'auto';
    }, [isHovered, isMobile]);

    useEffect(() => {
        if (!frameMaterialRef.current) return;

        const shouldBePainted = isHovered || isInspected;

        if (shouldBePainted) {
            if (hideDelayRef.current) hideDelayRef.current.kill();
            if (framePaintedRef.current) framePaintedRef.current.visible = true;

            gsap.to(frameMaterialRef.current, {
                uProgress: 1.0,
                duration: 0.8,
                ease: 'power2.out',
                overwrite: true
            });
        } else {
            gsap.to(frameMaterialRef.current, {
                uProgress: 0.0,
                duration: 0.5,
                ease: 'power2.out',
                overwrite: true
            });

            hideDelayRef.current = gsap.delayedCall(0.55, () => {
                if (framePaintedRef.current) framePaintedRef.current.visible = false;
            });
        }

        return () => {
            if (hideDelayRef.current) hideDelayRef.current.kill();
        };
    }, [isHovered, isInspected]);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        if (compileFramesRef.current < 2) {
            compileFramesRef.current++;
            if (compileFramesRef.current === 2) {
                if (!isHovered && !isInspected && framePaintedRef.current) {
                    framePaintedRef.current.visible = false;
                }
            }
        }

        if (isInspected) {
            // Pozycja przed kamerÄ… (bliÅ¼ej)
            camera.getWorldDirection(tempCamDir);

            // Obliczamy responsywny dystans (fluid responsive)
            // Gdy aspekt (szerokoÅ›Ä‡/wysokoÅ›Ä‡) jest mniejszy (wÄ…skie ekrany np. laptopy max 1.3), odsuwamy obraz dalej (np. 2.2)
            // Gdy aspekt jest duÅ¼y (ultrawide, 16:9 ~ 1.77), przysuwamy obraz bliÅ¼ej (np. 1.5)
            // clamp(1.5, 2.8)
            const baseDistance = 1.3;
            // Im mniejszy aspekt (wÄ™Å¼szy ekran), tym wiÄ™ksza odlegÅ‚oÅ›Ä‡
            const aspectOffset = Math.max(0, 1.8 - viewport.aspect) * 1.5;
            const distance = Math.min(2.8, Math.max(1.5, baseDistance + aspectOffset));

            // Punkt tuÅ¼ przed kamerÄ… (zwiÄ™kszony dynamicznie - im wiÄ™cej, tym dalej)
            tempPos.copy(camera.position).add(tempCamDir.multiplyScalar(distance));

            // Rotacja zwracajÄ…ca obraz bezpoÅ›rednio do kamery
            tempRot.copy(camera.quaternion);

            // Efekt "3D Karty" na podstawie myszki
            const tiltX = -state.pointer.y * 0.3;
            const tiltY = state.pointer.x * 0.3;
            tempEuler.set(tiltX, tiltY, 0);
            tempQuat.setFromEuler(tempEuler);

            tempRot.multiply(tempQuat);

            // Lekko powiÄ™kszamy obraz dla detalu
            tempScale.set(1.2, 1.2, 1.2);
        } else {
            // PowrÃ³t na Å›cianÄ™
            tempPos.copy(originalPos);
            tempRot.setFromEuler(originalRot);
            tempScale.set(1, 1, 1);
        }

        // PÅ‚ynna interpolacja (lerp/slerp) w kaÅ¼dym oknie renderowania
        const factor = delta * 6;
        groupRef.current.position.lerp(tempPos, factor);
        groupRef.current.quaternion.slerp(tempRot, factor);
        groupRef.current.scale.lerp(tempScale, factor);
    });

    return (
        <group
            ref={groupRef}
            position={originalPos}
            rotation={originalRot}
        >
            {/* INVISIBLE HITBOX to catch pointer events smoothly and prevent raycaster from jumping between meshes */}
            <mesh
                position={[0, 0, 0.05]}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isMobile) return; // CaÅ‚kowite wyÅ‚Ä…czenie na mobile
                    setIsInspected((prev) => {
                        const next = !prev;
                        if (setCameraOverride) setCameraOverride(next); // Blokowanie / odblokowanie poruszania kamerÄ…
                        window.dispatchEvent(new CustomEvent('inspectChange', { detail: next }));
                        return next;
                    });
                    setIsHovered(false);
                }}
                onPointerEnter={(e) => {
                    e.stopPropagation();
                    if (!isInspected && !isMobile) setIsHovered(true);
                }}
                onPointerLeave={(e) => {
                    e.stopPropagation();
                    setIsHovered(false);
                }}
            >
                <planeGeometry args={[frame.width, frame.height]} />
                <meshBasicMaterial color="#fcf3c6" transparent opacity={0} depthWrite={false} />
            </mesh>

            {/* RAMKA PAINTED (behind sketch) */}
            {!isTouch && (
                <mesh ref={framePaintedRef} position={[0, 0, -0.001]} scale={[0.98, 0.98, 1]}>
                    <planeGeometry args={[frame.width, frame.height]} />
                    <meshBasicMaterial color="#fcf3c6"
                        map={framePaintedTexture}
                        transparent={true}
                        alphaTest={0.5}
                        side={THREE.DoubleSide}
                        roughness={0.9}
                    />
                </mesh>
            )}

            {/* RAMKA SKETCH OVERLAY (front) */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[frame.width, frame.height]} />
                <revealMaterial color="#fcf3c6"
                    ref={frameMaterialRef}
                    map={frameTexture}
                    transparent={true}
                    alphaTest={0.1}
                    side={THREE.DoubleSide}
                    roughness={0.9}
                    uProgress={0.0}
                />
            </mesh>

            {/* OBRAZEK WEWNÄ„TRZ */}
            {frame.image && (
                <PictureContent
                    imagePath={frame.image}
                    imagePaintedPath={!isTouch ? frame.imagePainted : null}
                    width={frame.imageWidth || frame.width * 0.7}
                    height={frame.imageHeight || frame.height * 0.7}
                    isPainted={isHovered || isInspected}
                />
            )}

            {/* PODPIS */}
            {frame.signature && (
                <Text
                    position={[
                        frame.signatureX !== undefined ? frame.signatureX : (frame.width / 2 - 0.1),
                        frame.signatureY !== undefined ? frame.signatureY : (-frame.height / 2 + 0.15),
                        0.02
                    ]}
                    fontSize={frame.signatureSize || 0.12}
                    maxWidth={frame.width * 0.8} // Safety net: keep signatures inside their frame
                    textAlign="center"
                    font={CABIN_SKETCH_URL}
                    color={frame.signatureColor || "#333333"}
                    anchorX="center"
                    anchorY="middle"
                >
                    {frame.signature}
                </Text>
            )}
        </group>
    );
};

const CorridorDecorations = ({ segmentLength, zOffset, corridorWidth = 4, corridorHeight = 3.5, zClip = 100000, setCameraOverride }) => {

    const wallX = corridorWidth / 2 - 0.01;
    const floorY = -corridorHeight / 2;
    const ceilingY = corridorHeight / 2;

    // =============================================
    // TEKSTURY DEKORACJI
    // =============================================
    const frameTexture = useTexture('/textures/corridor/ramkanazdjecieduza.webp');
    const framePaintedTexture = useTexture('/textures/corridor/ramkanazdjecieduza_painted.webp');
    const standingFrameTexture = useTexture('/textures/corridor/ramkanazdjeciemala.webp');
    const treeTexture = useTexture('/textures/corridor/drzewkowdoniczce.webp');
    const grateTexture = useTexture('/textures/corridor/kratkawentylacyjna.webp');
    const flowerTexture = useTexture('/textures/corridor/kwiatekwdoniczce.webp');

    // --- Ceiling Lights (punkty Å›wiatÅ‚a) ---
    // Tekstury lamp
    const lampGrilleTexture = useTexture('/textures/corridor/kratanalampy.webp');
    // lampGrilleTexture.wrapS = lampGrilleTexture.wrapT = THREE.RepeatWrapping; 
    // lampGrilleTexture.repeat.set(1, 1);

    const lampSideTexture = useTexture('/textures/corridor/bokilampy.webp');
    lampSideTexture.wrapS = lampSideTexture.wrapT = THREE.RepeatWrapping;
    // Dopasowanie UV dla dÅ‚ugiego boku
    lampSideTexture.repeat.set(1, 1);

    const lights = useMemo(() => {
        const items = [];
        // ===== REGULACJA ÅšWIATEÅ =====
        const LIGHT_SPACING = 15;      // OdstÄ™p miÄ™dzy lampami
        const LIGHT_START_OFFSET = -5;  // Start z zapasem od poczÄ…tku (bo tam sÄ… drzwi poprzedniego segmentu)

        const startZ = zOffset + LIGHT_START_OFFSET;
        const endZ = zOffset - segmentLength + 10; // Zapas od koÅ„ca (SegmentDoors jest na -75)

        for (let z = startZ; z > endZ; z -= LIGHT_SPACING) {
            items.push({ z });
        }
        return items;
    }, [segmentLength, zOffset]);

    // =============================================
    // RAMKI NA ZDJÄ˜CIA (PICTURE FRAMES)
    // =============================================
    // PÅ‚askie plane'y na Å›cianach z teksturÄ… ramki.
    // WewnÄ…trz ramki moÅ¼na pÃ³Åºniej dodaÄ‡ plakaty/zdjÄ™cia.
    //
    // USTAWIENIA DO RÄ˜CZNEJ REGULACJI:
    // - z: pozycja Z (gdzie na osi korytarza), obliczana jako zOffset - wartoÅ›Ä‡
    // - side: 'left' lub 'right'
    // - width/height: rozmiar ramki
    // - y: pozycja Y (wysokoÅ›Ä‡ na Å›cianie, 0 = Å›rodek)
    const frames = useMemo(() => [
        {
            z: zOffset - 10,         // MiÄ™dzy startem a Gallery (relZ -5 do -15)
            side: 'right',
            width: 2.5,              // SzerokoÅ›Ä‡ ramki
            height: 2.5 / 1.785,     // Legacy ratio 3200x1792
            y: 0.3,                  // WysokoÅ›Ä‡ na Å›cianie
            id: 'frame-1',
            // Custom setup for "rysuneknaobraz1.png"
            image: '/textures/corridor/rysuneknaobraz1.webp',
            imageWidth: 1.1,
            imageHeight: 1.1,
            offsetFromWall: 0.1, // PrzesuniÄ™cie bliÅ¼ej Å›rodka korytarza (0.1 unit)
        },
        {
            z: zOffset - 25,         // MiÄ™dzy Gallery a Studio (relZ -20 do -30)
            side: 'left',
            width: 2.5,
            height: 2.5 / 1.785,
            y: 0.2,
            id: 'frame-2',
            image: '/textures/corridor/rysuneknaobrazek3.webp',
            imageWidth: 1.7,
            imageHeight: 1,
            offsetFromWall: 0.1
        },
        {
            z: zOffset - 40,         // MiÄ™dzy Studio a About (relZ -34 do -46)
            side: 'right',
            width: 2.5,
            height: 2.5 / 1.785,
            y: 0.25,
            id: 'frame-3',
            signature: "Empty canvas!\nWant your art here?\nContact me!",
            signatureX: 0,
            signatureY: 0,
            signatureSize: 0.12,
            signatureColor: '#333333'
        },
        {
            z: zOffset - 55,         // MiÄ™dzy About a Connect (relZ -50 do -60)
            side: 'left',
            width: 2.5,
            height: 2.5 / 1.785,
            y: 0.35,
            id: 'frame-4',
            signature: "Empty canvas!\nWant your art here?\nContact me!",
            signatureX: 0,
            signatureY: 0,
            signatureSize: 0.12,
            signatureColor: '#333333'
        },
    ], [zOffset]);

    // =============================================
    // STOLIK (TABLE)
    // =============================================
    const woodTexture = useTexture('/textures/corridor/texturadrewnadonozekbiurka.webp');
    const tableTopTexture = useTexture('/textures/corridor/gorastolika.webp');

    // Tekstury szafki
    const cabinetFrontTexture = useTexture('/textures/corridor/szafkaprzod.webp');
    const cabinetRestTexture = useTexture('/textures/corridor/szafkaprzodgora.webp');

    // Klonujemy teksturÄ™ dla nÃ³g, Å¼eby jÄ… obrÃ³ciÄ‡ (bo user mÃ³wi Å¼e jest poziomo a ma byÄ‡ pionowo)
    const legTexture = useMemo(() => {
        const tex = woodTexture.clone();
        tex.rotation = Math.PI / 2;
        tex.center.set(0.5, 0.5);
        return tex;
    }, [woodTexture]);

    // Konfiguracja stolika
    // ObrÃ³cony 90Â° i przyciÄ…gniÄ™ty do lewej Å›ciany
    const tableConfig = useMemo(() => ({
        z: zOffset - 35,          // Pozycja Z (strefa miÄ™dzy Studio a About)
        width: 2.0,               // SzerokoÅ›Ä‡ blatu (po obrocie: wzdÅ‚uÅ¼ Å›ciany)
        depth: 0.8,               // GÅ‚Ä™bokoÅ›Ä‡ blatu (po obrocie: od Å›ciany w korytarz)
        height: 1.0,              // WysokoÅ›Ä‡ caÅ‚kowita
        legRadius: 0.08,          // GruboÅ›Ä‡ nÃ³g
        topThickness: 0.08,       // GruboÅ›Ä‡ blatu
        x: -wallX + 0.42,         // Przy lewej Å›cianie (depth/2 + maÅ‚y gap)
    }), [zOffset, wallX]);

    return (
        <group>
            {/* === LAMPY SUFITOWE === */}
            {lights.filter(light => light.z <= zClip).map((light, i) => {
                // Konfiguracja tekstur wewnÄ…trz pÄ™tli (lub poza, ale upewnijmy siÄ™ co do wrappingu)
                lampGrilleTexture.wrapS = lampGrilleTexture.wrapT = THREE.ClampToEdgeWrapping;
                lampSideTexture.wrapS = lampSideTexture.wrapT = THREE.ClampToEdgeWrapping; // Boki teÅ¼ clamp, Å¼eby nie byÅ‚o paskÃ³w

                return (
                    <group key={`light-${i}`} position={[0, ceilingY, light.z]}>
                        {/* Obudowa lampy - podÅ‚uÅ¼ny prostokÄ…t 3D */}
                        {/* GÅÃ“WNA BRYÅA */}
                        <mesh position={[0, -0.03, 0]}>
                            <boxGeometry args={[2.0, 0.06, 0.5]} />

                            {/* Short sides (Right/Left) */}
                            <meshBasicMaterial attach="material-0" color="#e8e8e8" roughness={0.6} />
                            <meshBasicMaterial attach="material-1" color="#e8e8e8" roughness={0.6} />

                            {/* Top (Hidden) */}
                            <meshBasicMaterial attach="material-2" color="#d0d0d0" roughness={0.8} />

                            {/* Bottom - Grille Texture 
                                UÅ¼ywamy przezroczystoÅ›ci, Å¼eby odsÅ‚oniÄ‡ wewnÄ™trzne Å›wiatÅ‚o.
                                Sama krata jest ciemna/metaliczna.
                            */}
                            <meshBasicMaterial
                                attach="material-3"
                                map={lampGrilleTexture}
                                transparent={true}
                                alphaTest={0.1}
                                side={THREE.DoubleSide}
                                color="#fcf3c6"
                                roughness={0.5}
                            />

                            {/* Long sides (Front/Back) - Side Texture */}
                            <meshBasicMaterial color="#fcf3c6" attach="material-4" map={lampSideTexture} roughness={0.6} />
                            <meshBasicMaterial color="#fcf3c6" attach="material-5" map={lampSideTexture} roughness={0.6} />
                        </mesh>

                        {/* WEWNÄ˜TRZNE ÅšWIATÅO (LIGHT PANEL) 
                            Siedzi WYÅ»EJ w obudowie, Å¼eby kratka pod spodem byÅ‚a widoczna.
                        */}
                        <mesh
                            position={[0, -0.059, 0]}
                            rotation={[-Math.PI / 2, 0, 0]}
                        >
                            <planeGeometry args={[1.9, 0.4]} />
                            <meshBasicMaterial
                                color="#ffffff"
                                toneMapped={false}
                                side={THREE.DoubleSide}
                            />
                        </mesh>

                        {/* RZECZYWISTE Å¹RÃ“DÅO ÅšWIATÅA (PointLight) - WYLACZONE */}
                        {/* <pointLight
                            position={[0, -1.5, 0]}
                            distance={6}
                            intensity={0.8}
                            color="#ffffff"
                            decay={2}
                        /> */}
                    </group>
                );
            })}

            {/* === STOLIK (obrÃ³cony 90Â°, przy lewej Å›cianie) === */}
            <group position={[tableConfig.x, floorY, tableConfig.z]} rotation={[0, Math.PI / 2, 0]}>
                {/* Nogi stolika */}
                {[
                    [-tableConfig.width / 2 + 0.1, -tableConfig.depth / 2 + 0.1],
                    [tableConfig.width / 2 - 0.1, -tableConfig.depth / 2 + 0.1],
                    [-tableConfig.width / 2 + 0.1, tableConfig.depth / 2 - 0.1],
                    [tableConfig.width / 2 - 0.1, tableConfig.depth / 2 - 0.1],
                ].map((pos, i) => (
                    <mesh key={`leg-${i}`} position={[pos[0], tableConfig.height / 2, pos[1]]}>
                        <boxGeometry args={[tableConfig.legRadius * 2, tableConfig.height, tableConfig.legRadius * 2]} />
                        <meshBasicMaterial color="#fcf3c6" map={legTexture} roughness={0.8} />
                    </mesh>
                ))}

                {/* Blat stolika */}
                <mesh position={[0, tableConfig.height + tableConfig.topThickness / 2, 0]}>
                    <boxGeometry args={[tableConfig.width, tableConfig.topThickness, tableConfig.depth]} />
                    <meshBasicMaterial color="#fcf3c6" attach="material-0" map={woodTexture} /> {/* Right */}
                    <meshBasicMaterial color="#fcf3c6" attach="material-1" map={woodTexture} /> {/* Left */}
                    <meshBasicMaterial color="#fcf3c6" attach="material-2" map={tableTopTexture} roughness={0.5} /> {/* Top */}
                    <meshBasicMaterial attach="material-3" color="#fcf3c6" />   {/* Bottom */}
                    <meshBasicMaterial color="#fcf3c6" attach="material-4" map={woodTexture} /> {/* Front */}
                    <meshBasicMaterial color="#fcf3c6" attach="material-5" map={woodTexture} /> {/* Back */}
                </mesh>

                {/* KWIATEK NA STOLE */}
                <mesh
                    position={[0, tableConfig.height + tableConfig.topThickness + 0.2, 0]} // Na blacie
                    rotation={[0, -Math.PI / 4, 0]} // Lekki obrÃ³t
                >
                    <planeGeometry args={[0.3, 0.3 / 0.758]} />
                    <meshBasicMaterial color="#fcf3c6"
                        map={flowerTexture}
                        transparent={true}
                        alphaTest={0.1}
                        side={THREE.DoubleSide}
                        roughness={0.8}
                    />
                </mesh>
            </group>

            {/* =============================================
                RAMKI NA ZDJÄ˜CIA NA ÅšCIANACH
                =============================================
                KaÅ¼da ramka to pÅ‚aski plane z teksturÄ… "ramka na zdjecie.png".
                SÄ… przyczepione do Å›cian na przemian (lewa/prawa).
                
                Å»eby zmieniÄ‡ pozycjÄ™/rozmiar konkretnej ramki,
                edytuj odpowiedni obiekt w tablicy 'frames' powyÅ¼ej.
            */}
            {frames.map((frame) => (
                <InspectableFrame
                    key={frame.id}
                    frame={frame}
                    wallX={wallX}
                    frameTexture={frameTexture}
                    framePaintedTexture={framePaintedTexture}
                    CABIN_SKETCH_URL={CABIN_SKETCH_URL}
                    setCameraOverride={setCameraOverride}
                />
            ))}

            {/* === SZAFKA (CABINET) === */}
            {/* Prosty box jako placeholder, naprzeciwko drzwi About (Left -48) -> wiÄ™c szafka na Right -51 */}
            <mesh
                position={[wallX - 0.26, floorY + 0.5, zOffset - 51]}
            // X: wallX - (depth/2) - maÅ‚y margin
            // Y: floorY + (height/2)
            // Z: zOffset - 51 (blisko drzwi About)
            >
                {/* Wymiary: X=0.5 (gÅ‚Ä™bokoÅ›Ä‡ od Å›ciany), Y=1.0 (wysokoÅ›Ä‡), Z=0.8 (szerokoÅ›Ä‡ wzdÅ‚uÅ¼ Å›ciany) */}
                <boxGeometry args={[0.5, 1.0, 1.0 * 0.8]} />
                {/* 
                    Materials for BoxGeometry:
                    0: Right (+x) - Wall side
                    1: Left (-x) - Corridor side (FRONT of cabinet) -> szafkaprzod.png
                    2: Top (+y) -> szafkaprzodgora.png
                    3: Bottom (-y) -> szafkaprzodgora.png (as requested)
                    4: Front (+z) -> szafkaprzodgora.png (side)
                    5: Back (-z) -> szafkaprzodgora.png (side)
                */}
                <meshBasicMaterial color="#fcf3c6" attach="material-0" map={cabinetRestTexture} />
                <meshBasicMaterial color="#fcf3c6" attach="material-1" map={cabinetFrontTexture} />
                <meshBasicMaterial color="#fcf3c6" attach="material-2" map={cabinetRestTexture} />
                <meshBasicMaterial color="#fcf3c6" attach="material-3" map={cabinetRestTexture} />
                <meshBasicMaterial color="#fcf3c6" attach="material-4" map={cabinetRestTexture} />
                <meshBasicMaterial color="#fcf3c6" attach="material-5" map={cabinetRestTexture} />
            </mesh>

            {/* === STOJÄ„CA RAMKA NA SZAFCE (STANDING FRAME) === */}
            {/* Stoi na szafce: Y = floorY + 1.0 (wysokoÅ›Ä‡ szafki) + poÅ‚owa wysokoÅ›ci ramki */}
            <mesh
                position={[wallX - 0.26, floorY + 1.0 + 0.2, zOffset - 51]}
                rotation={[0, -Math.PI / 2 + 0.2, 0]} // Lekki obrÃ³t, Å¼eby nie staÅ‚a idealnie prosto
            >
                <planeGeometry args={[0.3, 0.3 / 0.777]} />
                <meshBasicMaterial color="#fcf3c6"
                    map={standingFrameTexture}
                    transparent={true}
                    alphaTest={0.1}
                    side={THREE.DoubleSide}
                    roughness={0.8}
                />
            </mesh>


            {/* === DRZEWKO W DONICZCE (POTTED TREE) === */}
            {/* Kolo drzwi Contact (Right -62). Ustawiamy na -58, ODWROTNIE (Left). */}
            <mesh
                position={[-wallX + 0.8, floorY + 1.5, zOffset - 58]} // Left side
                rotation={[0, Math.PI / 4, 0]} // ObrÃ³cone w stronÄ™ korytarza (z lewej)
            >
                <planeGeometry args={[1.8, 1.8 / 0.602]} />
                <meshBasicMaterial color="#fcf3c6"
                    map={treeTexture}
                    transparent={true}
                    alphaTest={0.1}
                    side={THREE.DoubleSide}
                    roughness={0.8}
                />
            </mesh>

            {/* === KRATKI WENTYLACYJNE (VENTILATION GRATES) === */}
            {/* Generujemy kratkÄ™ na przeciwlegÅ‚ej Å›cianie dla kaÅ¼dego obrazu */}
            {frames.map((frame, i) => {
                const isFrameLeft = frame.side === 'left';
                const grateSide = isFrameLeft ? 'right' : 'left';

                return (
                    <mesh
                        key={`grate-${i}`}
                        position={[
                            grateSide === 'left' ? -wallX + 0.01 : wallX - 0.01,
                            ceilingY - 0.6, // Wysoko, tak jak ta pierwsza
                            frame.z // Ta sama pozycja Z co obrazu
                        ]}
                        rotation={[0, grateSide === 'left' ? Math.PI / 2 : -Math.PI / 2, 0]}
                    >
                        <planeGeometry args={[0.8, 0.8 / 1.968]} />
                        <meshBasicMaterial color="#fcf3c6"
                            map={grateTexture}
                            transparent={true}
                            alphaTest={0.1}
                            side={THREE.DoubleSide}
                            roughness={0.8}
                        />
                    </mesh>
                );
            })}

        </group >
    );
};

export default CorridorDecorations;
