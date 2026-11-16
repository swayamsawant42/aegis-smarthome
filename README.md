# Nexura IoT — Smart Home Automation Web Portal

A modern, high-performance, responsive corporate showcase and interactive product simulator for **Nexura IoT**, a technology company specializing in generic, universal, Wi-Fi-enabled smart home appliances (smart bells, whisper-quiet BLDC fans, dual-inverter ACs, and atmospheric tunable lighting).

Designed specifically for **GitHub Pages** deployment with zero build steps, zero external dependencies, and instantaneous load times.

---

## 🌟 Live Features & Interactive Highlights

1. **Interactive Living Room Simulator (Web Sandbox)**:
   - **Smart HaloBell Pro**: Interactive "Ring Doorbell" trigger featuring real-time Web Audio API synthesizer polyphonic chimes, simulated 2K HDR camera preview, motion detection alerts, and two-way talk toggles.
   - **Smart AeroFlow Fan**: Real-time aerodynamic spinning fan visualization that responds to 5 digital speed levels and an on/off toggle, showing live calculated RPM.
   - **Smart FrostSense Inverter AC**: Digital thermostat with temperature adjustment controls (+/-), cooling air animation, operating modes (*Cool*, *Eco*, *Turbo*, *Dry*), and dynamic wattage power draw readouts.
   - **Smart LuminaGlow Light**: Ambient color palette switcher (*Cyber Cyan*, *Sunset Warm*, *Midnight Violet*, *Zen Emerald*, *Pure Daylight*) and brightness slider that dynamically tint the room's ambient glow.
2. **Hero Dashboard Quick Controls**: Floating real-time mini-hub synchronized with the simulator.
3. **Product Catalog with Dynamic Filtering**:
   - Filter pills for *All Products*, *Smart Bells*, *Smart Fans*, *Smart AC & Climate*, and *Smart Lighting*.
   - Technical specifications modal providing in-depth hardware, electrical, and network specs.
4. **Interactive Energy Savings Estimator**:
   - Custom sliders for number of rooms and connected smart devices to estimate annual utility savings (\$), kilowatt-hours saved (kWh), and carbon offset (kg).
5. **Open IoT Architecture & Compatibility Showcase**:
   - Details on direct-to-router Wi-Fi 6, Matter 1.3 over Wi-Fi, Local-First execution, WPA3 encryption, and Home Assistant REST/MQTT support.
6. **Dark / Light Mode Toggle**: Smooth theme transition with `localStorage` state persistence.
7. **Interactive FAQ Accordion & Inquiry Form**: Validated inquiry form with feedback toast notifications.

---

## 🚀 How to Publish to GitHub Pages

### Method 1: Via GitHub Web Interface (Easiest)
1. Create a new repository on [GitHub](https://github.com/new) (e.g. `nexura-smarthome` or `<your-username>.github.io`).
2. Upload the files (`index.html`, `css/style.css`, `js/app.js`, and `README.md`) to the repository.
3. In your GitHub repository, click on **Settings** > **Pages** (under the "Code and automation" section in the left sidebar).
4. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
5. Under **Branch**, select `main` (or `master`) and folder `/ (root)`, then click **Save**.
6. Within 1–2 minutes, your website will be live at:
   ```
   https://<your-username>.github.io/<repo-name>/
   ```

---

### Method 2: Via Git Command Line
Inside this directory (`/Users/swayam/.gemini/antigravity/scratch/smarthome-website`):

```bash
# 1. Initialize git repository
git init

# 2. Add all files and make initial commit
git add .
git commit -m "Initial commit: Nexura Smart Home website"

# 3. Rename branch to main
git branch -M main

# 4. Link to your remote GitHub repository
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 5. Push to GitHub
git push -u origin main
```
Then go to **Repository Settings** > **Pages** and enable GitHub Pages on the `main` branch.

---

## 📁 Project Structure

```
smarthome-website/
├── index.html          # Semantic HTML5 structure & open-graph metadata
├── css/
│   └── style.css       # Responsive styling, CSS variables, glassmorphism & animations
├── js/
│   └── app.js          # Simulator logic, Web Audio synthesizer, calculators & modal
└── README.md           # Deployment documentation
```

---

## 🛠️ Local Testing
To preview the website locally before publishing:
- Simply double click `index.html` in your file explorer, OR
- Start a quick local server:
  ```bash
  python3 -m http.server 8080
  ```
  Then open `http://localhost:8080` in your web browser.
