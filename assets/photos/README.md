# Photo Placeholders

Add your couple photos here. The site references them in two ways:

## Heart section (SVG clip-path)
Replace the placeholder rects in `index.html` lines ~467–472:
```html
<!-- May's photo (left heart half) -->
<image href="assets/photos/may.jpg" x="0" y="0" width="200" height="180" preserveAspectRatio="xMidYMid slice"/>

<!-- Htoo's photo (right heart half) -->
<image href="assets/photos/htoo.jpg" x="0" y="0" width="200" height="180" preserveAspectRatio="xMidYMid slice"/>
```

## Vinyl record carousel
Each `.rec-cover` element inside the records section can hold an `<img>`:
```html
<div class="rec-cover"><img src="assets/photos/record-1.jpg" alt="Caption"></div>
```

Recommended sizes:
- `may.jpg` / `htoo.jpg` — square crop, min 400×400px
- Record covers — square crop, min 500×500px
