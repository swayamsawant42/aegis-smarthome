/**
 * AEGIS SMART HOME - APPLICATION JAVASCRIPT
 * Interactive Simulator, Product Catalog, Energy Calculator, Audio Synthesis & Theme Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------------------
  // 1. THEME TOGGLE (DARK / LIGHT)
  // -------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  
  const savedTheme = localStorage.getItem('aegis-theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('aegis-theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>`;
    } else {
      themeIcon.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>`;
    }
  }

  // -------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION
  // -------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // -------------------------------------------------------------------------
  // 3. WEB AUDIO SYNTHESIZER FOR DOORBELL CHIME
  // -------------------------------------------------------------------------
  let audioCtx = null;

  function playDoorbellChime() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;

      // Note 1: E5 (659.25 Hz)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.4, now + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.9);

      // Note 2: C5 (523.25 Hz) ding-dong
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(523.25, now + 0.45);
      gain2.gain.setValueAtTime(0, now + 0.45);
      gain2.gain.linearRampToValueAtTime(0.4, now + 0.5);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.45);
      osc2.stop(now + 1.6);
    } catch (e) {
      console.log('AudioContext not allowed or unsupported in current environment', e);
    }
  }

  // -------------------------------------------------------------------------
  // 4. SMART HOME SIMULATOR LOGIC
  // -------------------------------------------------------------------------
  const simState = {
    bell: { ringing: false, micActive: false },
    fan: { power: true, speed: 2, speeds: [1.8, 1.2, 0.7, 0.4, 0.22] },
    ac: { power: true, targetTemp: 72, mode: 'cool' },
    light: { power: true, color: '#00f0ff', brightness: 85 }
  };

  // --- Smart Bell Controller ---
  const ringBellBtn = document.getElementById('ring-bell-btn');
  const camMotionAlert = document.getElementById('cam-motion-alert');
  const camStatusText = document.getElementById('cam-status-text');
  const toggleMicBtn = document.getElementById('toggle-mic-btn');

  if (ringBellBtn) {
    ringBellBtn.addEventListener('click', () => {
      playDoorbellChime();
      showToast('🔔 Chime Triggered: Someone is at the Front Porch!');
      
      if (camMotionAlert) {
        camMotionAlert.classList.add('active');
        camMotionAlert.innerText = 'Visitor Alert: Person Detected';
      }
      if (camStatusText) {
        camStatusText.innerText = '🔴 LIVE FEED: Ringing...';
      }

      setTimeout(() => {
        if (camMotionAlert) camMotionAlert.classList.remove('active');
        if (camStatusText) camStatusText.innerText = 'LIVE 2K HDR (60 FPS)';
      }, 3500);
    });
  }

  if (toggleMicBtn) {
    toggleMicBtn.addEventListener('click', () => {
      simState.bell.micActive = !simState.bell.micActive;
      toggleMicBtn.innerText = simState.bell.micActive ? 'Mic: Live (2-Way)' : 'Talk';
      toggleMicBtn.style.color = simState.bell.micActive ? 'var(--accent-emerald)' : 'inherit';
      showToast(simState.bell.micActive ? '🎙️ Two-Way Audio Open' : '🔇 Audio Muted');
    });
  }

  // --- Smart Fan Controller ---
  const fanPowerToggle = document.getElementById('fan-power-toggle');
  const heroFanToggle = document.getElementById('hero-fan-toggle');
  const fanBlades = document.getElementById('fan-blades');
  const fanSpeedChips = document.querySelectorAll('.fan-speed-chip');
  const fanRpmDisplay = document.getElementById('fan-rpm-display');
  const heroFanStatus = document.getElementById('hero-fan-status');

  function updateFanVisual() {
    const isRunning = simState.fan.power;
    const speedDuration = simState.fan.speeds[simState.fan.speed - 1];
    
    if (fanBlades) {
      fanBlades.style.setProperty('--fan-speed', `${speedDuration}s`);
      fanBlades.style.setProperty('--fan-state', isRunning ? 'running' : 'paused');
    }

    const calculatedRpm = isRunning ? (simState.fan.speed * 65) : 0;
    if (fanRpmDisplay) {
      fanRpmDisplay.innerText = isRunning ? `${calculatedRpm} RPM` : 'OFF';
    }
    if (heroFanStatus) {
      heroFanStatus.innerText = isRunning ? `Speed ${simState.fan.speed}` : 'Off';
    }
    if (fanPowerToggle) fanPowerToggle.checked = isRunning;
    if (heroFanToggle) heroFanToggle.checked = isRunning;
  }

  if (fanPowerToggle) {
    fanPowerToggle.addEventListener('change', (e) => {
      simState.fan.power = e.target.checked;
      updateFanVisual();
      showToast(simState.fan.power ? '🌀 Smart Fan Activated' : 'Smart Fan Turned Off');
    });
  }

  if (heroFanToggle) {
    heroFanToggle.addEventListener('change', (e) => {
      simState.fan.power = e.target.checked;
      updateFanVisual();
    });
  }

  fanSpeedChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const spd = parseInt(chip.getAttribute('data-speed'), 10);
      simState.fan.speed = spd;
      simState.fan.power = true;
      fanSpeedChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      updateFanVisual();
    });
  });

  // --- Smart AC Controller ---
  const acPowerToggle = document.getElementById('ac-power-toggle');
  const heroAcToggle = document.getElementById('hero-ac-toggle');
  const acTempDisplay = document.getElementById('ac-temp-value');
  const heroAcTemp = document.getElementById('hero-ac-temp');
  const acTempUp = document.getElementById('ac-temp-up');
  const acTempDown = document.getElementById('ac-temp-down');
  const acModeChips = document.querySelectorAll('.ac-mode-chip');
  const acCoolWaves = document.getElementById('ac-cooling-animation');
  const acEnergyDraw = document.getElementById('ac-energy-draw');

  function updateAcVisual() {
    const isRunning = simState.ac.power;
    if (acTempDisplay) acTempDisplay.innerText = `${simState.ac.targetTemp}°`;
    if (heroAcTemp) heroAcTemp.innerText = `${simState.ac.targetTemp}°F`;
    
    if (acPowerToggle) acPowerToggle.checked = isRunning;
    if (heroAcToggle) heroAcToggle.checked = isRunning;

    if (acCoolWaves) {
      acCoolWaves.style.opacity = isRunning ? '1' : '0.15';
    }

    if (acEnergyDraw) {
      let watts = 0;
      if (isRunning) {
        if (simState.ac.mode === 'eco') watts = 240;
        else if (simState.ac.mode === 'turbo') watts = 890;
        else watts = 480;
      }
      acEnergyDraw.innerText = `${watts} W`;
    }
  }

  if (acPowerToggle) {
    acPowerToggle.addEventListener('change', (e) => {
      simState.ac.power = e.target.checked;
      updateAcVisual();
      showToast(simState.ac.power ? '❄️ Smart AC Inverter On' : 'Smart AC Inverter Off');
    });
  }

  if (heroAcToggle) {
    heroAcToggle.addEventListener('change', (e) => {
      simState.ac.power = e.target.checked;
      updateAcVisual();
    });
  }

  if (acTempUp) {
    acTempUp.addEventListener('click', () => {
      if (simState.ac.targetTemp < 82) {
        simState.ac.targetTemp++;
        updateAcVisual();
      }
    });
  }

  if (acTempDown) {
    acTempDown.addEventListener('click', () => {
      if (simState.ac.targetTemp > 62) {
        simState.ac.targetTemp--;
        updateAcVisual();
      }
    });
  }

  acModeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      acModeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      simState.ac.mode = chip.getAttribute('data-mode');
      updateAcVisual();
      showToast(`Mode switched to: ${chip.innerText}`);
    });
  });

  // --- Smart Light Controller ---
  const lightPowerToggle = document.getElementById('light-power-toggle');
  const heroLightToggle = document.getElementById('hero-light-toggle');
  const lightBulbGlow = document.getElementById('light-bulb-glow');
  const simRoomBackdrop = document.getElementById('sim-room-backdrop');
  const lightColorSwatches = document.querySelectorAll('.light-color-swatch');
  const lightBrightnessSlider = document.getElementById('light-brightness-slider');
  const heroLightStatus = document.getElementById('hero-light-status');

  function updateLightVisual() {
    const isRunning = simState.light.power;
    const color = simState.light.color;
    const brightness = simState.light.brightness;

    if (lightPowerToggle) lightPowerToggle.checked = isRunning;
    if (heroLightToggle) heroLightToggle.checked = isRunning;

    const opacity = isRunning ? (brightness / 100) : 0.05;
    const glowIntensity = isRunning ? `0 0 ${brightness * 0.7}px ${color}` : 'none';

    if (lightBulbGlow) {
      lightBulbGlow.style.setProperty('--sim-light-color', color);
      lightBulbGlow.style.background = isRunning ? color : '#334155';
      lightBulbGlow.style.boxShadow = glowIntensity;
      lightBulbGlow.style.opacity = isRunning ? (brightness / 100) : 0.2;
    }

    if (simRoomBackdrop) {
      simRoomBackdrop.style.setProperty('--sim-light-glow', color);
      simRoomBackdrop.style.setProperty('--sim-light-opacity', isRunning ? (brightness / 160) : 0);
    }

    if (heroLightStatus) {
      heroLightStatus.innerText = isRunning ? `${brightness}%` : 'Off';
    }
  }

  if (lightPowerToggle) {
    lightPowerToggle.addEventListener('change', (e) => {
      simState.light.power = e.target.checked;
      updateLightVisual();
      showToast(simState.light.power ? '💡 Smart Lights On' : 'Smart Lights Off');
    });
  }

  if (heroLightToggle) {
    heroLightToggle.addEventListener('change', (e) => {
      simState.light.power = e.target.checked;
      updateLightVisual();
    });
  }

  lightColorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      lightColorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      simState.light.color = swatch.getAttribute('data-color');
      simState.light.power = true;
      updateLightVisual();
    });
  });

  if (lightBrightnessSlider) {
    lightBrightnessSlider.addEventListener('input', (e) => {
      simState.light.brightness = parseInt(e.target.value, 10);
      updateLightVisual();
    });
  }

  // Initialize Simulator Visuals
  updateFanVisual();
  updateAcVisual();
  updateLightVisual();

  // -------------------------------------------------------------------------
  // 5. PRODUCT CATALOG FILTERING
  // -------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 6. ENERGY SAVINGS CALCULATOR
  // -------------------------------------------------------------------------
  const roomsSlider = document.getElementById('calc-rooms');
  const devicesSlider = document.getElementById('calc-devices');
  const roomsValue = document.getElementById('calc-rooms-val');
  const devicesValue = document.getElementById('calc-devices-val');
  const savingsDisplay = document.getElementById('savings-result-val');
  const kwhDisplay = document.getElementById('savings-kwh-val');
  const co2Display = document.getElementById('savings-co2-val');

  function calculateSavings() {
    if (!roomsSlider || !devicesSlider) return;
    const rooms = parseInt(roomsSlider.value, 10);
    const devices = parseInt(devicesSlider.value, 10);

    if (roomsValue) roomsValue.innerText = `${rooms} Rooms`;
    if (devicesValue) devicesValue.innerText = `${devices} Devices`;

    // Formula estimation: ~$32 / device / year with intelligent schedule & sensor cutoffs
    const annualSavings = Math.round(devices * 34 + rooms * 45);
    const kwhSaved = Math.round(annualSavings * 6.2);
    const co2Offset = Math.round(kwhSaved * 0.42);

    if (savingsDisplay) savingsDisplay.innerText = `$${annualSavings}`;
    if (kwhDisplay) kwhDisplay.innerText = `${kwhSaved.toLocaleString()} kWh`;
    if (co2Display) co2Display.innerText = `${co2Offset} kg`;
  }

  if (roomsSlider) roomsSlider.addEventListener('input', calculateSavings);
  if (devicesSlider) devicesSlider.addEventListener('input', calculateSavings);
  calculateSavings();

  // -------------------------------------------------------------------------
  // 7. SPECIFICATIONS MODAL SYSTEM
  // -------------------------------------------------------------------------
  const modalBackdrop = document.getElementById('spec-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  const productSpecsDB = {
    'bell-pro': {
      title: 'Aegis Bell Pro 2K - Wi-Fi Video Doorbell',
      specs: [
        ['Resolution', '2K QHD (2560 × 1440) HDR with 160° Ultra-Wide Field of View'],
        ['Connectivity', 'Dual-Band Wi-Fi 6 (2.4 GHz & 5 GHz) + Bluetooth 5.2 LE'],
        ['Power Source', 'Hardwired 16V-24V AC or Internal 6,500 mAh Rechargeable Battery'],
        ['Night Vision', 'Color Night Vision with dual IR 850nm illuminators'],
        ['Audio', 'Full-duplex 2-Way Audio with AI background noise reduction'],
        ['Smart Home Support', 'Matter over Wi-Fi, Apple HomeKit, Google Home, Alexa'],
        ['Local Storage', 'MicroSD slot (up to 256GB) + RTSP / ONVIF NAS streaming'],
        ['Weather Rating', 'IP65 Weatherproof (-20°C to 50°C)']
      ]
    },
    'fan-aeroflow': {
      title: 'Aegis AeroFlow Ultra - Smart BLDC Ceiling Fan',
      specs: [
        ['Motor Type', 'WhisperQuiet™ 100% Copper Brushless DC (BLDC) Motor (<22 dB)'],
        ['Airflow Speed', '10 Precision Digital Speeds + Nature Breeze Simulation'],
        ['Blade Span', '52 inches (132 cm) Aerodynamic Composite Polycarbonate Blades'],
        ['Connectivity', 'Wi-Fi 802.11 b/g/n (2.4 GHz) + Bluetooth Mesh'],
        ['Integrated Light', '24W Tunable CCT LED Ring (2700K - 6500K, 2200 Lumens)'],
        ['Winter Mode', 'Reversible airflow rotation for seasonal heat dispersion'],
        ['Power Efficiency', 'Up to 75% energy reduction compared to standard AC induction motors'],
        ['Certifications', 'Matter Certified, Energy Star 2026, UL Listed']
      ]
    },
    'ac-frostsense': {
      title: 'Aegis FrostSense Inverter - Smart AC & Thermostat Hub',
      specs: [
        ['Cooling Tech', 'Twin-Rotary Dual Inverter Compressor with Eco-Sense Algorithms'],
        ['Connectivity', 'Wi-Fi 6 (2.4/5GHz) + Thread & Matter support'],
        ['Sensors', 'Laser PM2.5 sensor, ambient temperature & humidity monitor'],
        ['Automation', 'AI Geofencing auto-away cooling, predictive pre-cooling'],
        ['Refrigerant', 'Eco-friendly low-GWP R32 Refrigerant'],
        ['Filter', 'Self-cleaning titanium apatite deodorizing air filter'],
        ['Sound Level', 'Whisper Sleep mode as quiet as 19 dB(A)'],
        ['Efficiency Rating', 'SEER2 24.5 / EER2 15.0 Ultra-High Efficiency']
      ]
    },
    'light-lumina': {
      title: 'Aegis LuminaGlow - Tunable RGB+CCT Smart Mesh Light',
      specs: [
        ['Luminous Flux', '1200 Lumens peak brightness (equivalent to 85W traditional)'],
        ['Color Gamut', '16 Million RGB colors + 2200K - 6500K tunable dynamic whites'],
        ['Color Rendering', 'CRI > 93 (True natural color reproduction)'],
        ['Connectivity', 'Wi-Fi 2.4GHz + BLE 5.0 Mesh with instant local sync'],
        ['Music Sync', 'Real-time microphone & desktop visualizer light sync mode'],
        ['Lifespan', '35,000 Rated Hours (approx. 25 years at 3.5 hrs/day)'],
        ['Power Factor', '> 0.95 high-efficiency constant current driver'],
        ['Base Fitting', 'Standard E26 / E27 & B22 base options available']
      ]
    },
    'fan-tower': {
      title: 'Aegis BreezeTower Pro - Smart Bladeless Tower Fan',
      specs: [
        ['Oscillation', '120° Wide-Angle motorized smooth oscillation'],
        ['Air Filtration', 'True HEPA H13 Filter (captures 99.97% of 0.3μm particulates)'],
        ['Connectivity', 'Wi-Fi 2.4GHz + RF Remote + Voice Control'],
        ['Wind Modes', 'Normal, Natural Wind, Sleep Whisper, Turbo Max'],
        ['Display', 'Hidden LED touch interface with ambient light auto-dimming'],
        ['Safety', 'Child-safe bladeless architecture with tip-over auto-cutoff']
      ]
    },
    'hub-chimelink': {
      title: 'Aegis ChimeLink Hub - Multi-Room Wi-Fi Chime & Extender',
      specs: [
        ['Tones', '32 High-fidelity polyphonic and spatial digital ringtones'],
        ['Sound Output', 'Adjustable 4-level volume up to 105 dB with LED flash'],
        ['Connectivity', 'Wi-Fi 2.4 GHz + 433 MHz long-range proprietary RF link'],
        ['Range', 'Up to 300 meters open field range to Aegis Bell Pro'],
        ['Design', 'Compact wall plug-in pass-through AC outlet design'],
        ['Multi-Pairing', 'Supports pairing with up to 10 Aegis sensors and bells']
      ]
    }
  };

  document.querySelectorAll('.open-spec-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prodId = btn.getAttribute('data-product-id');
      const data = productSpecsDB[prodId];
      if (!data) return;

      modalTitle.innerText = data.title;
      let rowsHtml = '';
      data.specs.forEach(([label, val]) => {
        rowsHtml += `<tr><td>${label}</td><td>${val}</td></tr>`;
      });
      modalBody.innerHTML = `<table class="spec-table">${rowsHtml}</table>`;
      modalBackdrop.classList.add('open');
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      modalBackdrop.classList.remove('open');
    });
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('open');
      }
    });
  }

  // -------------------------------------------------------------------------
  // 8. FAQ ACCORDION
  // -------------------------------------------------------------------------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others for neat single-accordion or toggle
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // -------------------------------------------------------------------------
  // 9. INQUIRY / CONTACT FORM & TOAST
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const toastNotice = document.getElementById('toast-notice');
  const toastMsg = document.getElementById('toast-msg');
  let toastTimer = null;

  function showToast(message) {
    if (!toastNotice || !toastMsg) return;
    toastMsg.innerText = message;
    toastNotice.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3800);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('✅ Inquiry received! Our IoT solutions architect will reach out shortly.');
      contactForm.reset();
    });
  }
});
