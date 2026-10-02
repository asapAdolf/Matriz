# Matriz de Tiempos PSP (Personal Software Process)

Aplicación web modular en JavaScript para el registro, medición y control de tiempos por fases del proceso de desarrollo de software bajo la metodología PSP.

## 🚀 Estructura del Proyecto

El código monolítico original contenido en el archivo HTML ha sido desacoplado y estructurado en una arquitectura modular limpia y mantenible:

```text
Matriz/
├── css/
│   └── styles.css          # Estilos personalizados, scrollbars, transiciones y animaciones
├── js/
│   ├── calculator.js       # Cálculos matemáticos de tiempo (delta, formato HH:MM:SS, cruce de medianoche)
│   ├── storage.js          # Capa de persistencia con LocalStorage ('psp_time_logs_v2')
│   ├── timer.js            # Máquina de estados del cronómetro de fase (iniciar, pausar, reanudar, detener)
│   ├── ui.js               # Renderizado del DOM, modales de alerta/confirmación y tabla de registros
│   ├── export.js           # Generación y exportación de planillas Excel (.xlsx) con SheetJS
│   └── app.js              # Controlador principal y enlace de eventos de la aplicación
├── index.html              # Punto de entrada principal estándar de la aplicación
├── Matriz.html             # Copia compatible para mantener enlaces previos
├── package.json            # Configuración del proyecto y scripts NPM
└── README.md               # Documentación del proyecto
```

---

## 🛠️ Módulos de JavaScript Explicados

1. **[js/calculator.js](file:///c:/Users/bofo2/Desktop/Matriz/js/calculator.js)**:
   - `formatTimeDisplay(ms)`: Transforma milisegundos en formato de pantalla `HH:MM:SS`.
   - `getHHMM(dateObj)`: Convierte un objeto `Date` en cadena `HH:MM`.
   - `calculateDelta(startTime, endTime, interruptions)`: Calcula los minutos netos trabajados, descontando tiempos de interrupción y contemplando transiciones a través de la medianoche.

2. **[js/storage.js](file:///c:/Users/bofo2/Desktop/Matriz/js/storage.js)**:
   - Centraliza el acceso a `localStorage`.
   - Métodos: `getAll()`, `saveAll(logs)`, `add(log)`, `remove(index)`, `clear()`.

3. **[js/timer.js](file:///c:/Users/bofo2/Desktop/Matriz/js/timer.js)**:
   - Gestiona el estado del cronómetro (`stopped`, `running`, `paused`).
   - Mide tanto el tiempo activo de trabajo como el tiempo acumulado en pausas (interrupciones).

4. **[js/ui.js](file:///c:/Users/bofo2/Desktop/Matriz/js/ui.js)**:
   - Maneja la visualización de modales nativos personalizados (`showConfirm`, `showAlert`).
   - Actualiza indicadores visuales del cronómetro (tiempo transcurrido, alertas de pausa).
   - Renderiza las filas de registros históricos y activa la eliminación individual con confirmación.

5. **[js/export.js](file:///c:/Users/bofo2/Desktop/Matriz/js/export.js)**:
   - Prepara los datos del historial con columnas legibles y anchos adaptados.
   - Genera el archivo descargable `PSP_Matriz_Tiempos.xlsx`.

6. **[js/app.js](file:///c:/Users/bofo2/Desktop/Matriz/js/app.js)**:
   - Punto de unión que inicializa la aplicación, enlaza el cronómetro con el formulario y administra los eventos de guardado y exportación.

---

## 🖥️ Cómo Ejecutar el Proyecto

Puedes ejecutar el proyecto de dos formas:

### Opción 1: Directamente en el navegador
Haz doble clic sobre [index.html](file:///c:/Users/bofo2/Desktop/Matriz/index.html) o [Matriz.html](file:///c:/Users/bofo2/Desktop/Matriz/Matriz.html) para abrirlo en tu navegador preferido (Chrome, Edge, Firefox). Los scripts son compatibles de forma nativa sin requerir configuración adicional.

### Opción 2: Servidor Local con Node.js / NPM
Si prefieres servirlo mediante un servidor web local:

```bash
npm start
# o
npm run dev
```

Esto levantará un servidor local en `http://localhost:3000`.

### Validar Sintaxis de los Archivos JS
```bash
npm test
```
