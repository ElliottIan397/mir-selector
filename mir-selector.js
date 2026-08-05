console.log("mir-selector.js loaded");

const container = document.getElementById("mir-selector");

if (!container) {
    console.log("Container not found");
} else {
    console.log("Container found");
    container.innerHTML = "<h2 style='color:green;'>✓ JavaScript Loaded Successfully</h2>";
}
