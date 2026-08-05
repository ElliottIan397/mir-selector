console.log("mir-selector.js loaded");

const container = document.getElementById("mir-selector");

if (!container) {
    console.log("No MIR selector container found.");
} else {

    container.innerHTML = "<p>Loading states...</p>";

    fetch("https://automation.digitolservices.com/webhook/mir/states")
        .then(response => response.json())
        .then(data => {
            console.log(data);

            container.innerHTML =
                "<pre>" + JSON.stringify(data, null, 2) + "</pre>";
        })
        .catch(error => {
            console.error(error);

            container.innerHTML =
                "<p style='color:red;'>Unable to load states.</p>";
        });

}
