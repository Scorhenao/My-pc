const btnAdd = document.getElementById("add-component-btn");
const sectionAdd = document.getElementById("add-component-section");
const sectionEdit = document.getElementById("edit-component-section");
const formAdd = document.getElementById("add-component-form");
const formEdit = document.getElementById("edit-component-form");

const nameComponentInput = document.getElementById("component-name");
const descriptionComponentInput = document.getElementById("component-description");
const priceComponentInput = document.getElementById("component-price");
const linkComponentInput = document.getElementById("component-link");

const editNameInput = document.getElementById("edit-component-name");
const editDescriptionInput = document.getElementById("edit-component-description");
const editPriceInput = document.getElementById("edit-component-price");
const editLinkInput = document.getElementById("edit-component-link");

const contentComponent = document.getElementById("content-components"); // Definido al inicio

btnAdd.addEventListener("click", (e) => {
    e.preventDefault();
    sectionAdd.classList.remove("d-none");
    sectionAdd.classList.add("d-flex");
});

const btnClose = document.querySelectorAll(".btn-close");
btnClose.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        sectionAdd.classList.add("d-none");
        sectionAdd.classList.remove("d-flex");
        sectionEdit.classList.add("d-none");
        sectionEdit.classList.remove("d-flex");
    });
});

// Load data from localStorage if available
window.addEventListener('load', () => {
    const components = JSON.parse(localStorage.getItem('components')) || [];
    components.forEach(component => {
        addComponentToList(component);
    });
});

formAdd.addEventListener("submit", (e) => {
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
    components.push({ name, description, price, link });
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

    calculateTotalPrice();
});

function addComponentToList(component) {
    const contentComponent = document.getElementById("content-components");

    const newComponent = document.createElement("ul");
    newComponent.className = "d-flex gap-2 align-items-center p-0";
    newComponent.innerHTML = `
        <li class="bg-gradient border-dark w-100 shadow">
            <b class="d-flex justify-content-center name-component">/--${component.name}--/</b>
            <a href="#" class="btn btn-warning edit-component">Editar</a>
            <a href="#" class="btn btn-danger drop-component">Eliminar</a>
            <hr>
            <p class="description-component">${component.description}.</p>
            <h5>Precio: <b class="precio-component">${component.price}$</b></h5>
            <a class="link-component btn btn-success d-flex justify-content-center" href="${component.link}">Get it</a>
        </li>`;

    contentComponent.appendChild(newComponent);

    newComponent.querySelector(".edit-component").addEventListener("click", (e) => {
        e.preventDefault();
        editComponent(component);
    });

    newComponent.querySelector(".drop-component").addEventListener("click", (e) => {
        e.preventDefault();
        deleteComponent(component);
    });
}


function editComponent(component) {
    sectionEdit.classList.remove("d-none");
    sectionEdit.classList.add("d-flex");

    // Pre-fill the form with existing component data
    editNameInput.value = component.name;
    editDescriptionInput.value = component.description;
    editPriceInput.value = component.price;
    editLinkInput.value = component.link;

    formEdit.onsubmit = (e) => {
        e.preventDefault();

        const updatedName = editNameInput.value;
        const updatedDescription = editDescriptionInput.value;
        const updatedPrice = editPriceInput.value;
        const updatedLink = editLinkInput.value;

        const components = JSON.parse(localStorage.getItem('components')) || [];
        const index = components.findIndex(c => c.name === component.name);
        
        if (index !== -1) {
            components[index] = { name: updatedName, description: updatedDescription, price: updatedPrice, link: updatedLink };
            localStorage.setItem('components', JSON.stringify(components));
        }

        // Clear and hide the edit form
        editNameInput.value = '';
        editDescriptionInput.value = '';
        editPriceInput.value = '';
        editLinkInput.value = '';

        sectionEdit.classList.add("d-none");
        sectionEdit.classList.remove("d-flex");

        // Update the displayed list of components
        contentComponent.innerHTML = '';
        components.forEach(addComponentToList);
    };
}


function deleteComponent(component) {
    const components = JSON.parse(localStorage.getItem('components')) || [];
    const updatedComponents = components.filter(c => c.name !== component.name);
    localStorage.setItem('components', JSON.stringify(updatedComponents));

    // Update the displayed list of components
    contentComponent.innerHTML = '';
    updatedComponents.forEach(addComponentToList);

    // Recalculate total price after deletion
    calculateTotalPrice();
}

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
