console.log("mir-selector.js loaded");

const container = document.getElementById("mir-selector");

if (!container) {
    console.log("No MIR selector container found.");
} else {

    container.innerHTML = "<p>Loading states...</p>";

    fetch("https://automation.digitolservices.com/webhook/mir/states")
        .then(response => response.json())
        .then(states => {

            let html = `
                <label for="stateSelect"><strong>Select State</strong></label><br><br>

                <select id="stateSelect">
                    <option value="">-- Select State --</option>
            `;

            states.forEach(item => {
                html += `<option value="${item.state}">${item.state}</option>`;
            });

            html += `
                </select>

                <div id="countyContainer" style="margin-top:20px;"></div>
            `;

            container.innerHTML = html;

            // -----------------------------
            // State selected
            // -----------------------------

            document.getElementById("stateSelect")
                .addEventListener("change", function () {

                    const state = this.value;
                    const countyContainer = document.getElementById("countyContainer");

                    if (!state) {
                        countyContainer.innerHTML = "";
                        return;
                    }

                    countyContainer.innerHTML = "<p>Loading counties...</p>";

                    fetch(`https://automation.digitolservices.com/webhook/mir/counties?state=${state}`)
                        .then(response => response.json())
                        .then(counties => {

                            console.log(counties);

let countyHtml = `
    <label for="countySelect"><strong>Select County</strong></label><br><br>

    <select id="countySelect">
        <option value="">-- Select County --</option>
`;

counties.forEach(item => {

    countyHtml += `
        <option value="${item.county}">
            ${item.county}
        </option>
    `;

});

countyHtml += `
    </select>

    <div id="reportContainer" style="margin-top:20px;"></div>
`;

countyContainer.innerHTML = countyHtml;
                        })
                        .catch(error => {

                            console.error(error);

                            countyContainer.innerHTML =
                                "<p style='color:red;'>Unable to load counties.</p>";

                        });

                });

        })
        .catch(error => {

            console.error(error);

            container.innerHTML =
                "<p style='color:red;'>Unable to load states.</p>";

        });

}
