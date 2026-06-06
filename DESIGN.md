---
name: Circuit Nation
description: The fan-built hub for everything motorsports — F1, MotoGP, sim racing, and the engineering obsession behind it all.
colors:
  bg-void: "#0a0a0b"
  bg-surface: "#0d0d0f"
  panel-low: "#111114"
  panel-mid: "#161619"
  accent-red: "#ff2d2d"
  accent-red-top: "#ff3b3b"
  accent-red-deep: "#c81616"
  accent-orange: "#ff5a1f"
  text-primary: "#f4f4f5"
  text-muted: "#a1a1aa"
  text-ghost: "#6b6b73"
typography:
  display:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "clamp(56px, 11vw, 172px)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "clamp(40px, 5.5vw, 78px)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.03em"
  title:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Space Grotesk, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.1em"
rounded:
  btn: "10px"
  card: "20px"
  section: "28px"
  icon: "12px"
spacing:
  section-y: "130px"
  gap-grid: "18px"
  card-pad: "30px"
  container-x: "32px"
components:
  button-primary:
    backgroundColor: "linear-gradient(180deg, {colors.accent-red-top}, {colors.accent-red-deep})"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.btn}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "linear-gradient(180deg, {colors.accent-red-top}, {colors.accent-red-deep})"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.btn}"
    padding: "12px 20px"
  button-ghost:
    backgroundColor: "rgba(255,255,255,0.03)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.btn}"
    padding: "12px 20px"
  button-ghost-hover:
    backgroundColor: "rgba(255,255,255,0.06)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.btn}"
    padding: "12px 20px"
  card-default:
    backgroundColor: "linear-gradient(180deg, rgba(255,255,255,0.028), rgba(255,255,255,0.004))"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
  card-accent:
    backgroundColor: "linear-gradient(160deg, rgba(255,45,45,0.14), rgba(255,255,255,0.004))"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
  input-email:
    backgroundColor: "rgba(10,10,11,0.6)"
    textColor: "{colors.text-primary}"
    rounded: "12px"
    padding: "15px 18px"
---

# Design System: Circuit Nation

## 1. Overview

**Creative North Star: "The Pit Wall"**

Circuit Nation's visual system is built on the tension between engineering precision and live-race adrenaline. Like the pit wall itself — banks of telemetry screens, timing towers, radio chatter — every element earns its place. The surface is near-void dark, almost without color, so that the red accent carries the full weight of motorsport energy when it appears. Nothing is decorative; everything is functional in the way a race car is functional: obsessively tuned, ruthlessly purposeful, and exhilarating because of the discipline underneath.

The system rejects the noise of sports-news portals and the sanitized calm of SaaS landing pages with equal force. It is not ESPN's wall of competing stories. It is not a feature grid with a cheerful hero. It is not Reddit's utilitarian link list. It is not the official F1 site with its corporate team branding. Circuit Nation looks like it was built by someone who watched every qualifying session this season and couldn't find the right home for that obsession — so they built it.

Typography is the loudest element: ultra-compressed display headings at weights that feel structural, not decorative, paired with precision monospace labels that read like timing-screen readouts. Motion is choreographed but purposeful: content reveals on scroll, race tickers, counter animations that feel alive, not performative.

**Key Characteristics:**
- Void-dark surface that makes the red accent feel earned, not applied
- Typographic scale with a genuine jump between display and body (never flat)
- Monospace + uppercase for labels, data, and eyebrows — because this is a telemetry feed, not a magazine
- Every interactive element responds: hover lifts, border brightens, glow fires
- Motion feels like a live broadcast, not a slideshow

## 2. Colors: The Void Palette

A near-black foundation with a single live-wire accent. Every other color is a shade of absence; the red does all the work.

### Primary
- **Race Red** (`#ff2d2d` / top gradient `#ff3b3b`): The accent. Used on CTAs, active states, accent lines before section eyebrows, icon backgrounds at low opacity, and the hero glow radials. Appears on ≤15% of any given screen. Its rarity is the whole point.
- **Pit Red** (`#c81616`): The bottom of the red gradient on primary buttons. Not used directly in text or borders; only appears as part of the button gradient descent.
- **Heat Orange** (`#ff5a1f`): Secondary warmth accent, reserved for label variants, series tags (MotoGP association), or moments when the accent-red would create visual monotony.

### Neutral
- **Void** (`#0a0a0b`): The body background. Nearly pure black with a fractional warm cast. The lightest it goes on the base layer.
- **Surface** (`#0d0d0f`): Subtle background variant — race tickers, side panels, alternating row backgrounds.
- **Panel Low** (`#111114`): Card and panel surfaces. The 3-step lift from Void to the first interactive layer.
- **Panel Mid** (`#161619`): Elevated surfaces, hover states, interactive panel lift.
- **Primary Text** (`#f4f4f5`): Headings, CTA labels, all foreground text at full legibility.
- **Muted Text** (`#a1a1aa`): Body copy, descriptions, secondary information. ≥4.5:1 contrast on Void.
- **Ghost Text** (`#6b6b73`): Labels, timestamps, de-emphasized metadata. Use sparingly; only when information is genuinely tertiary.

**The One Voice Rule.** The accent-red is used on ≤15% of any screen. When everything is red, nothing is. Reserve it for the element that most needs to feel alive.

**The Contrast Minimum.** Never use Ghost Text (`#6b6b73`) for body copy. It is below 4.5:1 on the Void background. Its only job is short labels and metadata where the user is scanning, not reading.

## 3. Typography

**Display Font:** DM Sans (system-ui fallback)
**Body Font:** Space Grotesk (system-ui fallback)
**Handwriting Accent:** Mea Culpa (cursive; used for personality moments only, never body copy)

**Character:** DM Sans at 800 weight with tight negative letter-spacing reads like structural steel — heavy, industrial, uncompromising. Space Grotesk in body context bridges technical and human; in mono/label contexts it doubles as the telemetry readout. Together they split the personality cleanly: DM Sans is the race poster, Space Grotesk is the timing screen.

### Hierarchy
- **Display** (800 weight, `clamp(56px, 11vw, 172px)`, line-height 0.9, letter-spacing -0.04em): Hero headlines only. All-caps. The type is structural — letterforms that feel load-bearing. One per page.
- **Headline** (800 weight, `clamp(40px, 5.5vw, 78px)`, line-height 0.96, letter-spacing -0.03em): Section headings. All-caps. Two or three words. The clamp max is a hard ceiling; above 78px the type starts shouting past its content.
- **Title** (700 weight, 21px, line-height 1.2, letter-spacing -0.01em): Card headings, feature names, sub-section titles.
- **Body** (400 weight, 17px, line-height 1.6): Descriptions, paragraph copy. Max line length 65ch. Color: Muted Text (`#a1a1aa`). No all-caps.
- **Label** (500 weight, 12px, letter-spacing 0.1–0.26em, all-caps): Eyebrows, data labels, nav links, button text, chip text. Always Space Grotesk. The tight tracking is intentional — reads like a timing display.

**The Floor Rule.** Display headings have a letter-spacing floor of -0.04em. Never tighter. At 172px, letters touch below this threshold and the words become illegible.

**The Uppercase Ceiling.** Uppercase is reserved for Display headings, Headline headings, and Label text (≤6 words). Never all-caps body copy. Never all-caps Title-level text in a card context.

## 4. Elevation

This system uses tonal layering, not traditional box-shadows, as its primary depth signal. Surfaces stack from Void → Surface → Panel Low → Panel Mid, each step adding ~5–6 lightness units. Shadows appear only as live-state signals: hover, focus, or glow.

Borders carry the surface boundary: `rgba(255,255,255,0.08)` at rest, brightening to `rgba(255,255,255,0.16)` on hover. This is the primary "lift" signal for cards and buttons before the translate transform fires.

### Shadow Vocabulary

- **Accent Glow** (`0 8px 30px -8px rgba(255,45,45,0.55)`): Fires under primary buttons and accent elements at rest. Intensifies to `0 14px 40px -8px rgba(255,45,45,0.55)` on hover. Never on neutral surfaces.
- **Card Lift** (`0 22px 50px -24px rgba(0,0,0,0.8)`): Fires under cards on hover alongside translateY(-4px). Structural shadow — darkens the space beneath the lifted card, not a glow.
- **Text Glow** (`0 0 8px rgba(255,45,45,0.55)`): On small accent elements (dot indicators in buttons, accent lines). Inline, not box-shadow.

**The Flat-By-Default Rule.** Surfaces are completely flat at rest. No ambient shadow under cards, no resting glow under panels. Elevation is a response to interaction, not a resting state. If the glow is visible when nothing is happening, it has lost its meaning.

## 5. Components

### Buttons

Buttons use Space Grotesk in label context: 12.5px, 0.1em letter-spacing, all-caps, 500 weight. All buttons share this typographic treatment; shape and color separate variants.

- **Primary (Race Red):** Red gradient (`#ff3b3b` → `#c81616`), white text, 10px radius, 12px 20px padding. Accent glow shadow at rest. Hover: translateY(-2px), intensified glow. Often includes a 6px filled circle dot in accent color as a "live indicator" alongside the label.
- **Primary Hover:** Same gradient, shadow intensifies to `0 14px 40px -8px rgba(255,45,45,0.55)`, translateY(-2px).
- **Ghost:** Transparent bg (`rgba(255,255,255,0.03)`), border `rgba(255,255,255,0.16)`, primary text color. Same radius and padding. Hover: bg lightens to `rgba(255,255,255,0.06)`, border brightens to primary text color, translateY(-2px).
- **Transition:** `transform .18s ease, box-shadow .25s ease` on primary; `transform .18s ease, background .25s ease, border-color .25s ease` on ghost.

### Cards / Containers

Cards are the primary content container. Their discipline is strict: they do not nest, they do not carry gradients that compete with their content.

- **Default Card:** Border `rgba(255,255,255,0.08)`, 20px radius, gradient bg `linear-gradient(180deg, rgba(255,255,255,0.028), rgba(255,255,255,0.004))`, 30px internal padding.
- **Accent Card:** Same border and radius, gradient `linear-gradient(160deg, rgba(255,45,45,0.14), rgba(255,255,255,0.004))`. Used for featured slots or CTA containers. One accent card per section maximum.
- **Hover:** translateY(-4px), border brightens to `rgba(255,255,255,0.16)`, Card Lift shadow appears.
- **Transition:** `transform .3s cubic-bezier(.16,1,.3,1), border-color .3s ease, box-shadow .3s ease`.

### HUD Cards

Signature component. Used for live stats and metrics in the hero section.

- Corner bracket decorations (8px L-shaped lines in accent color at top-left and bottom-right, `position: absolute`).
- Label: Space Grotesk mono, 11px, 0.14em tracking, all-caps, Ghost Text color.
- Number: DM Sans, 800 weight, 30px, Accent Red for live values; Primary Text for static.
- Live indicator: 8px filled circle in Accent Red with pulse animation (`cn-pulse`).
- Border and gradient same as Default Card. Minimum width 150px, flex-grow.

### Inputs / Fields

- Email input: `rgba(10,10,11,0.6)` bg, border `rgba(255,255,255,0.16)`, 12px radius, 15px 18px padding, 15px font, Space Grotesk body font.
- Focus: border shifts to Accent Red (`#ff2d2d`). No glow; the color change is the signal.
- Placeholder: inherits Muted Text or Ghost Text. Must meet 4.5:1 against the field background.

### Navigation

- Fixed position, transparent at top. On scroll (>30px): `rgba(10,10,11,0.72)` bg + `blur(18px) saturate(140%)` backdrop-filter, bottom border `rgba(255,255,255,0.08)`.
- Logo: DM Sans 800, 19px, all-caps. Brand mark is a 34×34px square with 9px radius containing diagonal red stripes (CSS gradient, not an image).
- Nav links: Space Grotesk 12.5px, 0.1em tracking, all-caps, Muted Text at rest → Primary Text on hover. `transition: color .2s ease`.
- Mobile (<980px): desktop nav and ghost CTA hide; menu button appears (Space Grotesk 11px label). Mobile drawer: near-black 95% opacity with blur.

### Section Eyebrows

A repeated signature pattern: an inline flex row with a 26×1px red line (with accent glow), followed by `// [section label]` in Space Grotesk mono 12px, 0.26em tracking, all-caps, Muted Text color. The `//` is part of the voice, not decoration. Used consistently across sections.

## 6. Do's and Don'ts

### Do:
- **Do** keep the accent-red on ≤15% of any given screen. The void surface is doing the work; the red only fires when there's a reason.
- **Do** use DM Sans 800 with negative letter-spacing on every section headline. The compression is load-bearing, not stylistic.
- **Do** use `cubic-bezier(.16,1,.3,1)` (spring) at 0.8s for scroll reveal transitions. This is the system's motion signature.
- **Do** use translateY(-4px) + border brighten as the standard hover lift on cards; translateY(-2px) on buttons.
- **Do** include a `@media (prefers-reduced-motion: reduce)` guard on every animation. The `cn-` keyframes already exist in global CSS; respect them.
- **Do** use the `// [label]` eyebrow + red accent line as the section introduction pattern when a section needs orientation — but only when the content doesn't introduce itself through hierarchy alone.
- **Do** use counter animations (eased with `1 - Math.pow(1 - p, 3)`) for live stat numbers. The ease-out cubic makes numbers feel decelerating into accuracy, not arbitrary.

### Don't:
- **Don't** make the landing page look like a sports-news portal (ESPN / Sky Sports). That means: no competing story density, no sidebar layouts, no "latest news" tickers that displace the community story.
- **Don't** build a SaaS feature grid — icon + heading + text in identical equal-height cards, repeated endlessly. Circuit Nation's content sections use asymmetric bento layouts or full-bleed narrative sections.
- **Don't** use utilitarian forum-style UI (Reddit / Discord aesthetic). The platform serves the same audience but the design must be visually ambitious, not a message board.
- **Don't** use corporate F1/MotoGP site patterns: team-color gradient fills, trophy imagery as decoration, or any "official" visual weight. This is fan-built, not sponsored.
- **Don't** use `border-left` greater than 1px as a colored accent stripe on cards or list items. If a vertical accent is needed, use a full border + background tint instead.
- **Don't** use `background-clip: text` gradient text. The headline colors are: white, accent-red, or outline (WebkitTextStroke). Never a gradient.
- **Don't** apply glassmorphism (blurred semi-transparent cards) to content containers. The nav scroll state is the only legitimate blur in this system. Cards are tonal, not glass.
- **Don't** use Ghost Text (`#6b6b73`) for anything a user needs to read. It fails contrast on the Void background. Labels and timestamps only.
- **Don't** add a fourth typeface. The system uses DM Sans (display), Space Grotesk (body/labels), and Mea Culpa (accent/personality). A fourth font reads as indecision.
- **Don't** use the eyebrow pattern on every section as a reflex. It appears in the hero, What, Proof, and Join sections because those sections need a name before the headline lands. Sections that open with a strong enough headline do not need an eyebrow.
