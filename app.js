const birthdayNotes = [
  { freq: 261.63, dur: 0.42 },
  { freq: 261.63, dur: 0.42 },
  { freq: 293.66, dur: 0.52 },
  { freq: 261.63, dur: 0.52 },
  { freq: 349.23, dur: 0.68 },
  { freq: 329.63, dur: 0.68 },

  { freq: 261.63, dur: 0.42 },
  { freq: 261.63, dur: 0.42 },
  { freq: 293.66, dur: 0.52 },
  { freq: 261.63, dur: 0.52 },
  { freq: 392.0, dur: 0.68 },
  { freq: 349.23, dur: 0.68 },

  { freq: 261.63, dur: 0.42 },
  { freq: 261.63, dur: 0.42 },
  { freq: 523.25, dur: 0.68 },
  { freq: 440.0, dur: 0.68 },
  { freq: 349.23, dur: 0.68 },
  { freq: 329.63, dur: 0.68 },

  { freq: 293.66, dur: 0.42 },
  { freq: 293.66, dur: 0.42 },
  { freq: 440.0, dur: 0.52 },
  { freq: 392.0, dur: 0.52 },
  { freq: 349.23, dur: 0.68 },
  { freq: 392.0, dur: 0.9 }
];

let audioCtx = null;
const audioEl = document.getElementById('bg-audio');
let musicOn = false;
let activeSynthNodes = [];

function createRosePetals() {
  const container = document.querySelector('.rose-petals');
  if (!container) return;

  for (let i = 0; i < 36; i += 1) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${10 + Math.random() * 12}s`;
    petal.style.animationDelay = `${(Math.random() * 8).toFixed(2)}s`;
    petal.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 220}px`);
    petal.style.opacity = `${0.42 + Math.random() * 0.46}`;
    container.appendChild(petal);
  }
}

function createFloatingHearts() {
  const container = document.querySelector('.floating-hearts');
  if (!container) return;

  for (let i = 0; i < 9; i += 1) {
    const heart = document.createElement('span');
    heart.className = `heart heart-${i + 1}`;
    heart.textContent = '♥';
    heart.style.setProperty('--left', `${8 + Math.random() * 82}%`);
    heart.style.setProperty('--top', `${8 + Math.random() * 70}%`);
    heart.style.setProperty('--heart-size', `${1.8 + Math.random() * 2.7}rem`);
    heart.style.animationDelay = `${(Math.random() * 4).toFixed(2)}s`;
    heart.style.opacity = `${0.25 + Math.random() * 0.5}`;
    container.appendChild(heart);
  }
}

function createBalloons() {
  const container = document.querySelector('.balloon-layer');
  if (!container) return;

  const colors = ['#f472b6', '#f9d77e', '#fca5a5', '#fbbf24', '#f9a8d4'];

  for (let i = 0; i < 12; i += 1) {
    const balloon = document.createElement('span');
    balloon.className = 'balloon';
    balloon.style.left = `${Math.random() * 100}%`;
    balloon.style.top = `${Math.random() * 18}%`;
    balloon.style.background = `linear-gradient(135deg, ${colors[i % colors.length]}, rgba(255,255,255,0.28))`;
    balloon.style.transform = `scale(${0.7 + Math.random() * 0.8})`;
    balloon.style.animationDelay = `${(Math.random() * 8).toFixed(2)}s`;
    balloon.style.animationDuration = `${12 + Math.random() * 10}s`;
    container.appendChild(balloon);
  }
}

function playMp3IfAvailable() {
  if (!audioEl) return Promise.resolve(false);

  const songPath = 'assets/happy-birthday-medha.mp3';
  audioEl.src = songPath;
  audioEl.load();

  return audioEl.play().then(() => true).catch(() => {
    audioEl.pause();
    return false;
  });
}

function playSynthMelody() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const startTime = audioCtx.currentTime + 0.1;

  birthdayNotes.forEach((note, index) => {
    const noteStart = startTime + index * 0.3;
    const noteEnd = noteStart + note.dur + 0.18;

    const oscillatorA = audioCtx.createOscillator();
    const oscillatorB = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    const panner = typeof audioCtx.createStereoPanner === 'function'
      ? audioCtx.createStereoPanner()
      : null;

    oscillatorA.type = 'triangle';
    oscillatorA.frequency.setValueAtTime(note.freq, noteStart);

    oscillatorB.type = 'sine';
    oscillatorB.frequency.setValueAtTime(note.freq * 0.5, noteStart);

    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(0.12, noteStart + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(4, noteStart);
    lfoGain.gain.setValueAtTime(2.5, noteStart);

    oscillatorA.connect(gain);
    oscillatorB.connect(gain);
    gain.connect(panner || audioCtx.destination);

    if (panner) {
      panner.pan.setValueAtTime(index % 2 === 0 ? -0.25 : 0.25, noteStart);
      panner.connect(audioCtx.destination);
    }

    lfo.connect(lfoGain);
    lfoGain.connect(oscillatorA.frequency);
    lfoGain.connect(oscillatorB.frequency);

    oscillatorA.start(noteStart);
    oscillatorB.start(noteStart);
    lfo.start(noteStart);
    oscillatorA.stop(noteEnd);
    oscillatorB.stop(noteEnd);
    lfo.stop(noteEnd + 0.05);
    activeSynthNodes.push(oscillatorA, oscillatorB, lfo);
  });
}

function playMelody() {
  if (audioEl && !audioEl.paused) {
    musicOn = true;
    return;
  }

  if (audioEl) {
    playMp3IfAvailable().then((usedMp3) => {
      if (!musicOn) return;
      if (!usedMp3) {
        playSynthMelody();
      }
    });
    return;
  }

  playSynthMelody();
}

function stopMelody() {
  musicOn = false;

  if (audioEl) {
    audioEl.pause();
    audioEl.currentTime = 0;
  }

  activeSynthNodes.forEach((node) => {
    try {
      node.stop();
      node.disconnect();
    } catch {
      // A node may already have finished naturally.
    }
  });
  activeSynthNodes = [];
}

function updateMusicLabel() {
  const label = document.getElementById('music-status');
  if (label) label.textContent = musicOn ? 'Turn Birthday Music Off' : 'Replay Happy Birthday';
  if (musicToggle) {
    musicToggle.setAttribute('aria-pressed', String(musicOn));
    musicToggle.setAttribute('aria-label', musicOn ? 'Turn birthday music off' : 'Replay Happy Birthday');
  }
}

function triggerCelebration() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 65,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 65,
        origin: { x: 1 }
      });
    }, 450);
  }
}

const openButton = document.getElementById('open-btn');
const musicToggle = document.getElementById('music-toggle');
const secretNoteBtn = document.getElementById('secret-note-btn');
const secretNoteModal = document.getElementById('secret-note-modal');
const closeSecretNote = document.getElementById('close-secret-note');
const loveLetterBtn = document.getElementById('love-letter-btn');
const loveLetterModal = document.getElementById('love-letter-modal');
const closeLoveLetter = document.getElementById('close-love-letter');

createRosePetals();
createFloatingHearts();
createBalloons();

if (secretNoteBtn && secretNoteModal) {
  secretNoteBtn.addEventListener('click', () => {
    secretNoteModal.classList.remove('hidden-note');
  });
}

if (closeSecretNote && secretNoteModal) {
  closeSecretNote.addEventListener('click', () => {
    secretNoteModal.classList.add('hidden-note');
  });
}

if (secretNoteModal) {
  secretNoteModal.addEventListener('click', (event) => {
    if (event.target === secretNoteModal) {
      secretNoteModal.classList.add('hidden-note');
    }
  });
}

function closeLoveLetterModal() {
  if (!loveLetterModal) return;
  loveLetterModal.classList.remove('letter-open');
  loveLetterModal.setAttribute('aria-hidden', 'true');
  window.setTimeout(() => {
    loveLetterModal.classList.add('hidden-letter');
  }, 650);
}

if (loveLetterBtn && loveLetterModal) {
  loveLetterBtn.addEventListener('click', () => {
    loveLetterModal.classList.remove('hidden-letter');
    loveLetterModal.setAttribute('aria-hidden', 'false');
    window.requestAnimationFrame(() => {
      loveLetterModal.classList.add('letter-open');
    });
  });
}

if (closeLoveLetter) {
  closeLoveLetter.addEventListener('click', closeLoveLetterModal);
}

if (loveLetterModal) {
  loveLetterModal.addEventListener('click', (event) => {
    if (event.target === loveLetterModal) {
      closeLoveLetterModal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeLoveLetterModal();
  }
});

if (openButton) {
  openButton.addEventListener('click', () => {
    const modal = document.getElementById('welcome-modal');
    const mainContent = document.getElementById('main-content');

    if (modal) {
      modal.style.opacity = '0';
      modal.style.visibility = 'hidden';
      modal.style.pointerEvents = 'none';
    }

    if (mainContent) {
      mainContent.classList.remove('content-hidden');
      mainContent.classList.add('content-visible');
    }

    if (musicToggle) {
      musicToggle.classList.remove('hidden');
      const label = document.getElementById('music-status');
      if (label) label.textContent = 'Replay Happy Birthday';
    }

    musicOn = true;
    updateMusicLabel();
    playMelody();
    triggerCelebration();
  });
}

if (musicToggle) {
  musicToggle.addEventListener('click', () => {
    if (musicOn || (audioEl && !audioEl.paused)) {
      stopMelody();
    } else {
      musicOn = true;
      playMelody();
      triggerCelebration();
    }
    updateMusicLabel();
  });
}
