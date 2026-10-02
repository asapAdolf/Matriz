# Matriz de Tiempos PSP (Personal Software Process)

Aplicación web modular en JavaScript para el registro, medición y control de tiempos por fases del proceso de desarrollo de software bajo la metodología PSP.

## 🚀 Estructura del Proyecto

El proyecto está diseñado bajo una arquitectura modular limpia y desacoplada:

```text
Matriz/
├── css/
│   └── styles.css          # Estilos personalizados, scrollbars, transiciones y animaciones
├── js/
│   ├── calculator.js       # Cálculos matemáticos de tiempo (delta, formato HH:MM:SS, resumen global y medianoche)
│   ├── storage.js          # Capa de persistencia con LocalStorage ('psp_time_logs_v2')
│   ├── timer.js            # Máquina de estados del cronómetro de fase (iniciar, pausar, reanudar, detener)
│   ├── ui.js               # Renderizado del DOM, panel de resumen total, desglose por fases, modales y tabla
│   ├── export.js           # Generación y exportación de planillas Excel (.xlsx) con fila de totales en SheetJS
│   └── app.js              # Controlador principal y enlace de eventos de la aplicación
├── index.html              # Punto de entrada principal estándar de la aplicación
├── Matriz.html             # Copia compatible para mantener enlaces previos
├── package.json            # Configuración del proyecto y scripts NPM
└── README.md               # Documentación del proyecto
```

---

## 📊 Panel de Resumen de Tiempos Totales

La aplicación incluye un panel dinámico de métricas acumuladas:
1. **Tiempo Neto (Delta Total)**: Suma total de minutos reales trabajados, expresados en minutos y formato legible (ej. `2 h 15 min`).
2. **Tiempo de Interrupciones**: Suma total de minutos en pausas o interrupciones.
3. **Tiempo Bruto Total**: Tiempo total transcurrido (Tiempo Neto + Interrupciones).
4. **Total de Registros y Fases Activas**: Cantidad de entradas y número de fases en las que se ha trabajado.
5. **Distribución por Fase**: Visualización de minutos y porcentaje del tiempo invertido en cada fase (Plan, Diseño, Código, Compilación, Pruebas, Postmortem).
6. **Pie de Tabla con Totales**: Fila fija al pie de la tabla con los totales acumulados.
7. **Exportación con Totales**: La exportación a Excel incluye una fila final consolidada con los totales de la sesión.

---

## 🛠️ Módulos de JavaScript Explicados

1. **[js/calculator.js](file:///c:/Users/bofo2/Desktop/Matriz/js/calculator.js)**:
   - `formatTimeDisplay(ms)`: Transforma milisegundos en formato de pantalla `HH:MM:SS`.
   - `getHHMM(dateObj)`: Convierte un objeto `Date` en cadena `HH:MM`.
   - `formatMinutes(totalMinutes)`: Formatea minutos a formato legible `"X h Y min"`.
   - `calculateDelta(startTime, endTime, interruptions)`: Calcula minutos netos considerando cambios de medianoche.
   - `calculateSummary(logs)`: Genera el resumen consolidado de tiempos totales y distribución por fase.

2. **[js/storage.js](file:///c:/Users/bofo2/Desktop/Matriz/js/storage.js)**:
   - Centraliza el acceso a `localStorage`.
   - Métodos: `getAll()`, `saveAll(logs)`, `add(log)`, `remove(index)`, `clear()`.

3. **[js/timer.js](file:///c:/Users/bofo2/Desktop/Matriz/js/timer.js)**:
   - Gestiona el estado del cronómetro (`stopped`, `running`, `paused`).
   - Mide tiempo activo y tiempo acumulado en pausas (interrupciones).

4. **[js/ui.js](file:///c:/Users/bofo2/Desktop/Matriz/js/ui.js)**:
   - Maneja la visualización de modales nativos personalizados (`showConfirm`, `showAlert`).
   - Renderiza las tarjetas de resumen y badges de fases.
   - Renderiza la tabla histórica y pie de tabla (`tfoot`) con totales.

5. **[js/export.js](file:///c:/Users/bofo2/Desktop/Matriz/js/export.js)**:
   - Genera el archivo descargable `PSP_Matriz_Tiempos.xlsx` incluyendo fila de totales.

6. **[js/app.js](file:///c:/Users/bofo2/Desktop/Matriz/js/app.js)**:
   - Inicializa y coordina todos los componentes y reacciona a cambios en los registros.

---

## 🖥️ Cómo Ejecutar el Proyecto

### Opción 1: Directamente en el navegador
Haz doble clic sobre [index.html](file:///c:/Users/bofo2/Desktop/Matriz/index.html) o [Matriz.html](file:///c:/Users/bofo2/Desktop/Matriz/Matriz.html).

### Opción 2: Servidor Local con Node.js / NPM
```bash
npm start
# o
npm run dev
```

### Validar Sintaxis de los Archivos JS
```bash
npm test
```
