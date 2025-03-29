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
            li.classList.add("tarea");
            li.innerHTML = `
                <span class="texto-tarea">${tarea.texto} - ${tarea.fecha}</span>
                <div class="acciones-tarea">
                    <button class="editar"><i class="fas fa-edit"></i></button>
                    <button class="eliminar"><i class="fas fa-trash"></i></button>
                </div>
            `;

            li.addEventListener("click", () => seleccionarTarea(tarea.texto));
            const btnEditar = li.querySelector(".editar");
            const btnEliminar = li.querySelector(".eliminar");

            if (btnEditar) btnEditar.addEventListener("click", (e) => {
                e.stopPropagation();
                editarTarea(index);
            });

            if (btnEliminar) btnEliminar.addEventListener("click", (e) => {
                e.stopPropagation();
                eliminarTarea(index);
            });

            listaTareas.appendChild(li);
        });
    }

    function seleccionarTarea(nombreTarea) {
        tareaSeleccionada = encodeURIComponent(nombreTarea);
        tituloMisTareas.textContent = nombreTarea;
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
        tareas.push({ texto, fecha });
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
            cargarTareas();
        }
    }

    function obtenerItems() {
        return JSON.parse(localStorage.getItem(tareaSeleccionada)) || [];
    }

    function guardarItems(items) {
        localStorage.setItem(tareaSeleccionada, JSON.stringify(items));
    }

    function agregarItem() {
        if (!tareaSeleccionada) {
            alert("Selecciona una tarea primero.");
            return;
        }

        const nombreItem = prompt("Ingrese el nombre del ítem:");
        if (!nombreItem || nombreItem.trim() === "") {
            alert("El ítem no puede estar vacío.");
            return;
        }

        const items = obtenerItems();
        items.push({ nombre: nombreItem, estado: "Sin empezar" });
        guardarItems(items);
        cargarItems();
    }

    function cargarItems() {
        listaItems.innerHTML = "";
        const items = obtenerItems();

        items.forEach((item, index) => {
            const li = document.createElement("li");
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
        const items = obtenerItems();
        const nuevoNombre = prompt("Editar nombre del ítem:", items[index].nombre);
        const nuevoEstado = prompt("Editar estado (Completa, En proceso, Sin empezar):", items[index].estado);

        const estadoValido = ["completa", "en proceso", "sin empezar"];
        if (nuevoNombre && nuevoNombre.trim() !== "" && estadoValido.includes(nuevoEstado.trim().toLowerCase())) {
            items[index].nombre = nuevoNombre.trim();
            items[index].estado = nuevoEstado.trim();
            guardarItems(items);
            cargarItems();
        } else {
            alert("Estado inválido. Usa: Completa, En proceso, Sin empezar.");
        }
    }

    function eliminarItem(index) {
        if (confirm("¿Seguro que deseas eliminar este ítem?")) {
            const items = obtenerItems();
            items.splice(index, 1);
            guardarItems(items);
            cargarItems();
        }
    }

    agregarTareaBtn?.addEventListener("click", agregarTarea);
    agregarItemBtn?.addEventListener("click", agregarItem);
    cargarTareas();
});
