document.addEventListener("DOMContentLoaded", () => {
  const scanButton = document.getElementById("scan-item");
  const barcodeVideo = document.getElementById("barcode-video");
  const pantryList = document.getElementById("pantry-list");

  // Function to merge pantry items from mockData and localStorage
  const loadPantryItems = async () => {
    // Fetch items from mockData.json
    let pantryFromMockData = [];
    try {
      const response = await fetch('data/mockData.json');
      const data = await response.json();
      pantryFromMockData = data.pantry || [];
    } catch (error) {
      console.error("Error loading mock data:", error);
    }

    // Load items from localStorage
    const pantryFromLocalStorage = JSON.parse(localStorage.getItem("pantryItems")) || [];

    // Combine both sources of pantry items
    return [...pantryFromMockData, ...pantryFromLocalStorage];
  };

  // Populate the pantry list
  const populatePantry = (pantry) => {
    pantryList.innerHTML = ""; // Clear existing list
    pantry.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name || item.itemName} - ${item.quantity || ''} ${item.unit || ''} - Expires: ${item.expiration || item.expirationDate} - Category: ${item.category || ''}`;
      pantryList.appendChild(li);
    });
  };

  // Load and populate pantry
  loadPantryItems().then(pantryItems => {
    populatePantry(pantryItems);
  });

  // Barcode scanning logic using QuaggaJS
  scanButton.addEventListener("click", () => {
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: barcodeVideo, // Attach video element
        constraints: {
          facingMode: "environment" // Use rear camera
        }
      },
      decoder: {
        readers: ["ean_reader", "code_128_reader"]
      }
    }, (err) => {
      if (err) {
        console.error("Quagga Initialization Error:", err);
        alert("Failed to start barcode scanning.");
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected((result) => {
      const code = result.codeResult.code;
      console.log("Detected barcode:", code);
      alert(`Scanned Barcode: ${code}`);
      Quagga.stop();
    });
  });
});
