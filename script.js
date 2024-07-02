const btnAdd = document.getElementById("add-component-btn");
const sectionAdd = document.getElementById("add-component-section");

/** Show form to add component */
btnAdd.addEventListener("click", (e) => {
    e.preventDefault();
    sectionAdd.classList.remove("d-none");
    sectionAdd.classList.add("d-flex");
});

/** Hide form */
const btnClose = document.querySelector(".btn-close");

btnClose.addEventListener("click", (e) => {
    e.preventDefault();
    sectionAdd.classList.add("d-none");
    sectionAdd.classList.remove("d-flex");
});

/** Add component with the form */
const form = document.getElementById("add-component-form");

const nameComponentInput = document.getElementById("component-name");
const descriptionComponentInput = document.getElementById("component-description");
const priceComponentInput = document.getElementById("component-price");
const linkComponentInput = document.getElementById("component-link");

// Load data from localStorage if available
window.addEventListener('load', () => {
    const components = JSON.parse(localStorage.getItem('components')) || [];
    components.forEach(component => {
        addComponentToList(component);
    });
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameComponentInput.value;
    const description = descriptionComponentInput.value;
    const price = priceComponentInput.value;
    const link = linkComponentInput.value;

    const priceRegex = /^\d{1,3}(?:\.\d{3})*(?:,\d{2})?$/;

    if (!name || !description || !priceRegex.test(price) || !link) {
        const error = document.getElementById("error-message");
        error.textContent = "Por favor llene correctamente los campos. Asegúrese de que el precio esté en el formato correcto (ej. 100.000 o 2.000.000) y que todos estén completos.";
        error.classList.remove("d-none");
        error.classList.add("d-flex");
        return;
    }

    // Save component data to localStorage
    const components = JSON.parse(localStorage.getItem('components')) || [];
    components.push({
        name,
        description,
        price,
        link
    });
    localStorage.setItem('components', JSON.stringify(components));

    // Add component to the list
    addComponentToList({ name, description, price, link });

    // Clear form fields after adding component
    nameComponentInput.value = '';
    descriptionComponentInput.value = '';
    priceComponentInput.value = '';
    linkComponentInput.value = '';

    // Hide the form
    sectionAdd.classList.add("d-none");
    sectionAdd.classList.remove("d-flex");
});

function addComponentToList(component) {
    const contentComponent = document.getElementById("content-components");

    const newComponent = document.createElement("ul");
    newComponent.className = "d-flex gap-2 align-items-center p-0";
    newComponent.innerHTML =
    `<li class="bg-gradient border-dark w-100 shadow"><b class="d-flex justify-content-center" id="name-component">\--${component.name}--/</b>
        <a href="" class="btn btn-warning" id="edit-component">Editar</a>
        <a href="" class="btn btn-danger" id="drop-component">Eliminar</a>
        <hr>
        <p id="description-component">${component.description}.</p>
        <h5>Precio: <b id="precio-component">${component.price}$</b></h4>
        <a id="link-component" href="${component.link}" class="btn btn-success d-flex justify-content-center">Get it</a>
    </li>`;

    contentComponent.appendChild(newComponent);
}

/** avoid links href="#" refresh the page */
const linksWithoutRefresh = document.querySelectorAll('a[href="#"]');
linksWithoutRefresh.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault(); // Evitar que el navegador siga el enlace y recargue la página
    });
});

/** Edit component */

/** Delete component */

/** Total price */

const totalPrice = document.getElementById("total-price");

/** Calculate total price */
function calculateTotalPrice() {
    const components = JSON.parse(localStorage.getItem('components')) || [];
    const total = components.reduce((sum, component) => {
        // Convertir el precio a un número antes de sumar
        const price = parseFloat(component.price.replace(/\./g, '').replace(',', '.'));
        return sum + price;
    }, 0);
    totalPrice.textContent = `${total.toLocaleString('es-ES')} $`;
}

// calculate total price when charge the page
window.addEventListener('load', calculateTotalPrice);

// calculate total price when add a new component
form.addEventListener('submit', () => {
    calculateTotalPrice();
});