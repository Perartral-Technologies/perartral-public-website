import { useEffect, useRef } from 'react'
import { animate, createTimeline } from 'animejs'
import { ScrollProgress } from '../../hooks/useScrollProgress'

interface DroneSceneProps {
  scroll: React.MutableRefObject<ScrollProgress>
}

export function DroneScene({ scroll }: DroneSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  // Arm assembly refs (containers that move on scroll with their propellers)
  const armRLRef = useRef<HTMLDivElement>(null)
  const armRRRef = useRef<HTMLDivElement>(null)
  const armFLRef = useRef<HTMLDivElement>(null)
  const armFRRef = useRef<HTMLDivElement>(null)

  // Propeller element refs (continuously rotate via Anime.js independent of scroll)
  const propFLRef = useRef<HTMLImageElement>(null)
  const propFRRef = useRef<HTMLImageElement>(null)
  const propRLRef = useRef<HTMLImageElement>(null)
  const propRRRef = useRef<HTMLImageElement>(null)

  // Other layer refs
  const batteryRef = useRef<HTMLImageElement>(null)
  const landingRef = useRef<HTMLImageElement>(null)
  const cameraRef = useRef<HTMLImageElement>(null)
  const flightRef = useRef<HTMLImageElement>(null)
  const bodyRef = useRef<HTMLImageElement>(null)

  // Continuous independent propeller animations
  useEffect(() => {
    if (!propFLRef.current || !propFRRef.current || !propRLRef.current || !propRRRef.current) return

    // Alternating physical rotation directions:
    // FrontLeft: clockwise
    // FrontRight: counter-clockwise
    // RearLeft: counter-clockwise
    // RearRight: clockwise
    const animFL = animate(propFLRef.current, {
      rotate: [0, 360],
      duration: 700,
      ease: 'linear',
      loop: true,
    })

    const animFR = animate(propFRRef.current, {
      rotate: [0, -360],
      duration: 700,
      ease: 'linear',
      loop: true,
    })

    const animRL = animate(propRLRef.current, {
      rotate: [0, -360],
      duration: 700,
      ease: 'linear',
      loop: true,
    })

    const animRR = animate(propRRRef.current, {
      rotate: [0, 360],
      duration: 700,
      ease: 'linear',
      loop: true,
    })

    return () => {
      animFL.cancel()
      animFR.cancel()
      animRL.cancel()
      animRR.cancel()
    }
  }, [])

  // Scroll-driven 3D drone progression timeline
  useEffect(() => {
    // Current animated properties
    const state = {
      // Stage 3D placement
      stageX: 0,
      stageY: 0,
      stageZ: 0,
      stageRotX: 2,
      stageRotY: -4,
      stageRotZ: 0,
      stageScale: 1,

      // Component exploded offsets (relative to neutral assembled 0,0,0)
      armFL_X: 0, armFL_Y: 0, armFL_Z: 0, armFL_R: 0,
      armFR_X: 0, armFR_Y: 0, armFR_Z: 0, armFR_R: 0,
      armRL_X: 0, armRL_Y: 0, armRL_Z: 0, armRL_R: 0,
      armRR_X: 0, armRR_Y: 0, armRR_Z: 0, armRR_R: 0,
      body_X: 0, body_Y: 0, body_Z: 0,
      battery_X: 0, battery_Y: 0, battery_Z: 0, battery_RX: 0,
      camera_X: 0, camera_Y: 0, camera_Z: 0, camera_RY: 0,
      landing_X: 0, landing_Y: 0, landing_Z: 0,
      flight_X: 0, flight_Y: 0, flight_Z: 0, flight_S: 1,

      // Ambient lighting & shadow
      glowOpacity: 0.12,
      glowScale: 1,
      shadowScale: 1,
      shadowOpacity: 0.45,
    }

    // Master Anime.js v4 timeline mapped to normalized scroll progress (0 - 1000ms)
    const tl = createTimeline({
      autoplay: false,
      duration: 1000,
      defaults: { ease: 'inOutCubic' },
    })

    // Phase 1: 0ms -> 220ms (Hero -> Section 01 transition)
    tl.add(state, {
      stageX: -90,
      stageY: 12,
      stageRotX: 5,
      stageRotY: -14,
      stageScale: 0.98,
      duration: 220,
    }, 0)

    // Phase 2: 220ms -> 340ms (Section 01 "Compact by Instinct")
    tl.add(state, {
      stageX: -115,
      stageY: 18,
      stageRotX: 7,
      stageRotY: -18,
      stageScale: 0.96,
      duration: 120,
    }, 220)

    // Phase 3: 340ms -> 460ms (Enter Engineering view -> Explode components)
    tl.add(state, {
      // Stage centers & tilts into isometric engineering perspective
      stageX: 0,
      stageY: -10,
      stageRotX: 13,
      stageRotY: 24,
      stageScale: 1.15,

      // Components explode along their natural structural vectors
      armFL_X: 140, armFL_Y: 20, armFL_Z: 50, armFL_R: 4,
      armFR_X: 90, armFR_Y: 110, armFR_Z: 60, armFR_R: 5,
      armRL_X: -70, armRL_Y: -95, armRL_Z: -40, armRL_R: -4,
      armRR_X: -140, armRR_Y: -25, armRR_Z: -30, armRR_R: -3,
      body_X: 0, body_Y: -15, body_Z: 15,
      battery_X: 0, battery_Y: 80, battery_Z: -20, battery_RX: 6,
      camera_X: 50, camera_Y: 90, camera_Z: 80, camera_RY: -8,
      landing_X: 0, landing_Y: 140, landing_Z: -40,
      flight_X: 0, flight_Y: -100, flight_Z: 110, flight_S: 1.1,

      // Ambient lighting intensifies
      glowOpacity: 0.85,
      glowScale: 1.35,
      shadowScale: 1.25,
      shadowOpacity: 0.28,
      duration: 120,
    }, 340)

    // Phase 4: 460ms -> 580ms (Hold exploded state during inspection scroll)
    tl.add(state, {
      stageRotX: 10,
      stageRotY: 30,
      stageScale: 1.17,
      duration: 120,
    }, 460)

    // Phase 5: 580ms -> 680ms (Magnetic reassembly back to monolithic drone)
    tl.add(state, {
      stageX: 130,
      stageY: -10,
      stageRotX: 8,
      stageRotY: -12,
      stageScale: 1.04,

      armFL_X: 0, armFL_Y: 0, armFL_Z: 0, armFL_R: 0,
      armFR_X: 0, armFR_Y: 0, armFR_Z: 0, armFR_R: 0,
      armRL_X: 0, armRL_Y: 0, armRL_Z: 0, armRL_R: 0,
      armRR_X: 0, armRR_Y: 0, armRR_Z: 0, armRR_R: 0,
      body_X: 0, body_Y: 0, body_Z: 0,
      battery_X: 0, battery_Y: 0, battery_Z: 0, battery_RX: 0,
      camera_X: 0, camera_Y: 0, camera_Z: 0, camera_RY: 0,
      landing_X: 0, landing_Y: 0, landing_Z: 0,
      flight_X: 0, flight_Y: 0, flight_Z: 0, flight_S: 1,

      glowOpacity: 0.12,
      glowScale: 1,
      shadowScale: 1,
      shadowOpacity: 0.45,
      duration: 100,
    }, 580)

    // Phase 6: 680ms -> 840ms (Section 03 "Precision Engineered" framing)
    tl.add(state, {
      stageX: 210,
      stageY: -15,
      stageRotX: 8,
      stageRotY: -22,
      stageScale: 1.05,
      duration: 160,
    }, 680)

    // Phase 7: 840ms -> 1000ms (Section 04 "Specifications" & Final launch stance)
    tl.add(state, {
      stageX: 30,
      stageY: -35,
      stageRotX: -6,
      stageRotY: 16,
      stageScale: 1.1,
      duration: 160,
    }, 840)

    // Interactive mouse parallax variables
    let mouseTargetX = 0
    let mouseTargetY = 0
    let mouseCurrentX = 0
    let mouseCurrentY = 0

    const onMouseMove = (e: MouseEvent) => {
      mouseTargetX = (e.clientX / window.innerWidth) * 2 - 1
      mouseTargetY = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // Animation Loop
    let animId: number
    let currentP = 0
    let lastTime = performance.now()

    const updateFrame = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1)
      lastTime = now

      // Smooth scroll lerp (responsive exponential filter)
      const targetP = scroll.current.target
      currentP += (targetP - currentP) * (1 - Math.exp(-delta * 9))
      scroll.current.current = currentP

      // Scrub Anime.js timeline
      tl.seek(Math.max(0, Math.min(1000, currentP * 1000)))

      // Smooth mouse parallax filter
      mouseCurrentX += (mouseTargetX - mouseCurrentX) * (1 - Math.exp(-delta * 6))
      mouseCurrentY += (mouseTargetY - mouseCurrentY) * (1 - Math.exp(-delta * 6))

      // Idle float (subtle organic motion)
      const idleFloat = Math.sin(now * 0.0018) * 5
      const idleTilt = Math.cos(now * 0.0014) * 0.7

      // Apply Stage 3D Transform
      if (stageRef.current) {
        const finalRotX = state.stageRotX + mouseCurrentY * -5 + idleTilt
        const finalRotY = state.stageRotY + mouseCurrentX * 7
        const finalRotZ = state.stageRotZ + mouseCurrentX * -1.5
        const finalY = state.stageY + idleFloat

        stageRef.current.style.transform =
          `translate3d(${state.stageX}px, ${finalY}px, ${state.stageZ}px) ` +
          `rotateX(${finalRotX}deg) rotateY(${finalRotY}deg) rotateZ(${finalRotZ}deg) ` +
          `scale(${state.stageScale})`
      }

      // Apply Individual Layer 3D Offsets (Arms carry their nested propellers in 3D space)
      if (armFLRef.current) {
        armFLRef.current.style.transform =
          `translate3d(${state.armFL_X}px, ${state.armFL_Y}px, ${state.armFL_Z}px) rotateZ(${state.armFL_R}deg)`
      }
      if (armFRRef.current) {
        armFRRef.current.style.transform =
          `translate3d(${state.armFR_X}px, ${state.armFR_Y}px, ${state.armFR_Z}px) rotateZ(${state.armFR_R}deg)`
      }
      if (armRLRef.current) {
        armRLRef.current.style.transform =
          `translate3d(${state.armRL_X}px, ${state.armRL_Y}px, ${state.armRL_Z}px) rotateZ(${state.armRL_R}deg)`
      }
      if (armRRRef.current) {
        armRRRef.current.style.transform =
          `translate3d(${state.armRR_X}px, ${state.armRR_Y}px, ${state.armRR_Z}px) rotateZ(${state.armRR_R}deg)`
      }
      if (bodyRef.current) {
        bodyRef.current.style.transform =
          `translate3d(${state.body_X}px, ${state.body_Y}px, ${state.body_Z}px)`
      }
      if (batteryRef.current) {
        batteryRef.current.style.transform =
          `translate3d(${state.battery_X}px, ${state.battery_Y}px, ${state.battery_Z}px) rotateX(${state.battery_RX}deg)`
      }
      if (cameraRef.current) {
        cameraRef.current.style.transform =
          `translate3d(${state.camera_X}px, ${state.camera_Y}px, ${state.camera_Z}px) rotateY(${state.camera_RY}deg)`
      }
      if (landingRef.current) {
        landingRef.current.style.transform =
          `translate3d(${state.landing_X}px, ${state.landing_Y}px, ${state.landing_Z}px)`
      }
      if (flightRef.current) {
        flightRef.current.style.transform =
          `translate3d(${state.flight_X}px, ${state.flight_Y}px, ${state.flight_Z}px) scale(${state.flight_S})`
      }

      // Apply Dynamic Glow and Shadow
      if (glowRef.current) {
        glowRef.current.style.opacity = state.glowOpacity.toFixed(3)
        glowRef.current.style.transform = `translate(-50%, -50%) scale(${state.glowScale})`
      }
      if (shadowRef.current) {
        shadowRef.current.style.opacity = state.shadowOpacity.toFixed(3)
        shadowRef.current.style.transform = `translate(-50%, -50%) scale(${state.shadowScale})`
      }

      animId = requestAnimationFrame(updateFrame)
    }

    animId = requestAnimationFrame(updateFrame)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [scroll])

  return (
    <div ref={containerRef} className="drone-viewport">
      {/* Cinematic Backlight / Engineering Ambient Glow */}
      <div ref={glowRef} className="drone-glow" />

      {/* Dynamic Ground Contact Shadow */}
      <div ref={shadowRef} className="drone-shadow" />

      {/* 3D Drone Transform Stage */}
      <div ref={stageRef} className="drone-stage">
        {/* Layer 1: Rear Left Arm Assembly */}
        <div ref={armRLRef} className="drone-layer drone-arm-rl">
          <img
            src="/drone/drone_arm_rl.png"
            alt="Aerion Rear Left Propulsion Arm"
            className="drone-layer-img"
            draggable={false}
            loading="eager"
          />
          <div className="drone-prop-wrapper prop-rl">
            <img
              ref={propRLRef}
              src="/drone/drone_prop_rl.png"
              alt="Propeller Rear Left"
              className="drone-propeller"
              draggable={false}
              loading="eager"
            />
          </div>
        </div>

        {/* Layer 2: Rear Right Arm Assembly */}
        <div ref={armRRRef} className="drone-layer drone-arm-rr">
          <img
            src="/drone/drone_arm_rr.png"
            alt="Aerion Rear Right Propulsion Arm"
            className="drone-layer-img"
            draggable={false}
            loading="eager"
          />
          <div className="drone-prop-wrapper prop-rr">
            <img
              ref={propRRRef}
              src="/drone/drone_prop_rr.png"
              alt="Propeller Rear Right"
              className="drone-propeller"
              draggable={false}
              loading="eager"
            />
          </div>
        </div>

        {/* Layer 3: Power System / Battery */}
        <img
          ref={batteryRef}
          src="/drone/drone_battery.png"
          alt="Aerion Graphite Battery Module"
          className="drone-layer drone-battery"
          draggable={false}
          loading="eager"
        />

        {/* Layer 4: Landing Structure */}
        <img
          ref={landingRef}
          src="/drone/drone_landing.png"
          alt="Aerion Carbon Landing Skids"
          className="drone-layer drone-landing"
          draggable={false}
          loading="eager"
        />

        {/* Layer 5: 4K Optical Camera & Gimbal */}
        <img
          ref={cameraRef}
          src="/drone/drone_camera.png"
          alt="Aerion Stabilized Optical Camera"
          className="drone-layer drone-camera"
          draggable={false}
          loading="eager"
        />

        {/* Layer 6: Flight Controller & Cooling Core */}
        <img
          ref={flightRef}
          src="/drone/drone_flight.png"
          alt="Aerion Flight Control System & Heat Sink"
          className="drone-layer drone-flight"
          draggable={false}
          loading="eager"
        />

        {/* Layer 7: Fuselage Body */}
        <img
          ref={bodyRef}
          src="/drone/drone_body.png"
          alt="Aerion Monocoque Fuselage"
          className="drone-layer drone-body"
          draggable={false}
          loading="eager"
        />

        {/* Layer 8: Front Left Arm Assembly */}
        <div ref={armFLRef} className="drone-layer drone-arm-fl">
          <img
            src="/drone/drone_arm_fl.png"
            alt="Aerion Front Left Propulsion Arm"
            className="drone-layer-img"
            draggable={false}
            loading="eager"
          />
          <div className="drone-prop-wrapper prop-fl">
            <img
              ref={propFLRef}
              src="/drone/drone_prop_fl.png"
              alt="Propeller Front Left"
              className="drone-propeller"
              draggable={false}
              loading="eager"
            />
          </div>
        </div>

        {/* Layer 9: Front Right Arm Assembly */}
        <div ref={armFRRef} className="drone-layer drone-arm-fr">
          <img
            src="/drone/drone_arm_fr.png"
            alt="Aerion Front Right Propulsion Arm"
            className="drone-layer-img"
            draggable={false}
            loading="eager"
          />
          <div className="drone-prop-wrapper prop-fr">
            <img
              ref={propFRRef}
              src="/drone/drone_prop_fr.png"
              alt="Propeller Front Right"
              className="drone-propeller"
              draggable={false}
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
