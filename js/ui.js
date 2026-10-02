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
    let dataTableBody, emptyState;

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
     * Renderiza la tabla de registros
     * @param {Array<Object>} logs 
     * @param {Function} onDelete 
     */
    function renderTable(logs, onDelete) {
        if (!dataTableBody) return;
        dataTableBody.innerHTML = '';

        if (!logs || logs.length === 0) {
            if (emptyState) emptyState.classList.remove('hidden');
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
        renderTable
    };
})();
