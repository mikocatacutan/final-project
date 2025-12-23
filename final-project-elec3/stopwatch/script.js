/**
 * Elite Stopwatch - Professional Timing Application
 * Features: High-precision timing, keyboard controls
 */

class Stopwatch {
    constructor(config) {
        this.config = config;
        this.elapsedMs = 0;
        this.isRunning = false;
        this.rafId = null;
        this.startTimestamp = 0;
    }

    /**
     * Start the stopwatch
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.startTimestamp = performance.now() - this.elapsedMs;
        this.#loop();
        this.#updateControls();
        this.#updatePulse(true);
    }

    /**
     * Stop the stopwatch
     */
    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        cancelAnimationFrame(this.rafId);
        this.#updateControls();
        this.#updatePulse(false);
    }

    /**
     * Toggle between start and stop
     */
    toggle() {
        this.isRunning ? this.stop() : this.start();
    }

    /**
     * Reset the stopwatch
     */
    reset() {
        if (this.isRunning) return;
        this.stop();
        this.elapsedMs = 0;
        this.#renderTime();
        this.#updateControls();
    }

    /**
     * Animation loop for continuous time updates
     */
    #loop = () => {
        if (!this.isRunning) return;
        this.elapsedMs = performance.now() - this.startTimestamp;
        this.#renderTime();
        this.rafId = requestAnimationFrame(this.#loop);
    };

    /**
     * Render the current time on display
     */
    #renderTime() {
        const { h, m, s, cs } = this.#splitTime(this.elapsedMs);
        this.config.timeElements.hours.textContent = h;
        this.config.timeElements.minutes.textContent = m;
        this.config.timeElements.seconds.textContent = s;
        this.config.timeElements.milliseconds.textContent = cs;
    }

    /**
     * Split elapsed time into components
     */
    #splitTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        const centiseconds = Math.floor((ms % 1000) / 10);

        return {
            h: String(h).padStart(2, '0'),
            m: String(m).padStart(2, '0'),
            s: String(s).padStart(2, '0'),
            cs: String(centiseconds).padStart(2, '0')
        };
    }

    /**
     * Update control button states
     */
    #updateControls() {
        const label = this.isRunning ? 'Stop' : (this.elapsedMs ? 'Resume' : 'Start');
        this.config.toggleLabel.textContent = label;
        this.config.resetBtn.disabled = this.isRunning;
        this.config.toggleBtn.classList.toggle('active', this.isRunning);
    }

    /**
     * Update pulse animation
     */
    #updatePulse(isActive) {
        const pulse = document.getElementById('pulse');
        if (pulse) {
            pulse.classList.toggle('active', isActive);
        }
    }
}

// DOM element configuration
const stopwatchConfig = {
    timeElements: {
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
        milliseconds: document.getElementById('milliseconds')
    },
    toggleBtn: document.querySelector('[data-action="toggle"]'),
    resetBtn: document.querySelector('[data-action="reset"]'),
    toggleLabel: document.getElementById('startStopText')
};

// Initialize stopwatch instance
const stopwatch = new Stopwatch(stopwatchConfig);

/**
 * Setup button controls
 */
function initializeControls() {
    stopwatchConfig.toggleBtn.addEventListener('click', () => stopwatch.toggle());
    stopwatchConfig.resetBtn.addEventListener('click', () => stopwatch.reset());
}

/**
 * Setup keyboard shortcuts
 */
function initializeKeyboard() {
    document.addEventListener('keydown', (event) => {
        const key = event.key.toLowerCase();

        if (key === ' ' || key === 'spacebar') {
            event.preventDefault();
            stopwatch.toggle();
        } else if (key === 'r') {
            event.preventDefault();
            stopwatch.reset();
        }
    });
}

// Initialize the app
initializeControls();
initializeKeyboard();
stopwatch.reset();
