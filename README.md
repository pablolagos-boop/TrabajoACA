
# Estructura del proyecto y Tecnologías usadas

Este README explica de forma clara y concisa la organización del repositorio y las tecnologías empleadas en el desarrollo de la "Calculadora Científica Web".

## Estructura del proyecto

```
ACA FINAL/
├── index.html          # Interfaz principal (HTML)
├── css/
│   └── styles.css     # Estilos y diseño responsive
├── js/
│   ├── script.js      # Controlador: eventos, DOM y lógica de UI
│   ├── math.js        # Lógica matemática pura y utilidades
│   └── __tests__/     # Pruebas unitarias (Jest + jsdom)
├── package.json       # Scripts (tests, lint) y dependencias de desarrollo
└── README.md          # Documentación (este archivo)
```

Descripción rápida de carpetas/archivos:

- `index.html`: contiene la estructura semántica de la calculadora y atributos ARIA para accesibilidad.
- `css/styles.css`: reglas de estilo, temas y ajustes responsive.
- `js/script.js`: maneja la interacción del usuario, el historial, y actualiza la vista.
- `js/math.js`: funciones puras para operaciones y utilidades de precisión (facilita pruebas unitarias).
- `js/__tests__/`: pruebas automatizadas que validan la lógica y el comportamiento.
- `package.json`: incluye scripts útiles como `npm test` y `npm run lint`.

## Tecnologías y herramientas

- HTML5: marcado semántico y soporte básico de accesibilidad.
- CSS3: Grid/Flexbox, variables y técnicas responsive.
- JavaScript (ES6+): módulos, clases/funciones y manejo del DOM.
- Jest + jsdom: pruebas unitarias para lógica y simulación de DOM.
- ESLint: análisis estático y consistencia de estilo.

## Cómo ejecutar (rápido)

- Uso local sin instalación: abrir `index.html` en un navegador moderno.
- Para ejecutar pruebas/lint (opcional) en PowerShell:

```powershell
npm install
npm test
npm run lint
```

---

Autor: Pablo Lagos
"# Calculadora" 
