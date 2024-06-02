let autofillCollection;
let minimap;

// Form operation functions
function showMap() {
    const el = document.getElementById("minimap-container");
    el.classList.remove("none");
}
function hideMap() {
    const el = document.getElementById("minimap-container");
    el.classList.add("none");
}
function expandForm() {
    document.getElementById("manual-entry").classList.add("hide");
    document.querySelector(".secondary-inputs").classList.remove("hide");
    document.querySelector(".submit-btns").classList.remove("hide");
    const mapContainer = document.querySelector('#minimap-container')
    const child = mapContainer.children[0].children[0].children[1]
    child.style.display = 'none'
}
function collapseForm() {
    document.getElementById("manual-entry").classList.remove("hide");
    document.querySelector(".secondary-inputs").classList.add("hide");
    document.querySelector(".submit-btns").classList.add("hide");
}
function setValidationText(color, msg, clear = false) {
    const validationTextElement = document.getElementById("validation-msg");
    if (clear) validationTextElement.classList.add("none");
    validationTextElement.classList.remove("color-green", "color-red");
    validationTextElement.classList.add(`color-${color}`);
    validationTextElement.innerText = msg;
    validationTextElement.classList.remove("none");
}
function submitForm() {
    setValidationText("green", "Submitting new campground!");
    // setTimeout(() => {
    //     resetForm();
    // }, 2500);
}
function resetForm() {
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => input.value = "");
    collapseForm();
    setValidationText("green", "", true)
    autofillCollection.update();
    minimap.feature = null;
}

// Bind functions to HTML buttons
document
    .getElementById("manual-entry")
    .addEventListener("click", expandForm);
document.getElementById("btn-reset").addEventListener("click", resetForm);

// Autofill initialization
document.getElementById("search-js").onload = () => {
    mapboxsearch.config.accessToken = ACCESS_TOKEN;

    autofillCollection = mapboxsearch.autofill({});

    minimap = new MapboxAddressMinimap();
    minimap.canAdjustMarker = true;
    minimap.satelliteToggle = true;
    minimap.onSaveMarkerLocation = (lnglat) => {
        console.log(`Marker moved to ${lnglat}`);
    };
    const minimapContainer = document.getElementById("minimap-container");
    minimapContainer.appendChild(minimap);

    autofillCollection.addEventListener(
        "retrieve",
        async (e) => {
            expandForm();
            if (minimap) {
                minimap.feature = e.detail.features[0];
                showMap();
            }
        }
    );

    // Add confirmation prompt to shipping address
    const form = document.querySelector("form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const result = await mapboxsearch.confirmAddress(form, {
            minimap: true,
            skipConfirmModal: (feature) =>
                ['exact', 'high'].includes(
                    feature.properties.match_code.confidence
                )
        });
        const inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');


        // Check if every input has a value
        const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');

        if (result.type === 'nochange' && allFilled) {
            submitForm();
            setTimeout(() => {
                form.submit()
            }, 300);

        }
    });
}

