document.addEventListener("DOMContentLoaded", function () {
    // Inicializar Flatpickr para el calendario principal
    flatpickr("#miCalendario", {
        inline: true,
        static: true,
        locale: "es",
        showMonths: 1,
        monthSelectorType: 'static',
        prevArrow: '<i class="fas fa-chevron-left"></i>',
        nextArrow: '<i class="fas fa-chevron-right"></i>'
    });

    // Inicializar Flatpickr para el input de fecha en el modal
    flatpickr("#fechaTarea", {
        locale: "es",
        dateFormat: "Y-m-d"
    });

    // Obtener elementos del DOM
    var modal = document.getElementById("modalAgregarTarea");
    var btn = document.getElementById("btnAgregarTarea");
    var span = document.getElementsByClassName("close")[0];

    // Asegurar que los elementos existen antes de usarlos
    if (btn && modal && span) {
        // Cuando el usuario hace clic en el botón, abrir el modal
        btn.onclick = function () {
            modal.style.display = "block";
        };

        // Cuando el usuario hace clic en <span> (x), cerrar el modal
        span.onclick = function () {
            modal.style.display = "none";
        };

        // Cuando el usuario hace clic fuera del modal, cerrarlo
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    } else {
        console.error("No se encontraron los elementos del modal.");
    }
});
