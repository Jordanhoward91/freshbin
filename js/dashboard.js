document.addEventListener("DOMContentLoaded", () => {
  const expiringItemsList = document.getElementById("expiring-items");

  fetch('data/mockData.json')
    .then(response => response.json())
    .then(data => {
      populateExpiringItems(data.pantry);
    })
    .catch(error => console.error("Error loading data:", error));

  const populateExpiringItems = (pantry) => {
    expiringItemsList.innerHTML = "";
    const expiringSoon = pantry.filter(item => isExpiringSoon(item.expiration));
    expiringSoon.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} - Expires: ${item.expiration}`;
      li.style.color = "red";
      expiringItemsList.appendChild(li);
    });
  };

  const isExpiringSoon = (expiration) => {
    const today = new Date();
    const expiryDate = new Date(expiration);
    return expiryDate - today > 0 && expiryDate - today <= 7 * 24 * 60 * 60 * 1000;
  };
});
