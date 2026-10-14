# Happy Birthday, Medha

A romantic, interactive birthday tribute website created for Medha by Zafar.

## Features

- Cinematic birthday intro with a romantic reveal
- Local Happy Birthday MP3 with play/pause and replay controls
- Floating balloons, rose petals, hearts, sparkles, and confetti
- Photo gallery using the provided couple photos
- Then & Now memory section
- Our Promises and Favorite Things sections
- Interactive flip cards
- Private love-note popup
- Vintage envelope animation with an interactive love letter
- Responsive layout optimized for iPhone-sized screens

## Run URL 
https://ms12871.github.io/wife-birthday/

## Run locally

From this folder, start a local web server:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

For audio, tap **Open My Heart** first. Mobile browsers require a user interaction before they allow music playback.

## Main files

- `index.html` - page content and interactive sections
- `style.css` - romantic styling, animations, and responsive layout
- `app.js` - interactions, music controls, balloons, petals, confetti, and modals
- `assets/` - photos and local audio files

## Media

The page uses:

- `assets/happy-birthday-medha.mp3`
- The supplied couple photos in `assets/` and `assets/converted/`

## Personalization

To customize the tribute, edit the text in `index.html`. The vintage letter is inside the `love-letter-modal` section, and the main handwritten-style letter is in the `letter-section`.
