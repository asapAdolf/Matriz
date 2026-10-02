/**
 * Módulo de Exportación a Excel para Matriz PSP
 * Utiliza la librería SheetJS (XLSX)
 */
window.PSPExport = (function () {
    /**
     * Exporta la lista de registros a un archivo XLSX
     * @param {Array<Object>} logs 
     * @param {Object} uiService - Referencia al módulo de UI para mostrar alertas
     */
    function exportToExcel(logs, uiService) {
        if (!logs || logs.length === 0) {
            if (uiService) {
                uiService.showAlert('Sin datos', 'No hay registros para exportar. Añade algunos primero.');
            }
            return;
        }

        if (typeof XLSX === 'undefined') {
            if (uiService) {
                uiService.showAlert('Error', 'La biblioteca de exportación a Excel no está disponible.');
            }
            return;
        }

        try {
            // Formatear datos para las columnas del Excel
            const excelData = logs.map(log => ({
                'Fecha': log.date || '',
                'Fase': log.phase || '',
                'Hora Inicio': log.startTime || '',
                'Hora Fin': log.endTime || '',
                'Tiempo Interrupción (min)': log.interruptions ?? 0,
                'Tiempo Delta (min)': log.delta ?? 0,
                'Comentarios': log.comments || ''
            }));

            // Crear libro de trabajo y hoja
            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();

            // Configurar ancho de columnas
            worksheet['!cols'] = [
                { wch: 14 }, // Fecha
                { wch: 16 }, // Fase
                { wch: 14 }, // Hora Inicio
                { wch: 14 }, // Hora Fin
                { wch: 25 }, // Tiempo Interrupción
                { wch: 20 }, // Tiempo Delta
                { wch: 45 }  // Comentarios
            ];

            XLSX.utils.book_append_sheet(workbook, worksheet, 'Tiempos_PSP');

            // Generar y descargar archivo
            XLSX.writeFile(workbook, 'PSP_Matriz_Tiempos.xlsx');
        } catch (error) {
            console.error('Error al exportar Excel:', error);
            if (uiService) {
                uiService.showAlert('Error', 'Ocurrió un error al generar el archivo Excel.');
            }
        }
    }

    return {
        exportToExcel
    };
})();
