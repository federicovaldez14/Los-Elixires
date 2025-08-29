document.addEventListener("DOMContentLoaded", () => {
    const lista = document.getElementById("lista-guardados");
    const detalle = document.getElementById("detalle-coctel");
    const contenidoDetalle = document.getElementById("contenido-detalle");
    const btnCerrar = document.getElementById("cerrar-detalle");

    // Leer carrito
    const carrito = JSON.parse(localStorage.getItem("carritoCocteles")) || [];

    if (carrito.length === 0) {
        lista.innerHTML = "<p>No hay cócteles guardados.</p>";
        return;
    }

    // Mostrar lista de cócteles guardados
    lista.innerHTML = "<ul>" + carrito.map(c => `
        <li>
            ${c.nombre}
            <button class="ver-detalle" data-id="${c.id}">Ver detalles</button>
        </li>
    `).join("") + "</ul>";

    // Evento para ver detalles
    lista.addEventListener("click", async (e) => {
        if (e.target.classList.contains("ver-detalle")) {
            const id = e.target.getAttribute("data-id");
            const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
            contenidoDetalle.innerHTML = "Cargando...";
            detalle.style.display = "block";
            try {
                const res = await fetch(url);
                const data = await res.json();
                if (data.drinks && data.drinks[0]) {
                    const coctel = data.drinks[0];

                    // Obtener ingredientes y cantidades
                    let ingredientes = "";
                    for (let i = 1; i <= 15; i++) {
                        const ingrediente = coctel[`strIngredient${i}`];
                        const medida = coctel[`strMeasure${i}`];
                        if (ingrediente) {
                            ingredientes += `<li>${ingrediente}${medida ? " - " + medida : ""}</li>`;
                        }
                    }

                    contenidoDetalle.innerHTML = `
                        <h2>${coctel.strDrink}</h2>
                        <img src="${coctel.strDrinkThumb}" alt="${coctel.strDrink}" width="200">
                        <p><strong>ID:</strong> ${coctel.idDrink}</p>
                        <p><strong>Categoría:</strong> ${coctel.strCategory}</p>
                        <p><strong>Ingredientes:</strong></p>
                        <ul>${ingredientes}</ul>
                        <p><strong>Instrucciones:</strong> ${coctel.strInstructions}</p>
                    `;
                } else {
                    contenidoDetalle.innerHTML = "No se encontró el cóctel.";
                }
            } catch {
                contenidoDetalle.innerHTML = "Error al cargar detalles.";
            }
        }
    });

    btnCerrar.addEventListener("click", () => {
        detalle.style.display = "none";
        contenidoDetalle.innerHTML = "";
    });
});