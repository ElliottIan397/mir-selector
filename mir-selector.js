console.log("mir-selector loaded");

const container = document.getElementById("mir-selector");

if (!container) {
    console.log("No MIR selector found.");
    return;
}

container.innerHTML = "<h2>MIR Selector Loaded</h2>";
