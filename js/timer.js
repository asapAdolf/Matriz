/**
 * Módulo del Cronómetro de Fase para Matriz PSP
 */
window.PSPTimer = (function () {
    let timerInterval = null;
    let state = 'stopped'; // 'stopped' | 'running' | 'paused'
    let activeStartTime = null;
    let realWorldStartTime = null;
    let totalInterruptionMs = 0;
    let currentPauseStart = null;
    let totalActiveMs = 0;

    let onTickCallback = null;
    let onStateChangeCallback = null;

    function init(callbacks = {}) {
        onTickCallback = callbacks.onTick || null;
        onStateChangeCallback = callbacks.onStateChange || null;
    }

    function getState() {
        return state;
    }

    function getRealWorldStartTime() {
        return realWorldStartTime;
    }

    function getTotalInterruptionMinutes() {
        return Math.floor(totalInterruptionMs / 60000);
    }

    function getCurrentActiveMs() {
        if (state === 'running') {
            return totalActiveMs + (Date.now() - activeStartTime);
        }
        return totalActiveMs;
    }

    function notifyTick() {
        if (onTickCallback) {
            onTickCallback(getCurrentActiveMs());
        }
    }

    function notifyStateChange(meta = {}) {
        if (onStateChangeCallback) {
            onStateChangeCallback(state, meta);
        }
    }

    function start() {
        const now = Date.now();
        realWorldStartTime = new Date();
        activeStartTime = now;
        totalActiveMs = 0;
        totalInterruptionMs = 0;
        state = 'running';

        clearInterval(timerInterval);
        timerInterval = setInterval(notifyTick, 1000);
        notifyTick();
        notifyStateChange({ realWorldStartTime });
    }

    function pause() {
        if (state !== 'running') return;
        const now = Date.now();
        state = 'paused';
        currentPauseStart = now;
        totalActiveMs += (now - activeStartTime);

        clearInterval(timerInterval);
        notifyStateChange({
            totalActiveMs,
            totalInterruptionMinutes: getTotalInterruptionMinutes()
        });
    }

    function resume() {
        if (state !== 'paused') return;
        const now = Date.now();
        state = 'running';

        const pauseDurationMs = now - currentPauseStart;
        totalInterruptionMs += pauseDurationMs;
        activeStartTime = now;

        clearInterval(timerInterval);
        timerInterval = setInterval(notifyTick, 1000);
        notifyTick();
        notifyStateChange({
            totalInterruptionMinutes: getTotalInterruptionMinutes()
        });
    }

    function stop() {
        if (state === 'stopped') return { interruptionMinutes: 0 };

        const now = Date.now();
        if (state === 'running') {
            totalActiveMs += (now - activeStartTime);
        } else if (state === 'paused') {
            const pauseDurationMs = now - currentPauseStart;
            totalInterruptionMs += pauseDurationMs;
        }

        clearInterval(timerInterval);
        state = 'stopped';

        const interruptionMinutes = getTotalInterruptionMinutes();

        notifyStateChange({
            interruptionMinutes,
            totalActiveMs
        });

        return {
            interruptionMinutes,
            totalActiveMs,
            realWorldStartTime
        };
    }

    function reset() {
        clearInterval(timerInterval);
        state = 'stopped';
        activeStartTime = null;
        realWorldStartTime = null;
        totalInterruptionMs = 0;
        currentPauseStart = null;
        totalActiveMs = 0;
        notifyStateChange();
    }

    return {
        init,
        start,
        pause,
        resume,
        stop,
        reset,
        getState,
        getRealWorldStartTime,
        getTotalInterruptionMinutes,
        getCurrentActiveMs
    };
})();
