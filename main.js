/**
 * CONTROLADOR PRINCIPAL (main.js)
 * 
 * Aquí ocurre la "magia" de la SPA. Este archivo decide qué ver,
 * maneja los clics del usuario y actualiza lo que ves en pantalla.
 */
import * as api from './api.js';

/**
 * EL ESTADO (STATE)
 * Es la única fuente de verdad. Si algo cambia en la pantalla, 
 * es porque primero cambió en este objeto 'state'.
 */
let state = {
    user: null,         // Datos del usuario logueado (nombre y rol)
    inventory: [],      // Array con todos los productos cargados de la API
    isEditing: null     // Si tiene un ID, estamos editando; si es null, estamos creando
};

// Referencia al contenedor principal del HTML donde inyectaremos todo.
const app = document.getElementById('app');

/**
 * FUNCIÓN DE INICIO (init)
 * Se ejecuta apenas carga la página.
 */
function init() {
    // Buscamos si hay una sesión guardada en el disco local del navegador (localStorage).
    const savedUser = localStorage.getItem('inventory_session');
    
    if (savedUser) {
        // Si hay sesión, convertimos el texto a objeto y vamos al Dashboard.
        state.user = JSON.parse(savedUser);
        renderDashboard();
    } else {
        // Si no, mostramos la pantalla de Login.
        renderLogin();
    }
}

/**
 * RENDERIZADO DE VISTAS
 * Estas funciones borran el contenido de #app y escriben nuevo HTML.
 * ¡Esto es lo que hace que sea una Single Page Application!
 */

// --- VISTA: LOGIN ---
function renderLogin() {
    app.innerHTML = `
        <div class="login-container">
            <h2>Acceso al Sistema</h2>
            <form id="login-form">
                <div class="form-group">
                    <label>Usuario</label>
                    <input type="text" id="username" placeholder="admin o user" required>
                </div>
                <div class="form-group">
                    <label>Contraseña</label>
                    <input type="password" id="password" value="123456" required>
                </div>
                <button type="submit" class="btn-primary">Entrar</button>
            </form>
            <p style="margin-top: 1rem; font-size: 0.8rem; color: #666;">
                Tip: Usa <b>admin</b> o <b>user</b> para probar los diferentes permisos.
            </p>
        </div>
    `;
    // Escuchamos cuando el usuario envía el formulario.
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

// --- VISTA: DASHBOARD (Panel Principal) ---
async function renderDashboard() {
    app.innerHTML = `
        <nav class="navbar">
            <h1>Inventario Pro</h1>
            <div>
                <span>Bienvenido, <b>${state.user.username}</b> (${state.user.role})</span>
                <button id="logout-btn" class="btn-danger" style="margin-left: 1rem; padding: 0.4rem 0.8rem;">Cerrar Sesión</button>
            </div>
        </nav>
        <main class="main-content">
            <div class="inventory-header">
                <h2>Gestión de Productos</h2>
                <button id="add-btn" class="btn-success">+ Nuevo Producto</button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Producto</th>
                            <th>Descripción</th>
                            ${state.user.role === 'admin' ? '<th>Acciones</th>' : ''}
                        </tr>
                    </thead>
                    <tbody id="inventory-list">
                        <tr><td colspan="4">Cargando productos...</td></tr>
                    </tbody>
                </table>
            </div>
        </main>
        
        <!-- Ventana Modal para el formulario (oculta por defecto con la clase .hidden) -->
        <div id="product-modal" class="modal hidden">
            <div class="modal-content">
                <h3 id="modal-title">Agregar Producto</h3>
                <form id="product-form">
                    <div class="form-group">
                        <label>Nombre del Producto</label>
                        <input type="text" id="p-nombre" required>
                    </div>
                    <div class="form-group">
                        <label>Descripción</label>
                        <textarea id="p-descripcion" rows="3" required></textarea>
                    </div>
                    <div style="display: flex; gap: 10px; margin-top: 1rem;">
                        <button type="submit" class="btn-primary">Guardar</button>
                        <button type="button" id="close-modal" class="btn-danger">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // Cargamos los datos reales desde la API.
    loadInventory();

    // Eventos de botones estáticos.
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('add-btn').addEventListener('click', () => openModal());
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('product-form').addEventListener('submit', handleProductSubmit);

    /**
     * DELEGACIÓN DE EVENTOS (Concepto Avanzado)
     * En lugar de poner un listener en cada botón de la tabla (que son dinámicos),
     * ponemos uno solo en el 'tbody'. JavaScript detecta exactamente a qué hijo se le dio clic.
     */
    document.getElementById('inventory-list').addEventListener('click', (e) => {
        // Buscamos el ID guardado en el atributo 'data-id' del botón.
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains('btn-edit')) {
            openModal(id); // Si es el botón de editar, abrimos el modal con los datos del ID.
        } else if (e.target.classList.contains('btn-danger')) {
            handleDelete(id); // Si es el de eliminar, llamamos a la función de borrado.
        }
    });
}

/**
 * LÓGICA DE MANEJO DE DATOS
 */

// Obtiene productos de la API y los guarda en nuestro Estado local.
async function loadInventory() {
    try {
        state.inventory = await api.fetchProducts();
        renderTable(); // Una vez descargados, dibujamos la tabla.
    } catch (error) {
        alert('Error al conectar con la API');
    }
}

// Crea las filas (tr) de la tabla recorriendo el array de inventario.
function renderTable() {
    const list = document.getElementById('inventory-list');
    
    // Si no hay productos, mostramos un mensaje amigable.
    if (state.inventory.length === 0) {
        list.innerHTML = '<tr><td colspan="4">No hay productos disponibles en este momento.</td></tr>';
        return;
    }

    // Convertimos cada objeto de producto en una fila de HTML.
    list.innerHTML = state.inventory.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.nombre}</td>
            <td><small>${item.descripcion}</small></td>
            ${state.user.role === 'admin' ? `
                <td>
                    <button class="btn-edit" data-id="${item.id}">Editar</button>
                    <button class="btn-danger" data-id="${item.id}">Eliminar</button>
                </td>
            ` : ''}
        </tr>
    `).join('');
}

// Maneja el intento de acceso.
function handleLogin(e) {
    e.preventDefault(); // Evita que la página se recargue (comportamiento por defecto del form).
    const username = document.getElementById('username').value.toLowerCase();
    
    // Validación sencilla: solo aceptamos admin o user.
    if (username === 'admin' || username === 'user') {
        state.user = { 
            username: username, 
            role: username === 'admin' ? 'admin' : 'user' 
        };
        // Guardamos en localStorage para que la sesión sea persistente.
        localStorage.setItem('inventory_session', JSON.stringify(state.user));
        renderDashboard();
    } else {
        alert('Usuario no reconocido. Intenta con "admin" o "user".');
    }
}

// Borra la sesión y vuelve al Login.
function handleLogout() {
    localStorage.removeItem('inventory_session');
    state.user = null;
    state.inventory = [];
    renderLogin();
}

/**
 * MANEJO DEL FORMULARIO (MODAL)
 */

function openModal(id = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    
    state.isEditing = id; // Guardamos si estamos editando un ID específico.
    
    if (id) {
        // Si hay ID, buscamos el producto en nuestro estado y rellenamos el formulario.
        title.innerText = 'Actualizar Producto';
        const product = state.inventory.find(p => p.id == id);
        document.getElementById('p-nombre').value = product.nombre;
        document.getElementById('p-descripcion').value = product.descripcion;
    } else {
        // Si no hay ID, limpiamos el formulario para un nuevo registro.
        title.innerText = 'Nuevo Producto';
        form.reset();
    }
    
    modal.classList.remove('hidden'); // Quitamos la clase que lo oculta.
}

function closeModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

// Función para Guardar (Crea o Actualiza).
async function handleProductSubmit(e) {
    e.preventDefault();
    
    const productData = {
        nombre: document.getElementById('p-nombre').value,
        descripcion: document.getElementById('p-descripcion').value
    };

    // REGLA DE NEGOCIO: No permitimos la palabra prohibida por el profesor.
    if (productData.nombre.toLowerCase().includes('ram') || productData.descripcion.toLowerCase().includes('ram')) {
        alert('Error: La palabra prohibida detectada. Cambia el nombre por Laptop, Monitor o similares.');
        return;
    }

    try {
        if (state.isEditing) {
            // Caso 1: Estamos editando.
            const updated = await api.updateProduct(state.isEditing, productData);
            // Actualizamos el array local (map) para cambiar solo ese elemento.
            state.inventory = state.inventory.map(p => p.id == state.isEditing ? updated : p);
        } else {
            // Caso 2: Estamos creando.
            const created = await api.createProduct(productData);
            // Agregamos el nuevo producto al inicio del array.
            state.inventory.unshift(created);
        }
        
        renderTable(); // Redibujamos la tabla con los datos nuevos.
        closeModal();
    } catch (error) {
        alert('Hubo un problema al guardar los cambios.');
    }
}

// Función para Eliminar.
async function handleDelete(id) {
    // Siempre pedimos confirmación antes de borrar algo.
    if (!confirm('¿Seguro que quieres eliminar este producto del inventario?')) return;

    try {
        const success = await api.deleteProduct(id);
        if (success) {
            // Si la API dice OK, quitamos el producto de nuestro estado local.
            state.inventory = state.inventory.filter(p => p.id != id);
            renderTable(); // Volvemos a dibujar la tabla actualizada.
        }
    } catch (error) {
        alert('No se pudo eliminar el producto.');
    }
}

// LANZAMOS LA APP
init();
