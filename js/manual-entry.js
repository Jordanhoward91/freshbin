document.addEventListener("DOMContentLoaded", () => {
  const manualEntryForm = document.getElementById("manual-entry-form");

  manualEntryForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission

    // Retrieve form data
    const formData = {
      itemName: document.getElementById("item-name").value,
      expirationDate: document.getElementById("expiration-date").value,
      quantity: document.getElementById("quantity").value,
      category: document.getElementById("category").value,
      notes: document.getElementById("notes").value,
      unit: document.getElementById("unit").value,
      purchaseDate: document.getElementById("purchase-date").value,
      storageLocation: document.getElementById("storage-location").value,
      tags: document.getElementById("tags").value,
      priority: document.getElementById("priority").checked,
    };

    console.log("Form Submitted:", formData);

    // Save item to localStorage for Pantry page to access
    const pantryItems = JSON.parse(localStorage.getItem("pantryItems")) || [];
    pantryItems.push(formData);
    localStorage.setItem("pantryItems", JSON.stringify(pantryItems));

    alert(`Item "${formData.itemName}" added successfully!`);
    manualEntryForm.reset(); // Clear the form
  });
});
