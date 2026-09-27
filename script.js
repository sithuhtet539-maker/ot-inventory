document.addEventListener("DOMContentLoaded", function () {
// Get HTML Elements
const dateInput = document.getElementById("checkDate");
const roomSelect = document.getElementById("orRoom");
const submitBtn = document.getElementById("submitStock");
const notesInput = document.getElementById("notes");

const userRole = document.getElementById("userRole");
const afternoonView = document.getElementById("afternoonView");


// Storage Key
function getStorageKey() {
    return "inventory-" + dateInput.value + "-" + roomSelect.value;
}


// Reset Submit Button
function resetButton() {
    submitBtn.textContent = "Submit Stock Check";
    submitBtn.style.backgroundColor = "";
    submitBtn.style.color = "";
}


// Show Submitted Button
function showSubmitted() {
    submitBtn.textContent = "Submitted ✓";
    submitBtn.style.backgroundColor = "green";
    submitBtn.style.color = "white";
}


// Update Status
function updateStatus() {

    const rows = document.querySelectorAll(
        ".inventory-table tbody tr"
    );

    rows.forEach(function (row) {

        const input = row.querySelector("input");
        const status = row.querySelector(".status");

        if (!input || !status) {
            return;
        }

        const need = Number(input.value);

        if (input.value === "") {

            status.textContent = "Pending";
            status.className = "status pending";

        } else if (need === 0) {

            status.textContent = "OK";
            status.className = "status ok";

        } else {

            status.textContent = "Need Stock";
            status.className = "status need";

        }

    });

}


// Load Saved Data
function loadData() {

    resetButton();

    const inputs = document.querySelectorAll(
        ".inventory-table tbody input"
    );

    inputs.forEach(function (input) {
        input.value = "";
    });

    notesInput.value = "";

    updateStatus();

    if (!dateInput.value || !roomSelect.value) {
        return;
    }

    const savedData = localStorage.getItem(
        getStorageKey()
    );

    if (!savedData) {
        return;
    }

    const data = JSON.parse(savedData);

    inputs.forEach(function (input, index) {
        if (data.items[index] !== undefined) {
            input.value = data.items[index];
        }
    });

    notesInput.value = data.notes || "";

    updateStatus();

    if (data.submitted === true) {
        showSubmitted();
    }

}


// Quantity Input Change
const quantityInputs = document.querySelectorAll(
    ".inventory-table tbody input"
);

quantityInputs.forEach(function (input) {

    input.addEventListener("input", function () {
        updateStatus();
    });

});


// Submit Stock Check
submitBtn.addEventListener("click", function () {

    if (!dateInput.value || !roomSelect.value) {
        alert("Please select Date and OR Room!");
        return;
    }

    const inputs = document.querySelectorAll(
        ".inventory-table tbody input"
    );

    const items = [];

    inputs.forEach(function (input) {
        items.push(input.value);
    });

    const data = {
        date: dateInput.value,
        room: roomSelect.value,
        items: items,
        notes: notesInput.value,
        submitted: true
    };

    localStorage.setItem(
        getStorageKey(),
        JSON.stringify(data)
    );

    showSubmitted();

    alert("Inventory submitted successfully!");

});


// OR Room Change
roomSelect.addEventListener("change", function () {
    loadData();
});


// Date Change
dateInput.addEventListener("change", function () {
    loadData();
});


// Role Change
userRole.addEventListener("change", function () {

    if (userRole.value === "afternoon") {
        afternoonView.style.display = "block";
    } else {
        afternoonView.style.display = "none";
    }

});


// First Load
loadData();
});