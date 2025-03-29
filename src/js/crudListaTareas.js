document.addEventListener("DOMContentLoaded", () => {
    const listaTareas = document.getElementById("listaNuevasTareas");
    const agregarTareaBtn = document.getElementById("agregarTarea");
    const calendario = document.getElementById("miCalendario");
    const tituloMisTareas = document.getElementById("tituloMisTareas");
    const listaItems = document.getElementById("listaItems");
    const agregarItemBtn = document.getElementById("agregarItem");

    let tareaSeleccionada = null;

    if (calendario) {
        flatpickr(calendario, {
            locale: "es",
            dateFormat: "Y-m-d",
        });
    }

    function obtenerTareas() {
        return JSON.parse(localStorage.getItem("tareas")) || [];
    }

    function guardarTareas(tareas) {
        localStorage.setItem("tareas", JSON.stringify(tareas));
    }

    function cargarTareas() {
        listaTareas.innerHTML = "";
        const tareas = obtenerTareas();

        if (tareas.length === 0) {
            listaTareas.innerHTML = "<p>No hay tareas pendientes.</p>";
            return;
        }

        tareas.forEach((tarea, index) => {
            const li = document.createElement("li");
            li.classList.add("tarea-item");

            const tareaBtn = document.createElement("button");
            tareaBtn.classList.add("tarea-boton");
            tareaBtn.textContent = `${tarea.texto} - ${tarea.fecha}`;

            tareaBtn.addEventListener("click", () => seleccionarTarea(index));

            const accionesDiv = document.createElement("div");
            accionesDiv.classList.add("acciones-tarea");

            const btnEditar = document.createElement("button");
            btnEditar.innerHTML = '<i class="fas fa-edit"></i>';
            btnEditar.classList.add("editar");
            btnEditar.addEventListener("click", (e) => {
                e.stopPropagation();
                editarTarea(index);
            });

            const btnEliminar = document.createElement("button");
            btnEliminar.innerHTML = '<i class="fas fa-trash"></i>';
            btnEliminar.classList.add("eliminar");
            btnEliminar.addEventListener("click", (e) => {
                e.stopPropagation();
                eliminarTarea(index);
            });

            accionesDiv.appendChild(btnEditar);
            accionesDiv.appendChild(btnEliminar);
            li.appendChild(tareaBtn);
            li.appendChild(accionesDiv);
            listaTareas.appendChild(li);
        });
    }

    function seleccionarTarea(index) {
        const tareas = obtenerTareas();
        tareaSeleccionada = index;
        tituloMisTareas.textContent = tareas[index].texto;
        cargarItems();
    }

    function agregarTarea() {
        const fecha = calendario ? calendario.value : "";
        if (!fecha) {
            alert("Por favor, selecciona una fecha.");
            return;
        }

        const texto = prompt("Ingrese la tarea:");
        if (!texto || texto.trim() === "") {
            alert("La tarea no puede estar vacía.");
            return;
        }

        const tareas = obtenerTareas();
        tareas.push({ texto, fecha, items: [] }); // Agregar un array vacío de items
        guardarTareas(tareas);
        cargarTareas();
    }

    function editarTarea(index) {
        const tareas = obtenerTareas();
        const nuevoTexto = prompt("Editar tarea:", tareas[index].texto);
        if (nuevoTexto && nuevoTexto.trim() !== "") {
            tareas[index].texto = nuevoTexto;
            guardarTareas(tareas);
            cargarTareas();
        }
    }

    function eliminarTarea(index) {
        if (confirm("¿Seguro que deseas eliminar esta tarea?")) {
            const tareas = obtenerTareas();
            tareas.splice(index, 1);
            guardarTareas(tareas);
            tareaSeleccionada = null;
            tituloMisTareas.textContent = "Mis Tareas";
            listaItems.innerHTML = ""; // Limpiar los ítems cuando se borra una tarea
            cargarTareas();
        }
    }

    function agregarItem() {
        if (tareaSeleccionada === null) {
            alert("Selecciona una tarea primero.");
            return;
        }

        const nombreItem = prompt("Ingrese el nombre del ítem:");
        if (!nombreItem || nombreItem.trim() === "") {
            alert("El ítem no puede estar vacío.");
            return;
        }

        const tareas = obtenerTareas();
        tareas[tareaSeleccionada].items.push({ nombre: nombreItem, estado: "Sin empezar" });
        guardarTareas(tareas);
        cargarItems();
    }

    function cargarItems() {
        listaItems.innerHTML = "";
        if (tareaSeleccionada === null) {
            console.warn("⚠️ No hay tarea seleccionada.");
            return;
        }

        const tareas = obtenerTareas();
        const items = tareas[tareaSeleccionada].items || [];

        items.forEach((item, index) => {
            let li = document.createElement("li");
            li.innerHTML = `
                <span>${item.nombre} - ${item.estado}</span>
                <button class="editar-item">Editar</button>
                <button class="eliminar-item">Eliminar</button>
            `;

            li.querySelector(".editar-item").addEventListener("click", () => editarItem(index));
            li.querySelector(".eliminar-item").addEventListener("click", () => eliminarItem(index));

            listaItems.appendChild(li);
        });
    }

    function editarItem(index) {
        const tareas = obtenerTareas();
        const items = tareas[tareaSeleccionada].items;

        const nuevoNombre = prompt("Editar nombre del ítem:", items[index].nombre);
        const nuevoEstado = prompt("Editar estado (Completa, En proceso, Sin empezar):", items[index].estado);

        const estadoValido = ["Completa", "En proceso", "Sin empezar"];
        if (nuevoNombre && nuevoNombre.trim() !== "" && estadoValido.includes(nuevoEstado.trim())) {
            items[index].nombre = nuevoNombre.trim();
            items[index].estado = nuevoEstado.trim();
            guardarTareas(tareas);
            cargarItems();
        } else {
            alert("Estado inválido. Usa: Completa, En proceso, Sin empezar.");
        }
    }

    function eliminarItem(index) {
        if (confirm("¿Seguro que deseas eliminar este ítem?")) {
            const tareas = obtenerTareas();
            tareas[tareaSeleccionada].items.splice(index, 1);
            guardarTareas(tareas);
            cargarItems();
        }
    }

    agregarTareaBtn?.addEventListener("click", agregarTarea);
    agregarItemBtn?.addEventListener("click", agregarItem);
    cargarTareas();
});
