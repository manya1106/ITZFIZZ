# ITZFIZZ — Kinetic Scroll-Driven Hero Animation

An interactive, performance-focused hero section inspired by sports car scroll interaction design. Built with vanilla web technologies, GSAP, and ScrollTrigger.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic, accessible markup structure.
- **Vanilla CSS3**: Modern custom properties, frosted glassmorphism, clamp-based fluid typography, GPU-accelerated transforms.
- **Vanilla JavaScript (ES6+)**: Modular interaction logic and dynamic velocity telemetry calculation.
- **GSAP 3.12.5 & ScrollTrigger**: Smooth scrubbing, pinning, matchMedia breakpoints, and entrance choreographies.

---

## ✨ Features & Functional Implementation

1. **Character-by-Character Staggered Headline Reveal**:
   - `W E L C O M E   I T Z F I Z Z` animates character-by-character with 3D translation, opacity, and gaussian blur reduction on initial page load.
   - Accompanying eyebrow badge, subtitle, and suspension arrival for the sports car.

2. **Animated Numeric Metric Rollup**:
   - Impact metrics count smoothly from `0%` to their target values (`98%`, `87%`, `94%`) with staggered card reveals.

3. **Scroll-Driven Vehicle Trajectory (Core Feature)**:
   - As the user scrolls through the pinned hero section, the aerodynamic sports car accelerates along an organic cornering path (multi-axis translation, steering rotation, scale adjustment, and dynamic lighting).
   - Tied directly to user scroll position via `scrub: 1.2` interpolation.

4. **Live Dynamic Speedometer & HUD Telemetry**:
   - Real-time scroll velocity computation displaying simulated `KM/H` speed in the navigation bar.
   - Lateral G-force and aerodynamic downforce HUD overlays appear during mid-scroll.

5. **Smooth Section Transition**:
   - Pinned hero transitions cleanly into the engineering breakdown section with staggered feature cards and performance specification counters.

6. **Responsive Design & Accessibility**:
   - Calibrated `gsap.matchMedia()` coordinates across Desktop, Tablet, and Mobile.
   - Comprehensive `prefers-reduced-motion` support.

---

## 📁 Project Structure

```text
scroll-hero/
├── index.html          # Semantic HTML structure with character spans & HUD markup
├── css/
│   └── style.css       # Dark luxury styling, glassmorphism, layout & media queries
├── js/
│   └── script.js       # GSAP timelines, ScrollTrigger scrub, character stagger & speedometer
├── assets/
│   └── car.svg         # Detailed sports car vector graphic with laser headlights & shadows
└── README.md
```

---

## 💻 Running Locally

You can open `index.html` directly in any browser, or serve it using Python:

```bash
cd scroll-hero
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

---

## 🌐 Deploy to GitHub Pages

1. Commit and push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: implement kinetic scroll-driven hero animation"
   git push origin main
   ```
2. In your GitHub repository, navigate to **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**, choose `main` (or root/`scroll-hero` folder depending on your repo root), and click **Save**.
4. Your live demo will be ready at `https://<username>.github.io/<repo>/`.
