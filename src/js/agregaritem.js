document.addEventListener("DOMContentLoaded", () => {
    const listaItem = document.getElementById("listaItem");
    const agregarItemBtn = document.getElementById("agregarItem");
    const titulo = document.querySelector(".titulo-principal")

    function cargarItem() {
        listaItem.innerHTML = "";
        const items = JSON.parse(localStorage.getItem("items")) || [];

        if (items.length === 0) {
            listaItem.innerHTML = "<p>No hay items pendientes.</p>";
            return;
        }

        items.forEach((item, index) => {
            const li = document.createElement("li");
            li.classList.add("item");
            li.innerHTML = `
                <span class="texto-tarea">${item.texto} - ${item.fecha}</span>
                <div class="acciones-tarea">
                    <button id=editarItem class="editar"><i class="fas fa-edit"></i></button>
                    <button id=eliminarItem class="eliminar"><i class="fas fa-trash"></i></button>
                </div>
            `;

            // Agregar eventos a los botones
            li.getElementById("editarItem").addEventListener("click", () => editarItem(index));
            li.getElementById("eliminarItem").addEventListener("click", () => eliminarItem(index));

            listaItem.appendChild(li);
        });

    }

    function agregarItem() {
        const texto = prompt("Ingrese la item:");
        if (!texto || texto.trim() === "") {
            alert("el item no puede estar vacía.");
            return;
        }

        const items = JSON.parse(localStorage.getItem("items")) || [];
        items.push({ texto, fecha });
        localStorage.setItem("items", JSON.stringify(items));
        cargarIareas();
    }

    function editarItem(index) {
        const items = JSON.parse(localStorage.getItem("items"));
        const nuevoTexto = prompt("Editar item:", items[index].texto);

        if (nuevoTexto && nuevoTexto.trim() !== "") {
            items[index].texto = nuevoTexto;
            localStorage.setItem("items", JSON.stringify(items));
            cargarIareas();
        }
    }

    function eliminarItem(index) {
        const confirmar = confirm("¿Seguro que deseas eliminar este item?");
        if (confirmar) {
            const items = JSON.parse(localStorage.getItem("items"));
            items.splice(index, 1);
            localStorage.setItem("items", JSON.stringify(items));
            cargarIareas();
        }
    }

    agregarItemBtn.addEventListener("click", agregarItem);
    cargarItem();
});