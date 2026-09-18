# Portfolio design

## Direction
User-pinned neo-brutalism: warm paper, large confident lettering, crisp ink borders and small hard shadows, with yellow, lilac and coral used in deliberate blocks. Subtly playful, approachable and easy to scan. No medieval motifs.

## Typography and surfaces
Space Grotesk for display; Inter for body. Use Instrument Serif for the footer name and statement, with Inter for footer utility and body text. Use warm cream #f7f4eb, ink #23231f, panel #fffdf6, muted ink #62625b, yellow #f4d738, lilac #c3b0e4 and coral #ee8d74. Dark mode adapts neutral surfaces while retaining readable colored panels.

## Homepage contract
Experience mode. The first viewport is an introduction with Ayush's name as the dominant text, a concise explanation of useful AI/full-stack work, one work CTA, and the original portrait in a slightly tilted print. The visitor path is introduction, four selected projects, engineering approach, experience, a horizontal four-item achievement gallery, skills/current interests, writing, contact, original footer.

## Interaction grammar
A short visible-at-rest entrance settles the hero type and portrait. Project links lift their modest hard shadow on hover. Achievement cards scroll natively with snap points and explicit previous/next controls; scrolling the page never becomes a horizontal trap. A sticky working-style introduction supports sequential process reading. Respect reduced motion. All controls have visible focus and sufficient touch targets.

## Boundaries
Footer structure and content remain intact. The owner authorized Aceternity's text hover effect for “Ayush Chougula,” precisely aligned within the footer, with Instrument Serif for the footer display text. The name uses measured SVG glyph bounds, a pointer-following gradient mask, and a static gradient on touch devices. Navbar retains its floating pill structure and existing navigation. Facts stay in existing data sources. Colorful diagrams and award panels are editorial representations, never fabricated screenshots or event photographs.

## Footer surface
The footer uses a fixed black surface in both themes, square outlined framing, a yellow hard shadow and yellow primary action. Instrument Serif stays on the name and statement; the brighter pointer-following gradient stands out against a restrained gray outline.

Experience uses a chronological, data-driven chapter journey (one chapter per role) with a scroll-filled axis, sticky square traveler, numbered nodes, and a desktop chapter guide. Each card leads with a fixed-size company logo box that falls back to a styled initials mark. Mobile retains the axis with compact jump links. Reduced motion removes the traveler and shows a complete axis; role content is always visible.

## System
Tokens (color, type scale, spacing, borders, shadows, motion) live in `app/tokens.css`; shared primitives (`.ink-card`, `.tone-*`, `.eyebrow`, `.tag`, `.logo-mark`, `.media-frame`, `.state-note`, `.brutal-button--secondary`, `.icon-button`, `.reveal`) live in `app/primitives.css`. Page CSS composes these instead of redeclaring borders, shadows and tags. Color carries meaning: education = lilac, experience = yellow, projects = coral, current interests = sage/lilac. Scroll reveals are CSS scroll-driven (no JavaScript), fixed-distance, and disabled for reduced motion. Project case studies, the About page, résumé, blog, 404 and the admin console all use this system; the admin stays utilitarian.
