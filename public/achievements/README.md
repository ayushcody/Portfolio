Add your achievement photos here using these filenames:

- blackpearl.jpg
- shodh.jpg
- vois.jpg
- dsa-bootcamp.jpg

Recommended size: 1600x1000 or larger, landscape orientation. Photos are cropped
to fill a consistent frame, so keep faces and the main subject near the center.

Then add the matching `image` field to each entry in `src/data/achievements.ts`:

```ts
image: "/achievements/blackpearl.jpg",
```

Use `/achievements/shodh.jpg`, `/achievements/vois.jpg`, and
`/achievements/dsa-bootcamp.jpg` for the other entries. Update each `imageAlt`
to describe the actual photo. Other image filenames work too: set the path in
the corresponding entry.

Until a photo is configured, the gallery shows a designed award poster. A
configured image that cannot load also falls back to that poster. No event
photos are generated or implied by the placeholders.

All four achievements appear in a horizontal gallery. Visitors can swipe,
use the arrow buttons, or focus the gallery and use the left/right arrows,
Home, and End. Motion follows their reduced-motion preference.
