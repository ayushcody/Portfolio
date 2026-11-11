# Portfolio design

## Direction
User-pinned neo-brutalism: warm paper, large confident lettering, crisp ink borders and small hard shadows, with yellow, lilac and coral used in deliberate blocks. Subtly playful, approachable and easy to scan. No medieval motifs.

## Typography and surfaces
Space Grotesk for display; Inter for body. Use Instrument Serif for the footer name and statement, with Inter for footer utility and body text. Use warm cream #f7f4eb, ink #23231f, panel #fffdf6, muted ink #62625b, yellow #f4d738, lilac #c3b0e4 and coral #ee8d74. Dark mode adapts neutral surfaces while retaining readable colored panels.

## Homepage contract
Plain and professional. The name is the headline, with the role (AI Engineer) under it, then the working motto "Build it. Break it. Build it again. Ship it." (the last step in full ink), the everyday stack as plain chips by their common names (only tools a project or role on the site uses), one work CTA and one résumé link. No marker underlines; links underline on hover. The portrait remains a slightly tilted print and never pushes the name below the fold. Hero text paints with the first frame. The visitor path is hero, four featured projects (cover-led cards), experience (newest first), the horizontal four-item achievement gallery, writing, skills grouped by capability, contact, original footer. Working style lives on /about; the homepage keeps a one-line link to it.

## Interaction grammar
A short visible-at-rest entrance settles the hero type and portrait. Project cards lead with a real 16:10 cover screenshot (or, with no interface to show, a blueprint of the architecture flow) and lift their hard shadow on hover and focus without hiding any information; their text links (Live demo, Video, Code, Write-up) stay visible. Achievement cards scroll natively with snap points and explicit previous/next controls; scrolling the page never becomes a horizontal trap. Respect reduced motion. All controls have visible focus and sufficient touch targets.

## Boundaries
Footer structure and content remain intact. The owner authorized Aceternity's text hover effect for “Ayush Chougula,” precisely aligned within the footer, with Instrument Serif for the footer display text. The name uses measured SVG glyph bounds, a pointer-following gradient mask, and a static gradient on touch devices. Navbar retains its floating pill structure and existing navigation. Facts stay in existing data sources; project content follows src/data/projectSchema.ts. Colorful diagrams and award panels are editorial representations, never fabricated screenshots or event photographs. Project screenshots are real captures to the spec in .claude/skills/add-project/SKILL.md.

## Footer surface
The footer uses a fixed black surface in both themes, square outlined framing, a yellow hard shadow and yellow primary action. Instrument Serif stays on the name and statement; the brighter pointer-following gradient stands out against a restrained gray outline.

Experience uses a data-driven chapter journey, newest role first (one chapter per role) with a scroll-filled axis, sticky square traveler, numbered nodes, and a desktop chapter guide. Each card leads with a fixed-size company logo box that falls back to a styled initials mark. Mobile retains the axis with compact jump links. Reduced motion removes the traveler and shows a complete axis; role content is always visible.

## System
Tokens (color, type scale, spacing, borders, shadows, motion) live in `app/tokens.css`; shared primitives (`.ink-card`, `.tone-*`, `.eyebrow`, `.tag`, `.logo-mark`, `.media-frame`, `.state-note`, `.brutal-button--secondary`, `.icon-button`, `.reveal`) live in `app/primitives.css`. Page CSS composes these instead of redeclaring borders, shadows and tags. Color carries meaning: education = lilac, experience = yellow, projects = coral, current interests = sage/lilac. Scroll reveals are CSS scroll-driven (no JavaScript), fixed-distance, and disabled for reduced motion. Project case studies, the About page, résumé, blog, 404 and the admin console all use this system; the admin stays utilitarian.
