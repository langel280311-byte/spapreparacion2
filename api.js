/**
 * MODULO DE API (api.js)
 * 
 * Este archivo se encarga ÚNICAMENTE de hablar con el servidor externo.
 * Separar la API de la lógica visual es una "Buena Práctica" porque si mañana
 * cambiamos de servidor, solo editamos este archivo.
 */

// URL base de JSONPlaceholder, un servicio gratuito para pruebas de desarrollo.
const BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * FETCH (LEER): Obtiene la lista de productos.
 * Usamos 'async/await' para que el código espere a que el servidor responda 
 * sin bloquear el resto de la aplicación.
 */
export const fetchProducts = async () => {
    try {
        // Hacemos la petición GET al endpoint /posts (simulando productos)
        const response = await fetch(`${BASE_URL}/posts?_limit=10`);
        
        // Si la respuesta no es OK (ej. error 404), lanzamos un error.
        if (!response.ok) throw new Error('Error al obtener productos');
        
        // Convertimos la respuesta de texto plano a un Objeto JSON de JavaScript.
        const data = await response.json();
        
        // "Mapeo" de datos: Transformamos los nombres de la API (title, body)
        // a nombres que tengan sentido para nuestro inventario (nombre, descripcion).
        return data.map(item => ({
            id: item.id,
            nombre: item.title,
            descripcion: item.body
        }));
    } catch (error) {
        console.error('Error en la API al leer:', error);
        throw error;
    }
};

/**
 * POST (CREAR): Envía un nuevo producto al servidor.
 */
export const createProduct = async (product) => {
    try {
        const response = await fetch(`${BASE_URL}/posts`, {
            method: 'POST', // Definimos el método HTTP para creación.
            body: JSON.stringify({
                title: product.nombre,
                body: product.descripcion,
                userId: 1,
            }),
            headers: { 
                'Content-type': 'application/json; charset=UTF-8' 
            },
        });
        const data = await response.json();
        // Retornamos el producto creado con el ID que nos asignó la API.
        return { id: data.id, nombre: product.nombre, descripcion: product.descripcion };
    } catch (error) {
        console.error('Error en la API al crear:', error);
        throw error;
    }
};

/**
 * PUT (ACTUALIZAR): Modifica un producto existente por su ID.
 */
export const updateProduct = async (id, product) => {
    try {
        const response = await fetch(`${BASE_URL}/posts/${id}`, {
            method: 'PUT', // Método para actualización completa.
            body: JSON.stringify({
                id: id,
                title: product.nombre,
                body: product.descripcion,
                userId: 1,
            }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        });
        const data = await response.json();
        return { id: data.id, nombre: product.nombre, descripcion: product.descripcion };
    } catch (error) {
        console.error('Error en la API al actualizar:', error);
        throw error;
    }
};

/**
 * DELETE (ELIMINAR): Borra un producto del servidor.
 */
export const deleteProduct = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/posts/${id}`, {
            method: 'DELETE', // Método para borrado.
        });
        // Si la respuesta es exitosa (ok), devolvemos true.
        return response.ok;
    } catch (error) {
        console.error('Error en la API al eliminar:', error);
        throw error;
    }
};
