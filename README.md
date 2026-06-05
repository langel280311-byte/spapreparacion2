# 📦 Sistema de Gestión de Inventario - SPA (Vanilla JS)

¡Bienvenido a este proyecto educativo! Esta es una **Single Page Application (SPA)** desarrollada íntegramente con **Vanilla JavaScript** (JavaScript puro), sin frameworks como React o Vue. El objetivo es demostrar cómo construir aplicaciones modernas, rápidas y escalables utilizando los fundamentos del lenguaje.

## 🚀 Características Principales

*   **Arquitectura Modular:** Separación de responsabilidades en archivos independientes (`api.js`, `main.js`, etc.).
*   **Sistema de Rutas SPA:** Navegación fluida entre Login y Dashboard sin recargar la página.
*   **Autenticación y Roles:** 
    *   `admin`: Control total (Crear, Leer, Editar, Eliminar).
    *   `user`: Permisos limitados (Solo Leer y Crear).
*   **Persistencia de Datos:** Uso de `localStorage` para mantener la sesión activa al refrescar.
*   **CRUD Completo:** Operaciones conectadas a una API ficticia (JSONPlaceholder).
*   **Diseño Moderno:** Interfaz responsiva y limpia con CSS3 nativo.
*   **Optimización:** Implementación de **Delegación de Eventos** para un manejo eficiente del DOM.

## 🛠️ Tecnologías Utilizadas

*   **HTML5 & CSS3:** Estructura y estilos.
*   **JavaScript (ES6+):** Módulos, Async/Await, Fetch API, DOM Manipulation.
*   **Vite:** Herramienta de construcción (Build Tool) rápida y ligera.
*   **JSONPlaceholder:** API REST falsa para simular el backend.

## 📂 Estructura del Proyecto

```bash
inventario-spa/
├── index.html       # Punto de entrada y contenedor principal
├── style.css        # Estilos globales y variables de diseño
├── api.js           # Módulo para peticiones HTTP (Fetch)
├── main.js          # Lógica central, Rutas y Estado
├── package.json     # Configuración de dependencias (Vite)
└── README.md        # Documentación (este archivo)
```

## ⚙️ Instalación y Ejecución

Para ejecutar este proyecto de forma local, tienes dos opciones:

### Opción A: Con Node.js (Recomendado para desarrollo)
1. Asegúrate de tener [Node.js](https://nodejs.org/) instalado.
2. Abre una terminal en la carpeta del proyecto.
3. Instala las dependencias de desarrollo:
   ```bash
   npm install
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abre la URL que te indique la terminal (ej: `http://localhost:5173`).

### Opción B: Sin Node.js
Si prefieres no usar herramientas de terminal, puedes usar la extensión **Live Server** de Visual Studio Code para abrir el archivo `index.html`. 
*Nota: Debido al uso de Módulos de JS (`type="module"`), el archivo no funcionará si lo abres haciendo doble clic directamente (protocolo `file://`). Debe servirse mediante un servidor local.*

## 💡 Conceptos Clave para Estudiantes

### 1. ¿Por qué usamos Delegación de Eventos?
En la tabla de productos, en lugar de añadir un `addEventListener` a cada botón de editar/eliminar (que pueden ser cientos), añadimos **uno solo** al contenedor padre (`<tbody>`). Cuando haces clic, el evento "burbujea" y lo capturamos, identificando el ID del producto mediante atributos `data-id`. ¡Esto es mucho más eficiente!

### 2. Gestión de Estado (`State`)
Usamos un objeto global `state` en `main.js` para que la interfaz siempre sepa qué datos mostrar sin tener que preguntarle a la API constantemente. Si eliminamos un producto, lo quitamos del `state.inventory` y redibujamos la tabla.

### 3. Rutas Protegidas
La función `init()` verifica si existe un usuario en el `localStorage`. Si no existe, bloquea el acceso al Dashboard y renderiza automáticamente el Login. Esto simula un flujo de seguridad real.

## 🛑 Reglas de Negocio
*   **Seguridad:** Las credenciales aceptadas son `admin` y `user`.
*   **Restricción de Productos:** Por política del sistema, no se permite registrar ni editar productos que contengan la palabra **"Ram"** en su nombre o descripción.

---
*Este proyecto fue desarrollado con fines educativos para la clase de Desarrollo Web.* 🎓
