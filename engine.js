// Main Physics Engine for Sandboxels
// Handles particle simulation, physics, and rendering

class Particle {
    constructor(x, y, element) {
        this.x = x;
        this.y = y;
        this.element = element;
        this.vx = 0;
        this.vy = 0;
        this.temperature = getElement(element)?.temperature || 20;
        this.lifetime = getElement(element)?.lifetime || -1; // -1 = infinite
        this.age = 0;
        this.friction = getElement(element)?.friction || 0.5;
        this.moving = true;
    }

    update(gravity = 0.5, resistance = 0.98) {
        if (this.lifetime > 0) {
            this.age++;
            if (this.age >= this.lifetime) {
                return false; // Particle should be removed
            }
        }

        // Apply gravity
        const el = getElement(this.element);
        if (el && el.state !== 'gas') {
            this.vy += gravity * (el.density / 2);
        }

        // Apply air resistance
        this.vx *= resistance;
        this.vy *= resistance;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        return true; // Particle still alive
    }

    setTemperature(temp) {
        this.temperature = Math.max(-100, Math.min(5000, temp));
    }
}

class SandboxelsEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        // Particle grid for efficient collision detection
        this.grid = new Map();
        this.particles = [];
        this.maxParticles = 100000;

        // Simulation parameters
        this.gravity = 0.5;
        this.airResistance = 0.98;
        this.simSpeed = 1.0;
        this.paused = false;

        // Settings
        this.showGrid = false;
        this.showTemperature = false;
        this.gridSize = 4;

        // Tools
        this.currentTool = 'draw';
        this.currentElement = 'sand';
        this.brushSize = 5;

        // Statistics
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsTime = Date.now();

        this.init();
    }

    init() {
        this.resizeCanvas();
        this.render();
    }

    resizeCanvas() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight - 120; // Account for UI
    }

    // Add particle to simulation
    addParticle(x, y, element) {
        if (this.particles.length >= this.maxParticles) return false;

        const particle = new Particle(x, y, element);
        this.particles.push(particle);
        this.addToGrid(particle);
        return true;
    }

    // Add particles in a circular pattern (brush)
    addBrush(x, y, element, size) {
        let added = 0;
        const radius = size;

        for (let i = 0; i < size * 2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;
            const px = x + Math.cos(angle) * distance;
            const py = y + Math.sin(angle) * distance;

            if (this.addParticle(px, py, element)) {
                added++;
            } else {
                break; // Max particles reached
            }
        }
        return added;
    }

    // Remove particles in brush area
    eraseBrush(x, y, size) {
        const radius = size * size;
        let removed = 0;

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            const dx = p.x - x;
            const dy = p.y - y;
            const distance = dx * dx + dy * dy;

            if (distance < radius) {
                this.removeParticleFromGrid(p);
                this.particles.splice(i, 1);
                removed++;
            }
        }
        return removed;
    }

    // Grid management for optimization
    addToGrid(particle) {
        const key = this.getGridKey(particle.x, particle.y);
        if (!this.grid.has(key)) {
            this.grid.set(key, []);
        }
        this.grid.get(key).push(particle);
    }

    removeParticleFromGrid(particle) {
        const key = this.getGridKey(particle.x, particle.y);
        if (this.grid.has(key)) {
            const arr = this.grid.get(key);
            const idx = arr.indexOf(particle);
            if (idx > -1) arr.splice(idx, 1);
        }
    }

    updateParticleGrid(particle, oldKey) {
        const newKey = this.getGridKey(particle.x, particle.y);
        if (oldKey !== newKey) {
            if (this.grid.has(oldKey)) {
                const arr = this.grid.get(oldKey);
                const idx = arr.indexOf(particle);
                if (idx > -1) arr.splice(idx, 1);
            }
            this.addToGrid(particle);
        }
    }

    getGridKey(x, y) {
        const gridX = Math.floor(x / this.gridSize);
        const gridY = Math.floor(y / this.gridSize);
        return `${gridX},${gridY}`;
    }

    // Update simulation
    update() {
        if (this.paused) return;

        const iterations = Math.ceil(this.simSpeed);

        for (let iter = 0; iter < iterations; iter++) {
            // Update particles
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                const oldKey = this.getGridKey(p.x, p.y);

                if (!p.update(this.gravity, this.airResistance)) {
                    this.removeParticleFromGrid(p);
                    this.particles.splice(i, 1);
                    continue;
                }

                // Boundary collision
                if (p.x < 0) p.x = 0;
                if (p.x >= this.width) p.x = this.width - 1;
                if (p.y < 0) p.y = 0;
                if (p.y >= this.height) {
                    p.y = this.height - 1;
                    p.vy = 0;
                }

                // Check collisions and reactions
                this.checkCollisions(p);
                this.checkReactions(p);

                // Update grid position
                const newKey = this.getGridKey(p.x, p.y);
                if (oldKey !== newKey) {
                    this.updateParticleGrid(p, oldKey);
                }
            }
        }
    }

    // Check collisions with other particles
    checkCollisions(particle) {
        const key = this.getGridKey(particle.x, particle.y);
        const nearby = this.getNearbyCells(key);

        for (const k of nearby) {
            if (!this.grid.has(k)) continue;
            const cells = this.grid.get(k);

            for (const other of cells) {
                if (particle === other) continue;

                const dx = other.x - particle.x;
                const dy = other.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 2) {
                    // Collision detected
                    const el1 = getElement(particle.element);
                    const el2 = getElement(other.element);

                    // Density-based pushing
                    if (el1 && el2) {
                        if (el1.density > el2.density) {
                            other.vx += Math.sign(dx) * 0.5;
                            other.vy += Math.sign(dy) * 0.5;
                        } else if (el2.density > el1.density) {
                            particle.vx -= Math.sign(dx) * 0.5;
                            particle.vy -= Math.sign(dy) * 0.5;
                        }
                    }
                }
            }
        }
    }

    // Check chemical reactions
    checkReactions(particle) {
        const key = this.getGridKey(particle.x, particle.y);
        const nearby = this.getNearbyCells(key);

        for (const k of nearby) {
            if (!this.grid.has(k)) continue;
            const cells = this.grid.get(k);

            for (const other of cells) {
                if (particle === other) continue;

                const dx = other.x - particle.x;
                const dy = other.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 3) {
                    const reaction = reactionEngine.executeReaction(particle.element, other.element);
                    if (reaction) {
                        if (reaction.explosive) {
                            this.createExplosion(particle.x, particle.y, 1.0);
                        }

                        // Replace particles with reaction result
                        particle.element = reaction.result;
                        other.element = reaction.result;

                        // Update temperatures
                        particle.setTemperature(particle.temperature + 100);
                        other.setTemperature(other.temperature + 100);
                    }
                }
            }
        }
    }

    // Get nearby grid cells (for optimization)
    getNearbyCells(key) {
        const [x, y] = key.split(',').map(Number);
        const cells = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                cells.push(`${x + dx},${y + dy}`);
            }
        }
        return cells;
    }

    // Create explosion effect
    createExplosion(x, y, power = 1.0) {
        const radius = 50 * power;
        const force = 5 * power;

        for (const particle of this.particles) {
            const dx = particle.x - x;
            const dy = particle.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < radius && dist > 0) {
                const force_mult = (1 - dist / radius) * force;
                particle.vx += (dx / dist) * force_mult;
                particle.vy += (dy / dist) * force_mult;
                particle.setTemperature(particle.temperature + 500 * power);
            }
        }
    }

    // Save simulation state
    saveState() {
        const state = {
            particles: this.particles.map(p => ({
                x: p.x,
                y: p.y,
                element: p.element,
                vx: p.vx,
                vy: p.vy,
                temperature: p.temperature,
                lifetime: p.lifetime
            })),
            timestamp: Date.now()
        };
        localStorage.setItem('sandboxels_save', JSON.stringify(state));
        return true;
    }

    // Load simulation state
    loadState() {
        const saved = localStorage.getItem('sandboxels_save');
        if (!saved) return false;

        try {
            const state = JSON.parse(saved);
            this.particles = [];
            this.grid.clear();

            for (const p of state.particles) {
                const particle = new Particle(p.x, p.y, p.element);
                particle.vx = p.vx;
                particle.vy = p.vy;
                particle.temperature = p.temperature;
                particle.lifetime = p.lifetime;
                this.particles.push(particle);
                this.addToGrid(particle);
            }
            return true;
        } catch (e) {
            console.error('Failed to load state:', e);
            return false;
        }
    }

    // Clear all particles
    clear() {
        this.particles = [];
        this.grid.clear();
    }

    // Render simulation
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw grid if enabled
        if (this.showGrid) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            this.ctx.lineWidth = 0.5;
            for (let x = 0; x < this.width; x += this.gridSize) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.height);
                this.ctx.stroke();
            }
            for (let y = 0; y < this.height; y += this.gridSize) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.width, y);
                this.ctx.stroke();
            }
        }

        // Draw particles
        for (const particle of this.particles) {
            const el = getElement(particle.element);
            if (!el) continue;

            // Particle color
            let color = el.color;

            // Show temperature if enabled
            if (this.showTemperature) {
                color = this.getTemperatureColor(particle.temperature);
            }

            // Draw particle
            this.ctx.fillStyle = color;
            this.ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2);
        }

        // Update FPS
        this.frameCount++;
        const now = Date.now();
        if (now - this.lastFpsTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsTime = now;
            document.getElementById('fps').textContent = this.fps;
        }

        // Update particle count
        document.getElementById('particleCount').textContent = this.particles.length;
    }

    // Get color based on temperature
    getTemperatureColor(temp) {
        if (temp < -50) return '#0066ff'; // Deep blue for cold
        if (temp < 0) return '#33ccff';   // Light blue for cool
        if (temp < 100) return '#ffff00'; // Yellow for warm
        if (temp < 300) return '#ff8800'; // Orange for hot
        if (temp < 800) return '#ff0000'; // Red for very hot
        return '#ff00ff'; // Magenta for plasma
    }
}

// Global engine instance
let engine = null;

// Initialize on page load
window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    engine = new SandboxelsEngine(canvas);

    // Setup event listeners
    setupEventListeners();

    // Start game loop
    gameLoop();
});

function gameLoop() {
    engine.update();
    engine.render();
    requestAnimationFrame(gameLoop);
}

// Event listeners setup
function setupEventListeners() {
    const canvas = document.getElementById('canvas');
    let isDrawing = false;

    // Mouse events
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        handleDraw(e);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) handleDraw(e);
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
        isDrawing = true;
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        handleDraw(mouseEvent);
    });

    canvas.addEventListener('touchmove', (e) => {
        if (!isDrawing) return;
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        handleDraw(mouseEvent);
    });

    canvas.addEventListener('touchend', () => {
        isDrawing = false;
    });

    // Tool buttons
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            engine.currentTool = btn.dataset.tool;
        });
    });

    // Brush size
    const brushSizeInput = document.getElementById('brushSize');
    brushSizeInput.addEventListener('input', (e) => {
        engine.brushSize = parseInt(e.target.value);
        document.getElementById('brushSizeLabel').textContent = e.target.value;
    });

    // Element search
    const elementSearch = document.getElementById('elementSearch');
    elementSearch.addEventListener('input', updateElementList);

    // Buttons
    document.getElementById('pauseBtn').addEventListener('click', () => {
        engine.paused = !engine.paused;
        document.getElementById('pauseBtn').textContent = engine.paused ? 'Resume' : 'Pause';
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
        if (confirm('Clear all particles?')) {
            engine.clear();
        }
    });

    document.getElementById('saveBtn').addEventListener('click', () => {
        engine.saveState();
        alert('Saved!');
    });

    document.getElementById('loadBtn').addEventListener('click', () => {
        if (engine.loadState()) {
            alert('Loaded!');
        } else {
            alert('No saved state found!');
        }
    });

    document.getElementById('settingsBtn').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.add('active');
    });

    // Settings modal
    document.querySelector('.close-btn').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.remove('active');
    });

    document.getElementById('showGridToggle').addEventListener('change', (e) => {
        engine.showGrid = e.target.checked;
    });

    document.getElementById('showTempToggle').addEventListener('change', (e) => {
        engine.showTemperature = e.target.checked;
    });

    document.getElementById('simSpeed').addEventListener('input', (e) => {
        engine.simSpeed = parseFloat(e.target.value);
        document.getElementById('simSpeedLabel').textContent = e.target.value + 'x';
    });

    document.getElementById('maxParticles').addEventListener('input', (e) => {
        engine.maxParticles = parseInt(e.target.value);
        document.getElementById('maxParticlesLabel').textContent = e.target.value;
    });

    // Initialize element list
    updateElementList();
}

// Handle drawing
function handleDraw(e) {
    if (!engine) return;

    const rect = engine.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || x >= engine.width || y < 0 || y >= engine.height) return;

    if (engine.currentTool === 'draw') {
        engine.addBrush(x, y, engine.currentElement, engine.brushSize);
    } else if (engine.currentTool === 'erase') {
        engine.eraseBrush(x, y, engine.brushSize);
    }
}

// Update element list
function updateElementList() {
    const search = document.getElementById('elementSearch').value.toLowerCase();
    const list = document.getElementById('elementList');
    list.innerHTML = '';

    const allElements = getAllElementNames();
    const filtered = allElements.filter(name => name.includes(search));

    for (const name of filtered) {
        const el = getElement(name);
        const btn = document.createElement('button');
        btn.className = 'element-btn';
        if (engine && engine.currentElement === name) {
            btn.classList.add('active');
        }

        btn.innerHTML = `
            <div class="element-color" style="background-color: ${el.color}"></div>
            <span>${el.name}</span>
        `;

        btn.addEventListener('click', () => {
            engine.currentElement = name;
            document.querySelectorAll('.element-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });

        list.appendChild(btn);
    }
}

// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
    if (!engine) return;
    if (e.key === 'b' || e.key === 'B') engine.currentTool = 'draw';
    if (e.key === 'e' || e.key === 'E') engine.currentTool = 'erase';
    if (e.key === 'c' || e.key === 'C') engine.clear();
    if (e.key === ' ') engine.paused = !engine.paused;
});

// Handle window resize
window.addEventListener('resize', () => {
    if (engine) engine.resizeCanvas();
});
