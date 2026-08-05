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

                            // ====================================
                            // County selected
                            // ====================================

                            document.getElementById("countySelect")
                                .addEventListener("change", function () {

                                    const selectedCounty = this.value;

                                    const reportContainer =
                                        document.getElementById("reportContainer");

                                    if (!selectedCounty) {
                                        reportContainer.innerHTML = "";
                                        return;
                                    }

                                    const county = counties.find(c => c.county === selectedCounty);

                                    if (!county) {
                                        reportContainer.innerHTML =
                                            "<p style='color:red;'>County not found.</p>";
                                        return;
                                    }

                                    let html = "";

                                    switch (county.report_state) {

                                        case "published":

                                            html += `
            <h3>Executive Market Intelligence Report Available</h3>

            <p>
                <a href="https://digitolservices.com/${county.url_slug}" target="_blank">
                    View Executive Market Intelligence Report
                </a>
            </p>
        `;

                                            break;

                                        case "generating":

                                            html += `
            <h3>Report Currently Being Generated</h3>

            <p>
                Current crawl coverage:
                <strong>${(parseFloat(county.coverage_pct) * 100).toFixed(1)}%</strong>
            </p>

            <p>
                Your county has exceeded the publication threshold.
                The report is currently being generated and will be
                published shortly.
            </p>
        `;

                                            break;

                                        default:

                                            const pct = county.coverage_pct
                                                ? (parseFloat(county.coverage_pct) * 100).toFixed(1)
                                                : "0.0";

                                            html += `
            <h3>Report Coming Soon</h3>

            <p>
                Current crawl coverage:
                <strong>${pct}%</strong>
            </p>

            <p>
                Executive Market Intelligence Reports are
                automatically generated once coverage reaches
                <strong>85%</strong>.
            </p>
        `;
                                    }

                                    reportContainer.innerHTML = html;

                                });


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
