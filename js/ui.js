/**
 * Módulo de Manejo de Interfaz de Usuario (UI) para Matriz PSP
 */
window.PSPUI = (function () {
    // Referencias de Modales
    let confirmModal, confirmTitle, confirmMessage, confirmCancel, confirmOk;
    let alertModal, alertTitle, alertMessage, alertOk;
    let confirmCallback = null;

    // Referencias de Cronómetro
    let chronoDisplay, chronoStatus, btnStartPause, btnStop, chronoInterruptions, chronoIntTime;

    // Referencias de Tabla
    let dataTableBody, emptyState, dataTableFoot;
    let footTotalInterruptions, footTotalDelta, footSummaryText;

    // Referencias de Resumen
    let summaryTotalDelta, summaryTotalDeltaFormatted;
    let summaryTotalInterruptions, summaryTotalInterruptionsFormatted;
    let summaryTotalGross, summaryTotalGrossFormatted;
    let summaryTotalLogs, summaryTotalPhases;
    let phaseBreakdownContainer, phaseBreakdownList, phaseBreakdownCount;

    /**
     * Inicializa las referencias de elementos del DOM
     */
    function init() {
        confirmModal = document.getElementById('confirmModal');
        confirmTitle = document.getElementById('confirmTitle');
        confirmMessage = document.getElementById('confirmMessage');
        confirmCancel = document.getElementById('confirmCancel');
        confirmOk = document.getElementById('confirmOk');

        alertModal = document.getElementById('alertModal');
        alertTitle = document.getElementById('alertTitle');
        alertMessage = document.getElementById('alertMessage');
        alertOk = document.getElementById('alertOk');

        chronoDisplay = document.getElementById('chronoDisplay');
        chronoStatus = document.getElementById('chronoStatus');
        btnStartPause = document.getElementById('btnStartPause');
        btnStop = document.getElementById('btnStop');
        chronoInterruptions = document.getElementById('chronoInterruptions');
        chronoIntTime = document.getElementById('chronoIntTime');

        dataTableBody = document.getElementById('dataTableBody');
        emptyState = document.getElementById('emptyState');
        dataTableFoot = document.getElementById('dataTableFoot');
        footTotalInterruptions = document.getElementById('footTotalInterruptions');
        footTotalDelta = document.getElementById('footTotalDelta');
        footSummaryText = document.getElementById('footSummaryText');

        summaryTotalDelta = document.getElementById('summaryTotalDelta');
        summaryTotalDeltaFormatted = document.getElementById('summaryTotalDeltaFormatted');
        summaryTotalInterruptions = document.getElementById('summaryTotalInterruptions');
        summaryTotalInterruptionsFormatted = document.getElementById('summaryTotalInterruptionsFormatted');
        summaryTotalGross = document.getElementById('summaryTotalGross');
        summaryTotalGrossFormatted = document.getElementById('summaryTotalGrossFormatted');
        summaryTotalLogs = document.getElementById('summaryTotalLogs');
        summaryTotalPhases = document.getElementById('summaryTotalPhases');
        phaseBreakdownContainer = document.getElementById('phaseBreakdownContainer');
        phaseBreakdownList = document.getElementById('phaseBreakdownList');
        phaseBreakdownCount = document.getElementById('phaseBreakdownCount');

        // Eventos de modales
        if (confirmCancel) {
            confirmCancel.addEventListener('click', hideConfirm);
        }
        if (confirmOk) {
            confirmOk.addEventListener('click', () => {
                if (typeof confirmCallback === 'function') {
                    confirmCallback();
                }
                hideConfirm();
            });
        }
        if (alertOk) {
            alertOk.addEventListener('click', hideAlert);
        }
    }

    function showConfirm(title, message, onConfirm) {
        if (!confirmModal) return;
        confirmTitle.textContent = title;
        confirmMessage.textContent = message;
        confirmCallback = onConfirm;
        confirmModal.classList.remove('hidden');
        const container = confirmModal.querySelector('div');
        if (container) {
            container.classList.replace('scale-95', 'scale-100');
        }
    }

    function hideConfirm() {
        if (!confirmModal) return;
        confirmModal.classList.add('hidden');
        const container = confirmModal.querySelector('div');
        if (container) {
            container.classList.replace('scale-100', 'scale-95');
        }
        confirmCallback = null;
    }

    function showAlert(title, message) {
        if (!alertModal) return;
        alertTitle.textContent = title;
        alertMessage.textContent = message;
        alertModal.classList.remove('hidden');
    }

    function hideAlert() {
        if (!alertModal) return;
        alertModal.classList.add('hidden');
    }

    function updateChronoDisplay(text) {
        if (chronoDisplay) chronoDisplay.textContent = text;
    }

    function updateChronoStatus(text, cssClass) {
        if (!chronoStatus) return;
        chronoStatus.textContent = text;
        chronoStatus.className = cssClass || 'text-sm text-gray-400';
    }

    function updateChronoButtons(startPauseText, startPauseClass, stopEnabled) {
        if (btnStartPause) {
            btnStartPause.textContent = startPauseText;
            btnStartPause.className = startPauseClass;
        }
        if (btnStop) {
            btnStop.disabled = !stopEnabled;
            if (stopEnabled) {
                btnStop.classList.remove('opacity-50', 'cursor-not-allowed');
            } else {
                btnStop.classList.add('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    function updateInterruptionsBadge(visible, minutes = 0) {
        if (!chronoInterruptions) return;
        if (visible) {
            chronoInterruptions.classList.remove('hidden');
            if (chronoIntTime) chronoIntTime.textContent = minutes;
        } else {
            chronoInterruptions.classList.add('hidden');
            if (chronoIntTime) chronoIntTime.textContent = '0';
        }
    }

    /**
     * Actualiza el panel de resumen de tiempos totales y distribución de fases
     * @param {Object} summary 
     */
    function renderSummary(summary) {
        if (!summary) return;

        if (summaryTotalDelta) summaryTotalDelta.textContent = `${summary.totalDelta} min`;
        if (summaryTotalDeltaFormatted) summaryTotalDeltaFormatted.textContent = summary.totalDeltaFormatted;

        if (summaryTotalInterruptions) summaryTotalInterruptions.textContent = `${summary.totalInterruptions} min`;
        if (summaryTotalInterruptionsFormatted) summaryTotalInterruptionsFormatted.textContent = summary.totalInterruptionsFormatted;

        if (summaryTotalGross) summaryTotalGross.textContent = `${summary.totalGross} min`;
        if (summaryTotalGrossFormatted) summaryTotalGrossFormatted.textContent = summary.totalGrossFormatted;

        if (summaryTotalLogs) summaryTotalLogs.textContent = summary.totalLogs;
        if (summaryTotalPhases) {
            const count = summary.activePhasesCount;
            summaryTotalPhases.textContent = `${count} ${count === 1 ? 'fase activa' : 'fases activas'}`;
        }

        // Desglose de fases
        if (phaseBreakdownContainer && phaseBreakdownList) {
            if (summary.byPhase && summary.byPhase.length > 0) {
                phaseBreakdownContainer.classList.remove('hidden');
                if (phaseBreakdownCount) {
                    phaseBreakdownCount.textContent = `${summary.byPhase.length} fases registradas`;
                }
                phaseBreakdownList.innerHTML = summary.byPhase.map(item => `
                    <div class="flex items-center gap-2 bg-gray-700/60 border border-gray-600/70 rounded-lg px-3 py-1.5 text-xs text-gray-200">
                        <span class="font-medium text-white">${item.phase}</span>
                        <span class="text-blue-400 font-bold">${item.minutes} min</span>
                        <span class="text-gray-400">(${item.percentage}%)</span>
                        <span class="text-gray-500 text-[10px]">• ${item.count} ${item.count === 1 ? 'reg.' : 'regs.'}</span>
                    </div>
                `).join('');
            } else {
                phaseBreakdownContainer.classList.add('hidden');
                phaseBreakdownList.innerHTML = '';
            }
        }

        // Pie de tabla con totales
        if (dataTableFoot) {
            if (summary.totalLogs > 0) {
                dataTableFoot.classList.remove('hidden');
                if (footTotalInterruptions) footTotalInterruptions.textContent = `${summary.totalInterruptions} min`;
                if (footTotalDelta) footTotalDelta.textContent = `${summary.totalDelta} min`;
                if (footSummaryText) footSummaryText.textContent = `Total neto: ${summary.totalDeltaFormatted}`;
            } else {
                dataTableFoot.classList.add('hidden');
            }
        }
    }

    /**
     * Renderiza la tabla de registros
     * @param {Array<Object>} logs 
     * @param {Function} onDelete 
     */
    function renderTable(logs, onDelete) {
        if (!dataTableBody) return;
        dataTableBody.innerHTML = '';

        if (!logs || logs.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
            if (dataTableFoot) dataTableFoot.classList.add('hidden');
            return;
        }

        if (emptyState) emptyState.classList.add('hidden');

        logs.forEach((log, index) => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-700/50 transition-colors';

            const commentsSafe = log.comments ? String(log.comments).replace(/"/g, '&quot;') : '';

            tr.innerHTML = `
                <td class="p-4 whitespace-nowrap">${log.date || ''}</td>
                <td class="p-4 whitespace-nowrap">
                    <span class="px-2 py-1 bg-gray-600 text-gray-200 rounded-md text-xs font-medium border border-gray-500">${log.phase || ''}</span>
                </td>
                <td class="p-4 whitespace-nowrap">${log.startTime || ''}</td>
                <td class="p-4 whitespace-nowrap">${log.endTime || ''}</td>
                <td class="p-4 whitespace-nowrap text-center text-red-400">${log.interruptions ?? 0}</td>
                <td class="p-4 whitespace-nowrap text-center font-bold text-blue-400 bg-blue-900/20">${log.delta ?? 0}</td>
                <td class="p-4 max-w-xs truncate text-gray-400" title="${commentsSafe}">${log.comments || '-'}</td>
                <td class="p-4 text-center">
                    <button type="button" data-index="${index}" class="btn-delete text-red-400 hover:text-red-300 p-1.5 transition-colors bg-red-900/30 hover:bg-red-900/50 rounded" title="Eliminar registro">
                        <svg class="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </td>
            `;

            const deleteBtn = tr.querySelector('.btn-delete');
            if (deleteBtn && typeof onDelete === 'function') {
                deleteBtn.addEventListener('click', () => onDelete(index));
            }

            dataTableBody.appendChild(tr);
        });
    }

    return {
        init,
        showConfirm,
        hideConfirm,
        showAlert,
        hideAlert,
        updateChronoDisplay,
        updateChronoStatus,
        updateChronoButtons,
        updateInterruptionsBadge,
        renderSummary,
        renderTable
    };
})();
