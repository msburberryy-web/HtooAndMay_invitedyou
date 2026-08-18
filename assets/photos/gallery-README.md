# Gallery Photos

The new gallery section (right before the closing "Are You Ready to Witness This?" screen) is a swipeable stack of 8 photos. Drop your photos in this folder using these exact names, and the site will pick them up automatically — no code changes needed:

- `gallery-1.jpg`
- `gallery-2.jpg`
- `gallery-3.jpg`
- `gallery-4.jpg`
- `gallery-5.jpg`
- `gallery-6.jpg`
- `gallery-7.jpg`
- `gallery-8.jpg`

Any file you haven't added yet is fine — that slot in the stack shows a soft "Photo coming soon" placeholder instead of a broken image, so nothing looks broken in the meantime.

## Sizing

The stack fills most of the screen (up to ~460px wide, ~66% of viewport height) and crops photos to fill that box (`object-fit: cover`) rather than stretching them, so:

- Portrait or landscape both work fine.
- Aim for at least 1200px on the shorter side so photos stay sharp.
- If a photo has an important subject near the edges, keep it a little more centered — cropping will trim the sides/top/bottom to fill the frame.

## How it works

Visitors swipe left/right (or drag with a mouse) to flip through the stack, like flash cards — nothing is ever removed, so they can always swipe back to see a previous photo again.
