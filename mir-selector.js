console.log("mir-selector.js loaded");

const container = document.getElementById("mir-selector");

if (!container) {
    console.log("No MIR selector container found.");
} else {

    container.innerHTML = "<p>Loading states...</p>";

    fetch("https://automation.digitolservices.com/webhook/mir/states")
        .then(response => response.json())
        .then(states => {

            console.log(states);

            // Build the HTML
            let html = `
                <label for="stateSelect"><strong>Select State</strong></label><br><br>

                <select id="stateSelect">
                    <option value="">-- Select State --</option>
            `;

            states.forEach(item => {
                html += `
                    <option value="${item.state}">
                        ${item.state}
                    </option>
                `;
            });

            html += `
                </select>

                <div id="countyContainer" style="margin-top:20px;"></div>
            `;

            container.innerHTML = html;

        })
        .catch(error => {

            console.error(error);

            container.innerHTML =
                "<p style='color:red;'>Unable to load states.</p>";

        });

}
