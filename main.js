let olInput = document.querySelector(".ol-input");
let input = olInput.querySelector("input");
let addButton = olInput.querySelector(".btn");

let radioButtons = document.querySelectorAll(".form-check-input");

let ol = document.querySelector("ol");

const SortingTypes = {
    AscendingNumbers: 0,
    DescendingNumbers: 1,
    AlphabeticalOrder: 2,
    ReverseAlphabeticalOrder: 3,
};

let innerList = [];

let tempText = "";

let nextId = 1;
let capturedId = -1;
let sortingIndexNow = SortingTypes.AscendingNumbers;

olInput.addEventListener("submit", processSubmit);

for (let i = 0; i < radioButtons.length; i++) {
    radioButtons[i].addEventListener("click", () => processSortingChange(i));
}

function processSubmit(event) {
    event.preventDefault();

    if (checkNameValidity(input.value)) {
        const liForm = createLiForm(input.value, nextId);
        pushToList(liForm);

        input.value = "";
        nextId++;
    } else {
        alertInvalidName();
    }
}

function processSortingChange(sortingIndex) {
    if (sortingIndexNow == sortingIndex) return;

    sortingIndexNow = sortingIndex;

    updateList();
}

function pushToList(li) {
    innerList.push(li);

    updateList();
}

function checkNameValidity(name) {
    const re = /[^ ]+/;
    return re.test(name);
}

function alertInvalidName() {
    alert(
        "Please enter a valid item (non-empty and not consisting of only spaces)"
    );
}

function createLiForm(text, id) {
    const trimText = text.trim();
    const labelHTML = `<label class="hideable">${trimText}</label>`;
    const inputHTML = `<input class="hideable hide" value="${trimText}">`;
    const buttonsHTML =
        "<button class='btn btn-outline-danger btn-sm hideable del-button' type='button'>X</button>" +
        "<button class='btn btn-outline-secondary btn-sm hideable edit-button' type='button'>Edit</button>" +
        "<button class='btn btn-outline-success btn-sm hideable accept-button hide' type='button'>OK</button>" +
        "<button class='btn btn-outline-danger btn-sm hideable cancel-button hide' type='button'>Cancel</button>";

    const liHTML = `<li data-id=${id}>${labelHTML}${buttonsHTML}${inputHTML}</li>`;

    const newForm = document.createElement("form");
    newForm.innerHTML = liHTML;

    newForm.addEventListener("click", (e) => processLiClick(e));
    newForm.addEventListener("submit", (e) => processLiClick(e, true));

    return newForm;
}

function processLiClick(event, isSubmit = false) {
    event.preventDefault();
    const target = isSubmit
        ? event.target.querySelector(".accept-button")
        : event.target.closest(".btn");

    if (target) processButtonClick(target);
}

function processButtonClick(button) {
    const li = button.closest("li");
    const id = li.getAttribute("data-id") - 1;

    if (capturedId != -1 && capturedId != id) return;

    if (button.classList.contains("del-button")) {
        const liForm = li.closest("form");
        deleteForm(liForm, id);
    } else if (button.classList.contains("edit-button")) {
        toggleEditMode(li, id);
    } else if (button.classList.contains("accept-button")) {
        acceptRenaming(li);
    } else {
        cancelRenaming(li);
    }
}

function toggleEditMode(li, id) {
    const isEditMode = li.classList.toggle("edit-mode");
    capturedId = isEditMode ? id : -1;

    for (const element of li.querySelectorAll(".hideable")) {
        element.classList.toggle("hide");
    }

    const label = li.querySelector("label");
    tempText = label.innerText;
}

function acceptRenaming(li) {
    const label = li.querySelector("label");
    const input = li.querySelector("input");

    if (checkNameValidity(input.value)) {
        label.innerText = input.value;
        updateList();
    } else {
        input.value = tempText;
        alertInvalidName();
    }

    toggleEditMode(li);
}

function cancelRenaming(li) {
    const input = li.querySelector("input");

    input.value = tempText;

    toggleEditMode(li);
}

function deleteForm(form, id) {
    const formIndex = innerList.indexOf(form);

    for (var i = 0; i < innerList.length; i++) {
        const dataId = innerList[i].firstChild.getAttribute("data-id");
        if (dataId > id) {
            innerList[i].firstChild.setAttribute("data-id", dataId - 1);
        }
    }

    innerList.splice(formIndex, 1);
    form.remove();
    nextId--;
}

function updateList() {
    sortList();
    renderList();
}

function sortList() {
    if (innerList.length < 2) return;

    switch (sortingIndexNow) {
        case SortingTypes.AscendingNumbers:
            innerList.sort(
                (a, b) =>
                    a.firstChild.getAttribute("data-id") -
                    b.firstChild.getAttribute("data-id")
            );
            break;
        case SortingTypes.DescendingNumbers:
            innerList.sort(
                (a, b) =>
                    b.firstChild.getAttribute("data-id") -
                    a.firstChild.getAttribute("data-id")
            );
            break;
        case SortingTypes.AlphabeticalOrder:
            innerList.sort((a, b) =>
                a.textContent.localeCompare(b.textContent)
            );
            break;
        case SortingTypes.ReverseAlphabeticalOrder:
            innerList.sort((a, b) =>
                b.textContent.localeCompare(a.textContent)
            );
            break;
        default:
            break;
    }
}

function renderList() {
    ol.innerHTML = "";
    for (var i = 0; i < innerList.length; i++) {
        ol.appendChild(innerList[i]);
    }
}
