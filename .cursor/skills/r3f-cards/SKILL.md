---
name: r3f-cards
description: React Three Fiber card rendering, GLSL holographic shaders, pack opening animations, and battle scenes. Use when building or modifying 3D card components, pack opening sequences, holographic effects, or battle animations.
---

# R3F Card Rendering for Gacharoo

## Card Mesh Structure

Each card is a rounded rectangle (~63mm x 88mm ratio, standard TCG size) with front/back textures.

```tsx
// Standard card geometry (reuse across all cards)
const CARD_GEOMETRY = new RoundedBoxGeometry(0.63, 0.88, 0.01, 4, 0.02)

function Card({ template, isHolo, variant }: CardProps) {
  const meshRef = useRef<Mesh>(null)
  const frontTexture = useTexture(template.imageUrl)

  return (
    <mesh ref={meshRef} geometry={CARD_GEOMETRY}>
      <meshStandardMaterial map={frontTexture} side={FrontSide} />
    </mesh>
  )
}
```

Reuse geometry and materials globally. Never create new geometry per card instance.

## Holographic Shader

Base implementation from [threejs-vanilla-holographic-material](https://github.com/ektogamat/threejs-vanilla-holographic-material) (MIT). Key uniforms:

- `fresnelAmount` -- Rainbow edge glow intensity (0.0 - 1.0)
- `scanlineSize` -- Animated scanline density
- `hologramBrightness` -- Overall shimmer intensity
- `signalSpeed` -- Animation speed
- `hologramColor` -- Base tint color

The holo shader activates ONLY for holographic variant cards. Normal cards use `meshStandardMaterial` with environment map reflections.

## Rarity Visual Effects (by tier)

| Rarity | Border Color | Symbol | Card Material | Particle Effect |
|---|---|---|---|---|
| Standard | Silver | -- | Standard glossy | None |
| Common | Gray | Circle | Standard glossy | None |
| Uncommon | Green | Diamond | Slight sheen | Subtle green glow |
| Rare | Blue | Star | Enhanced reflections | Blue particle ring |
| Epic | Purple | Double Star | Animated gradient | Purple aurora |
| Legendary | Gold | Crown | Animated gold flow | Golden explosion + confetti |

Holographic overlay is an independent layer on top of any rarity.

## Pack Opening Animation Sequence

1. **Pack render**: Foil pouch mesh with set branding texture. Idle state: subtle float animation (`Float` from drei).
2. **Tear trigger**: User swipe/tap. Pack mesh splits along a pre-defined seam using morph targets or vertex displacement.
3. **Cards emerge**: 3-5 card meshes fly out with spring physics (`react-spring`). Land face-down in a fan layout.
4. **Card reveal**: Tap a card to flip. Flip uses spring-based rotation around Y axis.
   - Common: Simple flip (~0.3s)
   - Uncommon: Flip with green glow bloom
   - Rare+: Slow dramatic flip (~0.8s) with light rays (`drei/Sparkles`), screen shake (camera spring offset)
   - Legendary: Full cascade -- golden light, `drei/Stars` burst, camera zoom, confetti particles
5. **Sound sync**: Each phase triggers a Web Audio API sound cue. Initialize AudioContext on the user's first tap (browser autoplay policy).

## Reduced Motion Fallback

When `prefers-reduced-motion` is active OR on low-end devices (detect via `navigator.hardwareConcurrency < 4` or WebGL renderer info):

- Replace 3D pack opening with a 2D slide-in card reveal (CSS transitions)
- Card flip: instant opacity crossfade, no 3D rotation
- No particles, no screen shake, no bloom
- Still show rarity borders and symbols (accessibility double-coding)

## Performance Rules (Critical)

- **Never setState in useFrame.** Mutate refs directly for all animation.
- **Canvas `frameloop="demand"`** when no animation is running. Use `invalidate()` on interaction.
- **Dispose textures** when cards leave the viewport. Use `useTexture` with cleanup.
- **Instance meshes** for card backs (all identical geometry + material).
- **Limit particles**: Max 100 particles per effect. Use `drei/Sparkles` with bounded count.
- **Post-processing**: Use `SelectiveBloom` (not global bloom) for rarity glow. Only apply to the specific card mesh being revealed.

## Parallax Tilt Effect

Mouse/gyroscope input tilts the card in 3D for a physical feel (like tilting a real holographic card):

```tsx
function CardTilt({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<Group>(null)

  useFrame(({ pointer }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = pointer.x * 0.15
    groupRef.current.rotation.x = -pointer.y * 0.1
  })

  return <group ref={groupRef}>{children}</group>
}
```

On mobile: use `DeviceOrientationEvent` (with permission request) for gyroscope tilt.

## Battle Scene

- Split-screen layout: player card (left) vs opponent card (right)
- Cards slide in from opposite sides with spring animation
- Stat comparison: animated counter ticking up to final value
- Damage effect: attacked card shakes and flashes red, HP bar depletes
- KO: card shatters or fades with particle dissolve
- Victory: winning card pulses with glow, fanfare sound
- All battle animations respect reduced-motion preference
