document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const resultado = document.getElementById("resultado-coctel");

    // Cargar carrito desde localStorage o inicializar vacío
    let carrito = JSON.parse(localStorage.getItem("carritoCocteles")) || [];

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = form.elements["coctel"].value;
        const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(input)}`;
        resultado.innerHTML = "Buscando...";

        try {
            const res = await fetch(url);
            const data = await res.json();
            if (data.drinks) {
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

                resultado.innerHTML = `
                    <h2>${coctel.strDrink}</h2>
                    <img src="${coctel.strDrinkThumb}" alt="${coctel.strDrink}" width="200">
                    <p><strong>ID:</strong> ${coctel.idDrink}</p>
                    <p><strong>Categoría:</strong> ${coctel.strCategory}</p>
                    <p><strong>Ingredientes:</strong></p>
                    <ul>${ingredientes}</ul>
                    <p><strong>Instrucciones:</strong> ${coctel.strInstructions}</p>
                    <button class="guardar" data-id="${coctel.idDrink}" data-nombre="${coctel.strDrink}">Guardar</button>
                `;

                // Agregar listener al botón de guardar
                const btnGuardar = resultado.querySelector(".guardar");
                btnGuardar.addEventListener("click", () => {
                    guardarCoctel(coctel.idDrink, coctel.strDrink);
                });
            } else {
                resultado.innerHTML = "No se encontró el cóctel.";
            }
        } catch (error) {
            resultado.innerHTML = "Error al buscar el cóctel.";
        }
    });

    function guardarCoctel(id, nombre) {
        // Verificar si ya está guardado
        if (!carrito.some(c => c.id === id)) {
            carrito.push({ id, nombre });
            localStorage.setItem("carritoCocteles", JSON.stringify(carrito));
            alert("Cóctel guardado en el carrito.");
        } else {
            alert("Este cóctel ya está en el carrito.");
        }
    }
});
