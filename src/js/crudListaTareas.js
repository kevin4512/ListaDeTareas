// 🔹 Crear (Agregar una tarea)
function agregarListaTareas(nuevaTarea) {
    let listaTareas = JSON.parse(localStorage.getItem("listaTareas")) || []; // Obtener tareas o crear un array vacío
    listaTareas.push(nuevaTarea); // Agregar la nueva tarea
    localStorage.setItem("listaTareas", JSON.stringify(listaTareas)); // Guardar en localStorage
}

// 🔹 Leer (Obtener todas las tareas)
function obtenerListaTareas() {
    return JSON.parse(localStorage.getItem("listaTareas")) || [];
}

// 🔹 Actualizar (Editar una tarea)
function editarListaTareas(index, nuevaTarea) {
    let listaTareas = obtenerListaTareas(); // Obtener tareas actuales
    if (index >= 0 && index < listaTareas.length) { // Verificar índice válido
        listaTareas[index] = nuevaTarea; // Reemplazar tarea en la posición dada
        localStorage.setItem("listaTareas", JSON.stringify(listaTareas)); // Guardar cambios
    }
}

// 🔹 Eliminar (Borrar una tarea)
function eliminarListaTareas(index) {
    let listaTareas = obtenerListaTareas();
    if (index >= 0 && index < listaTareas.length) { // Validar índice
        listaTareas.splice(index, 1); // Eliminar tarea
        localStorage.setItem("listaTareas", JSON.stringify(listaTareas)); // Guardar cambios
    }
}
