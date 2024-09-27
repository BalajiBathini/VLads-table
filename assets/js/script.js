let chemicals = [];
let sortOrder = true; 

// Function to fetch data from JSON file
async function fetchData() {
    try {
        const response = await fetch('./assets/mockdata/chemicals.json');
        if (!response.ok) {
            throw new Error("Error fetching data: " + response.statusText);
        }
        chemicals = await response.json();
        loadTableData();
    } catch (error) {
        console.error(error);
    }
}

// Function to load table data
function loadTableData() {
    const tableBody = document.getElementById('tableBody'); 
    tableBody.innerHTML = '';
    chemicals.forEach((chemical, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="select-checkbox" data-id="${chemical.id}"></td>
            <td>${chemical.id}</td>
            <td>${chemical.chemicalName}</td>
            <td>${chemical.vendor}</td>
            <td>${chemical.density}</td>
            <td>${chemical.viscosity}</td>
            <td>${chemical.packaging}</td>
            <td>${chemical.packSize}</td>
            <td>${chemical.unit}</td>
            <td>${chemical.quantity}</td>
            <td class="action-column"><button onclick="editRow(this)">Edit</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to add an empty row with input fields
function addRow() {
    const newId = chemicals.length ? chemicals[chemicals.length - 1].id + 1 : 1;
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="checkbox" class="select-checkbox"></td>
        <td>${newId}</td>
        <td><input type="text" id="newchemicalName" placeholder="Chemical Name"></td>
        <td><input type="text" id="newvendor" placeholder="Vendor"></td>
        <td><input type="number" id="newdensity" placeholder="Density"></td>
        <td><input type="number" id="newviscosity" placeholder="Viscosity"></td>
        <td><input type="text" id="newpackaging" placeholder="Packaging"></td>
        <td><input type="text" id="newpackSize" placeholder="Pack Size"></td>
        <td><input type="text" id="newunit" placeholder="Unit"></td>
        <td><input type="number" id="newquantity" placeholder="Quantity"></td>
        <td><button onclick="saveNewRow()">Save</button></td>
    `;
    document.getElementById('tableBody').appendChild(newRow);
}

// Function to save the newly added row
function saveNewRow() {
    const newChemical = {
        id: chemicals.length ? chemicals[chemicals.length - 1].id + 1 : 1,
        chemicalName: document.getElementById('newchemicalName').value,
        vendor: document.getElementById('newvendor').value,
        density: parseFloat(document.getElementById('newdensity').value),
        viscosity: parseFloat(document.getElementById('newviscosity').value),
        packaging: document.getElementById('newpackaging').value,
        packSize: document.getElementById('newpackSize').value,
        unit: document.getElementById('newunit').value,
        quantity: parseInt(document.getElementById('newquantity').value)
    };

    if (!newChemical.chemicalName || !newChemical.vendor || isNaN(newChemical.density) || 
        isNaN(newChemical.viscosity) || !newChemical.packaging || 
        !newChemical.packSize || !newChemical.unit || isNaN(newChemical.quantity)) {
        alert("All fields are required!");
        return;
    }

    chemicals.push(newChemical);
    loadTableData(); // Reload table
}

// Function to delete selected rows
function deleteRow() {
    const selectedCheckboxes = document.querySelectorAll('.select-checkbox:checked');
    selectedCheckboxes.forEach(checkbox => {
        const id = parseInt(checkbox.getAttribute('data-id'));
        chemicals = chemicals.filter(chemical => chemical.id !== id);
    });
    loadTableData();
}

// Function to edit a row
function editRow(button) {
    const row = button.closest('tr');
    const cells = row.children;
    
    if (cells[2].querySelector('input')) {
        // Already in edit mode, ignore
        return;
    }

    const originalData = {
        id: cells[1].innerText,
        chemicalName: cells[2].innerText,
        vendor: cells[3].innerText,
        density: cells[4].innerText,
        viscosity: cells[5].innerText,
        packaging: cells[6].innerText,
        packSize: cells[7].innerText,
        unit: cells[8].innerText,
        quantity: cells[9].innerText,
    };

    cells[2].innerHTML = `<input type="text" value="${originalData.chemicalName}" />`;
    cells[3].innerHTML = `<input type="text" value="${originalData.vendor}" />`;
    cells[4].innerHTML = `<input type="number" value="${originalData.density}" />`;
    cells[5].innerHTML = `<input type="number" value="${originalData.viscosity}" />`;
    cells[6].innerHTML = `<input type="text" value="${originalData.packaging}" />`;
    cells[7].innerHTML = `<input type="text" value="${originalData.packSize}" />`;
    cells[8].innerHTML = `<input type="text" value="${originalData.unit}" />`;
    cells[9].innerHTML = `<input type="number" value="${originalData.quantity}" />`;
    
    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    saveButton.onclick = () => saveEditedRow(row, originalData);
    cells[10].appendChild(saveButton);

    const cancelButton = document.createElement('button');
    cancelButton.innerText = 'Cancel';
    cancelButton.onclick = () => cancelEdit(row, originalData);
    cells[10].appendChild(cancelButton);
}

function saveEditedRow(row, originalData) {
    const newChemical = {
        chemicalName: row.cells[2].querySelector('input').value,
        vendor: row.cells[3].querySelector('input').value,
        density: parseFloat(row.cells[4].querySelector('input').value),
        viscosity: parseFloat(row.cells[5].querySelector('input').value),
        packaging: row.cells[6].querySelector('input').value,
        packSize: row.cells[7].querySelector('input').value,
        unit: row.cells[8].querySelector('input').value,
        quantity: parseInt(row.cells[9].querySelector('input').value)
    };

    const chemicalIndex = chemicals.findIndex(chem => chem.id == originalData.id);
    if (chemicalIndex !== -1) {
        chemicals[chemicalIndex] = { id: originalData.id, ...newChemical };
    }
    
    loadTableData();  // Re-render the table
}

function cancelEdit(row, originalData) {
    row.cells[2].innerText = originalData.chemicalName;
    row.cells[3].innerText = originalData.vendor;
    row.cells[4].innerText = originalData.density;
    row.cells[5].innerText = originalData.viscosity;
    row.cells[6].innerText = originalData.packaging;
    row.cells[7].innerText = originalData.packSize;
    row.cells[8].innerText = originalData.unit;
    row.cells[9].innerText = originalData.quantity;
    row.cells[10].innerHTML = `<button onclick="editRow(this)">Edit</button>`;
}

// Function to toggle select all checkboxes
function toggleSelectAll(selectAllCheckbox) {
    const checkboxes = document.querySelectorAll('.select-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}

// Function to move the selected row up
function moveUp() {
    const selectedCheckboxes = document.querySelectorAll('.select-checkbox:checked');
    selectedCheckboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const previousRow = row.previousElementSibling;
        if (previousRow) {
            // Swap the chemicals in the array
            const currentIndex = Array.from(row.parentNode.children).indexOf(row);
            const previousIndex = currentIndex - 1;

            [chemicals[currentIndex], chemicals[previousIndex]] = [chemicals[previousIndex], chemicals[currentIndex]];

            row.parentNode.insertBefore(row, previousRow);
        }
    });
}

// Function to move the selected row down
function moveDown() {
    const selectedCheckboxes = document.querySelectorAll('.select-checkbox:checked');
    selectedCheckboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        const nextRow = row.nextElementSibling;
        if (nextRow) {
            // Swap the chemicals in the array
            const currentIndex = Array.from(row.parentNode.children).indexOf(row);
            const nextIndex = currentIndex + 1;

            [chemicals[currentIndex], chemicals[nextIndex]] = [chemicals[nextIndex], chemicals[currentIndex]];

            row.parentNode.insertBefore(nextRow, row);
        }
    });
}

// Function to sort the table by column
function sortTable(columnIndex) {
    chemicals.sort((a, b) => {
        const valA = Object.values(a)[columnIndex - 1];
        const valB = Object.values(b)[columnIndex - 1];

        if (typeof valA === 'string') {
            return sortOrder ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder ? valA - valB : valB - valA;
    });

    sortOrder = !sortOrder;
    loadTableData();
}

// Fetch data when the page loads
document.addEventListener('DOMContentLoaded', fetchData);
