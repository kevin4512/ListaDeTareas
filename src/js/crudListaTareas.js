document.addEventListener("DOMContentLoaded", () => {
    const listaTareas = document.getElementById("listaNuevasTareas");
    const agregarTareaBtn = document.getElementById("agregarTarea");
    const calendario = document.getElementById("miCalendario");

    flatpickr(calendario, {
        locale: "es",
        dateFormat: "Y-m-d",
    });

    function cargarTareas() {
        listaTareas.innerHTML = "";
        const tareas = JSON.parse(localStorage.getItem("tareas")) || [];

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

            // Agregar eventos a los botones
            li.querySelector(".editar").addEventListener("click", () => editarTarea(index));
            li.querySelector(".eliminar").addEventListener("click", () => eliminarTarea(index));

            listaTareas.appendChild(li);
        });
    }

    function agregarTarea() {
        const fecha = calendario.value;
        if (!fecha) {
            alert("Por favor, selecciona una fecha.");
            return;
        }

        const texto = prompt("Ingrese la tarea:");
        if (!texto || texto.trim() === "") {
            alert("La tarea no puede estar vacía.");
            return;
        }

        const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
        tareas.push({ texto, fecha });
        localStorage.setItem("tareas", JSON.stringify(tareas));
        cargarTareas();
    }

    function editarTarea(index) {
        const tareas = JSON.parse(localStorage.getItem("tareas"));
        const nuevoTexto = prompt("Editar tarea:", tareas[index].texto);

        if (nuevoTexto && nuevoTexto.trim() !== "") {
            tareas[index].texto = nuevoTexto;
            localStorage.setItem("tareas", JSON.stringify(tareas));
            cargarTareas();
        }
    }

    function eliminarTarea(index) {
        const confirmar = confirm("¿Seguro que deseas eliminar esta tarea?");
        if (confirmar) {
            const tareas = JSON.parse(localStorage.getItem("tareas"));
            tareas.splice(index, 1);
            localStorage.setItem("tareas", JSON.stringify(tareas));
            cargarTareas();
        }
    }

    agregarTareaBtn.addEventListener("click", agregarTarea);
    cargarTareas();
});
