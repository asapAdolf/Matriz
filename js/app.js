/**
 * Aplicación Principal - PSP Matriz de Tiempos
 * Orquesta los módulos de UI, Cronómetro, Cálculos, Almacenamiento y Exportación
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializar Módulo de UI
    PSPUI.init();

    // Referencias del Formulario
    const form = document.getElementById('timeLogForm');
    const dateInput = document.getElementById('date');
    const phaseInput = document.getElementById('phase');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    const interruptionsInput = document.getElementById('interruptions');
    const commentsInput = document.getElementById('comments');

    // Botones de acción general
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    const clearDataBtn = document.getElementById('clearDataBtn');
    const btnStartPause = document.getElementById('btnStartPause');
    const btnStop = document.getElementById('btnStop');

    // Establecer fecha de hoy por defecto al cargar
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }

    /**
     * Refresca la vista de la tabla y el resumen de métricas con los registros de almacenamiento
     */
    function refreshTable() {
        const logs = PSPStorage.getAll();
        PSPUI.renderTable(logs, handleDeleteItem);
        const summary = PSPCalculator.calculateSummary(logs);
        PSPUI.renderSummary(summary);
    }

    /**
     * Manejador para eliminar un registro individual
     * @param {number} index 
     */
    function handleDeleteItem(index) {
        PSPUI.showConfirm('Eliminar registro', '¿Estás seguro de que deseas borrar esta entrada?', () => {
            PSPStorage.remove(index);
            refreshTable();
        });
    }

    // 2. Inicializar Cronómetro
    PSPTimer.init({
        onTick: (activeMs) => {
            PSPUI.updateChronoDisplay(PSPCalculator.formatTimeDisplay(activeMs));
        },
        onStateChange: (state, meta = {}) => {
            if (state === 'running') {
                PSPUI.updateChronoStatus('En progreso...', 'text-sm text-green-400 font-medium');
                PSPUI.updateChronoButtons(
                    'Pausar (Interrupción)',
                    'bg-yellow-600 hover:bg-yellow-500 text-white font-medium py-2 px-4 rounded-lg transition-colors',
                    true
                );
                if (meta.realWorldStartTime) {
                    if (dateInput && !dateInput.value) {
                        dateInput.valueAsDate = meta.realWorldStartTime;
                    }
                    if (startTimeInput) {
                        startTimeInput.value = PSPCalculator.getHHMM(meta.realWorldStartTime);
                    }
                    if (interruptionsInput) {
                        interruptionsInput.value = '0';
                    }
                }
            } else if (state === 'paused') {
                PSPUI.updateChronoStatus('Pausado (En Interrupción)', 'text-sm text-yellow-400 font-medium');
                PSPUI.updateChronoButtons(
                    'Reanudar',
                    'bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-lg transition-colors',
                    true
                );
                PSPUI.updateInterruptionsBadge(true, meta.totalInterruptionMinutes ?? 0);
            } else if (state === 'stopped') {
                PSPUI.updateChronoDisplay('00:00:00');
                PSPUI.updateChronoStatus('Detenido (Interrupciones guardadas)', 'text-sm text-blue-400 font-medium');
                PSPUI.updateChronoButtons(
                    'Iniciar',
                    'bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-colors',
                    false
                );
            }
        }
    });

    // Evento Iniciar / Pausar / Reanudar
    if (btnStartPause) {
        btnStartPause.addEventListener('click', () => {
            const currentState = PSPTimer.getState();

            if (currentState === 'stopped') {
                PSPTimer.start();
                PSPUI.updateInterruptionsBadge(false);
            } else if (currentState === 'running') {
                PSPTimer.pause();
            } else if (currentState === 'paused') {
                PSPTimer.resume();
            }
        });
    }

    // Evento Detener Cronómetro
    if (btnStop) {
        btnStop.addEventListener('click', () => {
            const currentState = PSPTimer.getState();
            if (currentState === 'stopped') return;

            const result = PSPTimer.stop();
            if (interruptionsInput) {
                interruptionsInput.value = result.interruptionMinutes;
            }

            PSPUI.showAlert(
                'Cronómetro Detenido',
                'Las interrupciones han sido registradas. La hora de fin se registrará automáticamente al guardar el formulario.'
            );
        });
    }

    // Evento Guardar Formulario
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!startTimeInput.value) {
                PSPUI.showAlert('Atención', 'Debes iniciar el cronómetro primero para registrar la Hora de Inicio.');
                return;
            }

            // Si el cronómetro sigue activo, detenerlo para consolidar las interrupciones
            if (PSPTimer.getState() !== 'stopped') {
                const stopResult = PSPTimer.stop();
                if (interruptionsInput) {
                    interruptionsInput.value = stopResult.interruptionMinutes;
                }
            }

            // Registrar Hora Fin con la hora actual
            const actualDate = new Date();
            const endTimeStr = PSPCalculator.getHHMM(actualDate);
            if (endTimeInput) {
                endTimeInput.value = endTimeStr;
            }

            const date = dateInput.value;
            const phase = phaseInput.value;
            const startTime = startTimeInput.value;
            const endTime = endTimeStr;
            const interruptions = interruptionsInput.value;
            const comments = commentsInput.value;

            const delta = PSPCalculator.calculateDelta(startTime, endTime, interruptions);

            const newLog = {
                date,
                phase,
                startTime,
                endTime,
                interruptions: parseInt(interruptions, 10) || 0,
                delta,
                comments: comments ? comments.trim() : ''
            };

            // Guardar registro
            PSPStorage.add(newLog);
            refreshTable();

            // Limpiar campos para el siguiente registro
            startTimeInput.value = '';
            endTimeInput.value = '';
            interruptionsInput.value = '0';
            commentsInput.value = '';
            
            PSPTimer.reset();
            PSPUI.updateChronoStatus('Detenido', 'text-sm text-gray-400');
            PSPUI.updateInterruptionsBadge(false);
        });
    }

    // Evento Exportar a Excel
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', () => {
            const logs = PSPStorage.getAll();
            PSPExport.exportToExcel(logs, PSPUI);
        });
    }

    // Evento Borrar Todo
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            const logs = PSPStorage.getAll();
            if (logs.length === 0) return;

            PSPUI.showConfirm(
                'Borrar todos los datos',
                'Esta acción eliminará permanentemente todos los registros. ¿Deseas continuar?',
                () => {
                    PSPStorage.clear();
                    refreshTable();
                }
            );
        });
    }

    // Renderizado inicial de la tabla y resumen
    refreshTable();
});
