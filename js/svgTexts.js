const dicesSvgTexts = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100">
    <rect x="10" y="10" width="80" height="80" rx="12" fill="#fff" stroke="#333" stroke-width="2"/>
    <circle cx="50" cy="50" r="6.5" fill="#fff"/>
  </svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100">
  <rect x="10" y="10" width="80" height="80" rx="12" fill="#fff" stroke="#333" stroke-width="2"/>
  <circle cx="30" cy="30" r="6.5" fill="#fff"/>
  <circle cx="70" cy="70" r="6.5" fill="#fff"/>
</svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100">
<rect x="10" y="10" width="80" height="80" rx="12" fill="#fff" stroke="#333" stroke-width="2"/>
<circle cx="30" cy="30" r="6.5" fill="#fff"/>
<circle cx="50" cy="50" r="6.5" fill="#fff"/>
<circle cx="70" cy="70" r="6.5" fill="#fff"/>
</svg>
`,
  `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100">
  <rect x="10" y="10" width="80" height="80" rx="12" fill="#fff" stroke="#333" stroke-width="2"/>
  <circle cx="30" cy="30" r="6.5" fill="#fff"/>
  <circle cx="70" cy="30" r="6.5" fill="#fff"/>
  <circle cx="30" cy="70" r="6.5" fill="#fff"/>
  <circle cx="70" cy="70" r="6.5" fill="#fff"/>
</svg>
`,
  `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100">
  <rect x="10" y="10" width="80" height="80" rx="12" fill="#fff" stroke="#333" stroke-width="2"/>
  <circle cx="30" cy="30" r="6.5" fill="#fff"/>
  <circle cx="70" cy="30" r="6.5" fill="#fff"/>
  <circle cx="50" cy="50" r="6.5" fill="#fff"/>
  <circle cx="30" cy="70" r="6.5" fill="#fff"/>
  <circle cx="70" cy="70" r="6.5" fill="#fff"/>
</svg>
`,
  `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100">
  <rect x="10" y="10" width="80" height="80" rx="12" fill="#fff" stroke="#333" stroke-width="2"/>
  <circle cx="30" cy="25" r="6.5" fill="#fff"/>
  <circle cx="70" cy="25" r="6.5" fill="#fff"/>
  <circle cx="30" cy="50" r="6.5" fill="#fff"/>
  <circle cx="70" cy="50" r="6.5" fill="#fff"/>
  <circle cx="30" cy="75" r="6.5" fill="#fff"/>
  <circle cx="70" cy="75" r="6.5" fill="#fff"/>
</svg>
`,
];
const etoileBlancheSvgText = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
<defs>
  <radialGradient id="starGrad" cx="35%" cy="25%" r="70%">
    <stop offset="0%" stop-color="white"/>
    <stop offset="50%" stop-color="white"/>
    <stop offset="100%" stop-color="white"/>
  </radialGradient>
</defs>
<polygon points="32,4 39,24 60,24 42,38 48,58 32,46 16,58 22,38 4,24 25,24"
  fill="url(#starGrad)" stroke="white" stroke-width="2"/>
</svg>`;
const etoileStrokeBlackSvgText = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
<defs>
  <radialGradient id="starGrad" cx="35%" cy="25%" r="70%">
    <stop offset="0%" stop-color="white"/>
    <stop offset="50%" stop-color="white"/>
    <stop offset="100%" stop-color="white"/>
  </radialGradient>
</defs>
<polygon points="32,4 39,24 60,24 42,38 48,58 32,46 16,58 22,38 4,24 25,24"
  fill="transparent" stroke="black" stroke-width="2"/>
</svg>`;