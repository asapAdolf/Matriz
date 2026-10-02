/**
 * Módulo de Cálculos y Formateo de Tiempo para Matriz PSP
 */
window.PSPCalculator = (function () {
    /**
     * Formatea milisegundos a formato HH:MM:SS
     * @param {number} ms 
     * @returns {string}
     */
    function formatTimeDisplay(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Extrae hora y minutos en formato HH:MM de un objeto Date
     * @param {Date} dateObj 
     * @returns {string}
     */
    function getHHMM(dateObj) {
        const h = dateObj.getHours().toString().padStart(2, '0');
        const m = dateObj.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
    }

    /**
     * Formatea minutos a una cadena amigable "X h Y min" o "Y min"
     * @param {number} totalMinutes 
     * @returns {string}
     */
    function formatMinutes(totalMinutes) {
        const mins = Math.max(0, parseInt(totalMinutes, 10) || 0);
        const hours = Math.floor(mins / 60);
        const remainingMins = mins % 60;

        if (hours === 0) {
            return `${remainingMins} min`;
        }
        return `${hours} h ${remainingMins} min`;
    }

    /**
     * Calcula la diferencia neta de tiempo en minutos (Delta)
     * descontando el tiempo de interrupción y contemplando cambio de medianoche.
     * @param {string} startTime - Formato "HH:MM"
     * @param {string} endTime - Formato "HH:MM"
     * @param {number|string} interruptions - Minutos de interrupción
     * @returns {number}
     */
    function calculateDelta(startTime, endTime, interruptions) {
        if (!startTime || !endTime) return 0;

        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        let startTotalMins = (startHour * 60) + startMin;
        let endTotalMins = (endHour * 60) + endMin;

        // Cruce de medianoche si la hora fin es menor a la de inicio
        if (endTotalMins < startTotalMins) {
            endTotalMins += 24 * 60;
        }

        const interruptionMins = parseInt(interruptions, 10) || 0;
        const delta = (endTotalMins - startTotalMins) - interruptionMins;

        return delta < 0 ? 0 : delta;
    }

    /**
     * Genera un resumen estadístico completo de todos los registros
     * @param {Array<Object>} logs 
     * @returns {Object}
     */
    function calculateSummary(logs = []) {
        let totalDelta = 0;
        let totalInterruptions = 0;
        const phaseMap = {};

        logs.forEach(log => {
            const delta = parseInt(log.delta, 10) || 0;
            const interruptions = parseInt(log.interruptions, 10) || 0;
            const phase = log.phase || 'Sin fase';

            totalDelta += delta;
            totalInterruptions += interruptions;

            if (!phaseMap[phase]) {
                phaseMap[phase] = {
                    phase,
                    minutes: 0,
                    count: 0
                };
            }
            phaseMap[phase].minutes += delta;
            phaseMap[phase].count += 1;
        });

        const totalGross = totalDelta + totalInterruptions;

        // Calcular porcentaje por fase
        const byPhase = Object.values(phaseMap).map(item => ({
            ...item,
            percentage: totalDelta > 0 ? Math.round((item.minutes / totalDelta) * 100) : 0
        })).sort((a, b) => b.minutes - a.minutes);

        return {
            totalLogs: logs.length,
            totalDelta,
            totalInterruptions,
            totalGross,
            totalDeltaFormatted: formatMinutes(totalDelta),
            totalInterruptionsFormatted: formatMinutes(totalInterruptions),
            totalGrossFormatted: formatMinutes(totalGross),
            byPhase,
            activePhasesCount: byPhase.length
        };
    }

    return {
        formatTimeDisplay,
        getHHMM,
        formatMinutes,
        calculateDelta,
        calculateSummary
    };
})();
