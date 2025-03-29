document.addEventListener("DOMContentLoaded", () => {
    const listaTareas = document.getElementById("listaNuevasTareas");
    const agregarTareaBtn = document.getElementById("agregarTarea");
    const calendario = document.getElementById("miCalendario");
    const tituloMisTareas = document.querySelector(".titulo-principal");
    const listaItems = document.getElementById("listaMisTareas");
    const agregarItemBtn = document.getElementById("agregarItem");


    // Inicializar calendario
    if (calendario) {
        flatpickr(calendario, {
            locale: "es",
            dateFormat: "Y-m-d",
        });
    }

    // Deshabilitar botón de agregar ítem al inicio
    agregarItemBtn.disabled = true;

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
            btnEditar.innerHTML = '<i class= "fas fa-edit"></i>';
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

    function editarTarea(index) {
        const tareas = obtenerTareas();
        const nuevoTexto = prompt("Editar tarea:", tareas[index].texto);
        if (nuevoTexto && nuevoTexto.trim() !== "") {
            tareas[index].texto = nuevoTexto;
            guardarTareas(tareas);
            cargarTareas();
        }
    }

    function seleccionarTarea(index) {
        const tareas = obtenerTareas();
        tareaSeleccionada = index;
        tituloMisTareas.textContent = tareas[index].texto;
        agregarItemBtn.disabled = false;
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
        tareas.push({ texto, fecha, items: [] });
        guardarTareas(tareas);
        cargarTareas();
    }

    function eliminarTarea(index) {
        if (confirm("¿Seguro que deseas eliminar esta tarea?")) {
            const tareas = obtenerTareas();
            tareas.splice(index, 1);
            guardarTareas(tareas);

            if (tareaSeleccionada === index) {
                tareaSeleccionada = null;
                tituloMisTareas.textContent = "Mis Tareas";
                listaItems.innerHTML = "";
                agregarItemBtn.disabled = true;
            }
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
        tareas[tareaSeleccionada].items.push({
            nombre: nombreItem,
            estado: "value1" // El estado inicial de cada ítem
        });
        guardarTareas(tareas);
        cargarItems();
    }

    function cargarItems() {
        listaItems.innerHTML = "";
        if (tareaSeleccionada === null) return;

        const tareas = obtenerTareas();
        const items = tareas[tareaSeleccionada].items || [];

        if (items.length === 0) {
            listaItems.innerHTML = "<p>No hay ítems en esta tarea.</p>";
            return;
        }

        items.forEach((item, index) => {
            const li = document.createElement("li");
            li.classList.add("item-tarea");

            const span = document.createElement("span");
            span.textContent = `${item.nombre}`;

            const select = document.createElement("select");
            select.innerHTML = `
                <option value="value1" ${item.estado === 'value1' ? 'selected' : ''}>Sin empezar</option>
                <option value="value2" ${item.estado === 'value2' ? 'selected' : ''}>En proceso</option>
                <option value="value3" ${item.estado === 'value3' ? 'selected' : ''}>Completado</option>
            `;
            
            select.addEventListener("change", (e) => {
                const nuevoEstado = e.target.value;
                const tareas = obtenerTareas();
                tareas[tareaSeleccionada].items[index].estado = nuevoEstado;
                guardarTareas(tareas);
            });

            const btnEditar = document.createElement("button");
            btnEditar.textContent = "Editar";
            btnEditar.classList.add("editar-item");
            btnEditar.addEventListener("click", () => editarItem(index));

            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "Eliminar";
            btnEliminar.classList.add("eliminar-item");
            btnEliminar.addEventListener("click", () => eliminarItem(index));

            li.appendChild(span);
            li.appendChild(select);
            li.appendChild(btnEditar);
            li.appendChild(btnEliminar);
            listaItems.appendChild(li);
        });
    }

    function editarItem(index) {
        const tareas = obtenerTareas();
        const items = tareas[tareaSeleccionada].items;

        const nuevoNombre = prompt("Editar nombre del ítem:", items[index].nombre);
        if (nuevoNombre === null) return; // Si el usuario cancela

        if (nuevoNombre && nuevoNombre.trim() !== "") {
            items[index].nombre = nuevoNombre.trim();
            guardarTareas(tareas);
            cargarItems();
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

    // Event listeners
    agregarTareaBtn.addEventListener("click", agregarTarea);
    agregarItemBtn.addEventListener("click", agregarItem);

    // Cargar tareas al inicio
    cargarTareas();
});
