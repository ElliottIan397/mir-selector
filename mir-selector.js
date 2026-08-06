(() => {
    "use strict";

    const container = document.getElementById("mir-selector");

    // Script is loaded globally but runs only when the selector DIV exists.
    if (!container) {
        return;
    }

    const STATES_URL =
        "https://automation.digitolservices.com/webhook/mir/states";

    const COUNTIES_URL =
        "https://automation.digitolservices.com/webhook/mir/counties";

    const REPORT_BASE_URL =
        "https://www.digitolservices.com/";

    const stateNames = {
        AL: "Alabama",
        AK: "Alaska",
        AZ: "Arizona",
        AR: "Arkansas",
        CA: "California",
        CO: "Colorado",
        CT: "Connecticut",
        DE: "Delaware",
        FL: "Florida",
        GA: "Georgia",
        HI: "Hawaii",
        ID: "Idaho",
        IL: "Illinois",
        IN: "Indiana",
        IA: "Iowa",
        KS: "Kansas",
        KY: "Kentucky",
        LA: "Louisiana",
        ME: "Maine",
        MD: "Maryland",
        MA: "Massachusetts",
        MI: "Michigan",
        MN: "Minnesota",
        MS: "Mississippi",
        MO: "Missouri",
        MT: "Montana",
        NE: "Nebraska",
        NV: "Nevada",
        NH: "New Hampshire",
        NJ: "New Jersey",
        NM: "New Mexico",
        NY: "New York",
        NC: "North Carolina",
        ND: "North Dakota",
        OH: "Ohio",
        OK: "Oklahoma",
        OR: "Oregon",
        PA: "Pennsylvania",
        RI: "Rhode Island",
        SC: "South Carolina",
        SD: "South Dakota",
        TN: "Tennessee",
        TX: "Texas",
        UT: "Utah",
        VT: "Vermont",
        VA: "Virginia",
        WA: "Washington",
        WV: "West Virginia",
        WI: "Wisconsin",
        WY: "Wyoming"
    };

    function titleCase(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/\b\w/g, character => character.toUpperCase());
    }

    function formatCoverage(value) {
        const numericValue = Number.parseFloat(value);

        if (!Number.isFinite(numericValue)) {
            return 0;
        }

        return Math.min(100, Math.max(0, numericValue * 100));
    }

// ----------------------------------------------------
// Upgrade a standard SELECT into a searchable selector
// ----------------------------------------------------
function enableSearchableSelect(selector) {

    const element = document.querySelector(selector);

    if (!element) {
        return null;
    }

    // Already initialized?
    if (element.tomselect) {
        element.tomselect.destroy();
    }

    const ts = new TomSelect(element, {

        create: false,

        allowEmptyOption: true,

        maxOptions: 500,

        closeAfterSelect: true,

        openOnFocus: true,

        hidePlaceholder: false,

        placeholder: "",

            onInitialize: function () {
        this.control_input.placeholder = "Start typing...";
    },

    onChange: function (value) {
        this.control_input.placeholder = value ? "" : "Start typing...";
    },

        sortField: {
            field: "text",
            direction: "asc"
        }

    });

    ts.wrapper.classList.add("digitol-search");

return ts;

}
    
    function injectStyles() {
        if (document.getElementById("mir-selector-styles")) {
            return;
        }

        const style = document.createElement("style");
        style.id = "mir-selector-styles";

        style.textContent = `
            #mir-selector {
                width: 100%;
                box-sizing: border-box;
                font-family: Arial, Helvetica, sans-serif;
                color: #172033;
            }

            #mir-selector *,
            #mir-selector *::before,
            #mir-selector *::after {
                box-sizing: border-box;
            }

            #mir-selector .mir-card {
                width: 100%;
                max-width: 980px;
                margin: 24px auto;
                padding: 42px;
                background: #ffffff;
                border: 1px solid #dce3ec;
                border-radius: 14px;
                box-shadow: 0 12px 34px rgba(23, 32, 51, 0.10);
            }

            #mir-selector .mir-header {
                max-width: 760px;
                margin: 0 auto 34px;
                text-align: center;
            }

            #mir-selector .mir-eyebrow {
                margin: 0 0 10px;
                font-size: 13px;
                font-weight: 700;
                letter-spacing: 1.4px;
                text-transform: uppercase;
                color: #39745a;
            }

            #mir-selector .mir-title {
                margin: 0;
                font-size: clamp(28px, 4vw, 42px);
                line-height: 1.15;
                font-weight: 700;
                color: #172b4d;
            }

            #mir-selector .mir-subtitle {
                margin: 16px auto 0;
                max-width: 700px;
                font-size: 17px;
                line-height: 1.65;
                color: #5d6879;
            }

            #mir-selector .mir-fields {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 24px;
                padding: 28px;
                background: #f5f8fb;
                border: 1px solid #e1e7ef;
                border-radius: 12px;
            }

            #mir-selector .mir-field {
                min-width: 0;
            }

            #mir-selector .mir-label {
                display: block;
                margin: 0 0 9px;
                font-size: 14px;
                font-weight: 700;
                color: #29364a;
            }

            #mir-selector .mir-select {
                width: 100%;
                min-height: 52px;
                padding: 0 46px 0 16px;
                appearance: none;
                background-color: #ffffff;
                background-image:
                    linear-gradient(45deg, transparent 50%, #506176 50%),
                    linear-gradient(135deg, #506176 50%, transparent 50%);
                background-position:
                    calc(100% - 20px) 22px,
                    calc(100% - 14px) 22px;
                background-size: 6px 6px, 6px 6px;
                background-repeat: no-repeat;
                border: 1px solid #bdc8d6;
                border-radius: 8px;
                font: inherit;
                font-size: 16px;
                color: #172033;
                cursor: pointer;
                transition:
                    border-color 0.18s ease,
                    box-shadow 0.18s ease,
                    background-color 0.18s ease;
            }

            #mir-selector .mir-select:hover {
                border-color: #8291a5;
            }

            #mir-selector .mir-select:focus {
                outline: none;
                border-color: #39745a;
                box-shadow: 0 0 0 4px rgba(57, 116, 90, 0.14);
            }

            #mir-selector .mir-select:disabled {
                color: #8b95a3;
                background-color: #edf1f5;
                cursor: not-allowed;
            }

            #mir-selector .mir-status {
                margin-top: 26px;
                padding: 28px;
                border: 1px solid #dde4ec;
                border-radius: 12px;
                background: #ffffff;
            }

            #mir-selector .mir-status--published {
                border-color: #b9d9c9;
                background: #f2faf6;
            }

            #mir-selector .mir-status--generating {
                border-color: #d8cfaa;
                background: #fcfaf1;
            }

            #mir-selector .mir-status--crawling {
                border-color: #cfdae7;
                background: #f7f9fc;
            }

            #mir-selector .mir-status-grid {
                display: grid;
                grid-template-columns: 56px minmax(0, 1fr);
                gap: 18px;
                align-items: start;
            }

            #mir-selector .mir-status-icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                font-size: 27px;
                font-weight: 700;
            }

            #mir-selector .mir-status--published .mir-status-icon {
                color: #216c49;
                background: #dcefe4;
            }

            #mir-selector .mir-status--generating .mir-status-icon {
                color: #846f1f;
                background: #f3ebc9;
            }

            #mir-selector .mir-status--crawling .mir-status-icon {
                color: #315f8a;
                background: #e3edf7;
            }

            #mir-selector .mir-status-title {
                margin: 0;
                font-size: 23px;
                line-height: 1.25;
                color: #172b4d;
            }

            #mir-selector .mir-status-copy {
                margin: 9px 0 0;
                font-size: 16px;
                line-height: 1.6;
                color: #596678;
            }

            #mir-selector .mir-county-name {
                font-weight: 700;
                color: #28384f;
            }

            #mir-selector .mir-progress-area {
                margin-top: 22px;
            }

            #mir-selector .mir-progress-header {
                display: flex;
                justify-content: space-between;
                gap: 16px;
                margin-bottom: 9px;
                font-size: 14px;
                color: #596678;
            }

            #mir-selector .mir-progress-value {
                font-weight: 700;
                color: #172b4d;
            }

            #mir-selector .mir-progress-track {
                position: relative;
                width: 100%;
                height: 14px;
                overflow: hidden;
                background: #dfe6ee;
                border-radius: 999px;
            }

            #mir-selector .mir-progress-fill {
                width: 0;
                height: 100%;
                border-radius: inherit;
                background: linear-gradient(90deg, #39745a, #58a57b);
                transition: width 700ms ease;
            }

            #mir-selector .mir-progress-threshold {
                position: absolute;
                top: -3px;
                bottom: -3px;
                left: 85%;
                width: 2px;
                background: #172b4d;
                opacity: 0.65;
            }

            #mir-selector .mir-progress-note {
                margin: 9px 0 0;
                font-size: 13px;
                color: #6d7888;
            }

            #mir-selector .mir-button-row {
                margin-top: 22px;
            }

            #mir-selector .mir-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                min-height: 50px;
                padding: 0 24px;
                border-radius: 8px;
                background: #39745a;
                color: #ffffff;
                font-size: 15px;
                font-weight: 700;
                line-height: 1.2;
                text-decoration: none;
                transition:
                    transform 0.18s ease,
                    box-shadow 0.18s ease,
                    background-color 0.18s ease;
            }

            #mir-selector .mir-button:hover {
                color: #ffffff;
                background: #2f614b;
                box-shadow: 0 8px 18px rgba(47, 97, 75, 0.22);
                transform: translateY(-1px);
            }

            #mir-selector .mir-loading,
            #mir-selector .mir-error {
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                font-size: 15px;
            }

            #mir-selector .mir-loading {
                color: #586679;
                background: #f4f7fa;
            }

            #mir-selector .mir-error {
                color: #8d2f2f;
                background: #fff0f0;
                border: 1px solid #efcaca;
            }

            #mir-selector .mir-live-note {
                margin: 24px 0 0;
                text-align: center;
                font-size: 13px;
                line-height: 1.5;
                color: #748093;
            }

                .digitol-search .ts-control {
                    position: relative;
                    padding-left: 42px;
                }

                .digitol-search .ts-control::before {
                    content: "🔍";
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    opacity: .45;
                    pointer-events: none;
                }

                .ts-wrapper.focus .ts-control {
                    border-color: #2E8B57;
                    box-shadow: 0 0 0 4px rgba(46,139,87,.15);
                }

            @media (max-width: 720px) {
                #mir-selector .mir-card {
                    margin: 14px auto;
                    padding: 26px 20px;
                    border-radius: 10px;
                }

                #mir-selector .mir-fields {
                    grid-template-columns: 1fr;
                    gap: 18px;
                    padding: 20px;
                }

                #mir-selector .mir-status {
                    padding: 22px 18px;
                }

                #mir-selector .mir-status-grid {
                    grid-template-columns: 1fr;
                }

                #mir-selector .mir-status-icon {
                    width: 48px;
                    height: 48px;
                }

                #mir-selector .mir-button {
                    width: 100%;
                    text-align: center;
                }

            }
        `;

        document.head.appendChild(style);
    }

    function renderShell() {
        container.innerHTML = `
            <section class="mir-card" aria-labelledby="mir-selector-title">
                <header class="mir-header">
                    <p class="mir-eyebrow">U.S. County Research Library</p>

                    <h2 class="mir-title" id="mir-selector-title">
                        Executive Market Intelligence Reports
                    </h2>

                    <p class="mir-subtitle">
                        Understand the size, structure and competitive dynamics
                        of the managed services market in any U.S. county.
                    </p>
                </header>

                <div class="mir-fields">
                    <div class="mir-field">
                        <label class="mir-label" for="stateSelect">
                            Select State
                        </label>

                        <select
                            class="mir-select"
                            id="stateSelect"
                            aria-label="Select a state"
                            disabled
                        >
                            <option value="">Loading states...</option>
                        </select>
                    </div>

                    <div class="mir-field">
                        <label class="mir-label" for="countySelect">
                            Select County
                        </label>

                        <select
                            class="mir-select"
                            id="countySelect"
                            aria-label="Select a county"
                            disabled
                        >
                            <option value="">Select a state first</option>
                        </select>
                    </div>
                </div>

                <div id="reportContainer" aria-live="polite"></div>

                <p class="mir-live-note">
                    Report availability and market coverage are updated from
                    Digitol's live research platform.
                </p>
            </section>
        `;
    }

    function renderError(message) {
        const reportContainer =
            document.getElementById("reportContainer");

        reportContainer.innerHTML = `
            <div class="mir-error" role="alert">
                ${message}
            </div>
        `;
    }

    function renderLoading(message) {
        const reportContainer =
            document.getElementById("reportContainer");

        reportContainer.innerHTML = `
            <div class="mir-loading">
                ${message}
            </div>
        `;
    }

    function renderPublished(county, stateCode) {
        const stateName = stateNames[stateCode] || stateCode;
        const countyName = titleCase(county.county);
        const slug = String(county.url_slug || "").replace(/^\/+/, "");
        const reportUrl = `${REPORT_BASE_URL}${slug}`;

        return `
            <div class="mir-status mir-status--published">
                <div class="mir-status-grid">
                    <div class="mir-status-icon" aria-hidden="true">✓</div>

                    <div>
                        <h3 class="mir-status-title">
                            Executive Report Available
                        </h3>

                        <p class="mir-status-copy">
                            The Executive Market Intelligence Report for
                            <span class="mir-county-name">
                                ${countyName} County, ${stateName}
                            </span>
                            is published and available to read.
                        </p>

                        <div class="mir-button-row">
                            <a
                                class="mir-button"
                                href="${reportUrl}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Executive Market Intelligence Report →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderGenerating(county, stateCode) {
        const stateName = stateNames[stateCode] || stateCode;
        const countyName = titleCase(county.county);
        const coverage = formatCoverage(county.coverage_pct);

        return `
            <div class="mir-status mir-status--generating">
                <div class="mir-status-grid">
                    <div class="mir-status-icon" aria-hidden="true">●</div>

                    <div>
                        <h3 class="mir-status-title">
                            Executive Report In Production
                        </h3>

                        <p class="mir-status-copy">
                            Research coverage for
                            <span class="mir-county-name">
                                ${countyName} County, ${stateName}
                            </span>
                            has exceeded the publication threshold. Editorial
                            preparation and final publication are underway.
                        </p>

                        <div class="mir-progress-area">
                            <div class="mir-progress-header">
                                <span>Current market coverage</span>
                                <span class="mir-progress-value">
                                    ${coverage.toFixed(1)}%
                                </span>
                            </div>

                            <div class="mir-progress-track">
                                <div
                                    class="mir-progress-fill"
                                    data-progress="${coverage}"
                                ></div>
                                <div
                                    class="mir-progress-threshold"
                                    title="85% publication threshold"
                                ></div>
                            </div>

                            <p class="mir-progress-note">
                                The vertical marker indicates the 85% publication threshold.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderCrawling(county, stateCode) {
        const stateName = stateNames[stateCode] || stateCode;
        const countyName = titleCase(county.county);
        const coverage = formatCoverage(county.coverage_pct);
        const hasCoverage = county.coverage_pct !== null;

        const coverageMessage = hasCoverage
            ? `
                Market research for
                <span class="mir-county-name">
                    ${countyName} County, ${stateName}
                </span>
                is currently in progress.
            `
            : `
                Market research for
                <span class="mir-county-name">
                    ${countyName} County, ${stateName}
                </span>
                has not yet begun.
            `;

        return `
            <div class="mir-status mir-status--crawling">
                <div class="mir-status-grid">
                    <div class="mir-status-icon" aria-hidden="true">↗</div>

                    <div>
                        <h3 class="mir-status-title">
                            Market Research In Progress
                        </h3>

                        <p class="mir-status-copy">
                            ${coverageMessage}
                            Executive reports enter production once verified
                            market coverage reaches 85%.
                        </p>

                        <div class="mir-progress-area">
                            <div class="mir-progress-header">
                                <span>Current market coverage</span>
                                <span class="mir-progress-value">
                                    ${coverage.toFixed(1)}%
                                </span>
                            </div>

                            <div class="mir-progress-track">
                                <div
                                    class="mir-progress-fill"
                                    data-progress="${coverage}"
                                ></div>
                                <div
                                    class="mir-progress-threshold"
                                    title="85% publication threshold"
                                ></div>
                            </div>

                            <p class="mir-progress-note">
                                The vertical marker indicates the 85% publication threshold.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function animateProgressBars() {
        window.requestAnimationFrame(() => {
            document
                .querySelectorAll(
                    "#mir-selector .mir-progress-fill[data-progress]"
                )
                .forEach(bar => {
                    const progress = Number.parseFloat(
                        bar.dataset.progress
                    );

                    bar.style.width =
                        `${Math.min(100, Math.max(0, progress))}%`;
                });
        });
    }

    async function fetchJson(url) {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(
                `Request failed with status ${response.status}`
            );
        }

        return response.json();
    }

    async function loadStates() {
        const stateSelect =
            document.getElementById("stateSelect");

        try {
            const states = await fetchJson(STATES_URL);

            stateSelect.innerHTML = `
                <option value="">Select a state</option>
            `;

            states.forEach(item => {
                const stateCode = String(item.state || "")
                    .trim()
                    .toUpperCase();

                if (!stateCode) {
                    return;
                }

                const stateName =
                    stateNames[stateCode] || stateCode;

                const option = document.createElement("option");
                option.value = stateCode;
                option.textContent = stateName;

                stateSelect.appendChild(option);
            });

            stateSelect.disabled = false;

            enableSearchableSelect("#stateSelect");
        } catch (error) {
            console.error("Unable to load states:", error);

            stateSelect.innerHTML = `
                <option value="">Unable to load states</option>
            `;

            renderError(
                "The state list could not be loaded. Please refresh the page and try again."
            );
        }
    }

    async function loadCounties(stateCode) {
        const countySelect =
            document.getElementById("countySelect");

        const reportContainer =
            document.getElementById("reportContainer");

        countySelect.disabled = true;
        countySelect.innerHTML = `
            <option value="">Loading counties...</option>
        `;

        reportContainer.innerHTML = "";

        try {
            const counties = await fetchJson(
                `${COUNTIES_URL}?state=${encodeURIComponent(stateCode)}`
            );

            countySelect.innerHTML = `
                <option value="">Select a county</option>
            `;

            counties.forEach((county, index) => {
                const option = document.createElement("option");
                option.value = String(index);
                option.textContent =
                    `${titleCase(county.county)} County`;

                countySelect.appendChild(option);
            });

            countySelect.disabled = false;

            enableSearchableSelect("#countySelect");

            countySelect.onchange = () => {
                const selectedIndex = countySelect.value;

                if (selectedIndex === "") {
                    reportContainer.innerHTML = "";
                    return;
                }

                const county = counties[Number(selectedIndex)];

                if (!county) {
                    renderError(
                        "The selected county could not be found."
                    );
                    return;
                }

                switch (county.report_state) {
                    case "published":
                        reportContainer.innerHTML =
                            renderPublished(county, stateCode);
                        break;

                    case "generating":
                        reportContainer.innerHTML =
                            renderGenerating(county, stateCode);
                        animateProgressBars();
                        break;

                    default:
                        reportContainer.innerHTML =
                            renderCrawling(county, stateCode);
                        animateProgressBars();
                        break;
                }
            };
        } catch (error) {
            console.error("Unable to load counties:", error);

            countySelect.innerHTML = `
                <option value="">Unable to load counties</option>
            `;

            renderError(
                "The county list could not be loaded. Please select the state again or refresh the page."
            );
        }
    }

    function initialize() {
        injectStyles();
        renderShell();

        const stateSelect =
            document.getElementById("stateSelect");

        const countySelect =
            document.getElementById("countySelect");

        stateSelect.addEventListener("change", () => {
            const stateCode = stateSelect.value;

            countySelect.disabled = true;
            countySelect.innerHTML = `
                <option value="">Select a state first</option>
            `;

            document.getElementById("reportContainer").innerHTML = "";

            if (!stateCode) {
                return;
            }

            renderLoading("Loading counties...");
            loadCounties(stateCode);
        });

        loadStates();
    }

    initialize();
})();
