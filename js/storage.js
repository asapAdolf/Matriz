/**
 * Módulo de Almacenamiento Local (LocalStorage) para Matriz PSP
 */
window.PSPStorage = (function () {
    const STORAGE_KEY = 'psp_time_logs_v2';

    /**
     * Obtiene todos los registros guardados
     * @returns {Array<Object>}
     */
    function getAll() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (error) {
            console.error('Error al leer de localStorage:', error);
            return [];
        }
    }

    /**
     * Guarda la lista completa de registros
     * @param {Array<Object>} logs 
     */
    function saveAll(logs) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    }

    /**
     * Agrega un nuevo registro
     * @param {Object} log 
     * @returns {Array<Object>}
     */
    function add(log) {
        const logs = getAll();
        logs.push(log);
        saveAll(logs);
        return logs;
    }

    /**
     * Elimina un registro por su índice
     * @param {number} index 
     * @returns {Array<Object>}
     */
    function remove(index) {
        const logs = getAll();
        if (index >= 0 && index < logs.length) {
            logs.splice(index, 1);
            saveAll(logs);
        }
        return logs;
    }

    /**
     * Borra todos los registros guardados
     */
    function clear() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error al limpiar localStorage:', error);
        }
    }

    return {
        getAll,
        saveAll,
        add,
        remove,
        clear
    };
})();
