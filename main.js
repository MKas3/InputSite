let olInput = document.querySelector(".ol-input");
let input = olInput.querySelector("input");
let addButton = olInput.querySelector(".btn");

let ol = document.querySelector(".main-ol ol");

let radioButtons = document.querySelectorAll(".form-check-input");

let innerOrderedList = [];
let innerAlphOrderedList = [];

let tempText = "";

let capturedId = -1;
let id = 1;
let sortingIndexNow = 0;

olInput.addEventListener("submit", processSubmit);

for (let i = 0; i < radioButtons.length; i++)
    radioButtons[i].addEventListener("click", () => processSortingChange(i));

document.addEventListener("click", function(e) {
    const target = e.target.closest(".del-button");
    if (target) {
        const li = target.closest("li");
        const liIndex = innerOrderedList.indexOf(li);
        for (var i = liIndex; i < innerOrderedList.length; i++)
            innerOrderedList[i].setAttribute(
                "data-id", 
                innerOrderedList[i].getAttribute("data-id") - 1);
        innerOrderedList.splice(liIndex, 1);
        innerAlphOrderedList = innerAlphOrderedList.filter(x => x != li);
        li.remove();
        id--;
    };
});

function processSubmit(event) {
    event.preventDefault();

    if (checkItemValidity(input.value)) {
        pushToOrderedLists(addLiToOl(input.value, id));
        input.value = "";
        id++;
    } else {
        alertInvalidName();
    };
};

function pushToOrderedLists(li)
{
    innerOrderedList.push(li);

    innerAlphOrderedList.push(li);
    sortAlphList();

    updateList();
}

function sortAlphList() {
    innerAlphOrderedList.sort((a, b) => a.innerText.localeCompare(b.innerText));
}

function addLiToOl(text, id) {
    const newLi = createElement("li");
    newLi.setAttribute("data-id", id);
    
    const label = createElement("label");
    newLi.appendChild(label);
    label.innerText = text.trim();

    const editButton = createButtonWithListener(
        id, "Edit", "btn-outline-secondary");

    const deleteButton = createButton("X", "btn-outline-danger");
    deleteButton.classList.add("del-button");

    const acceptButton = createButtonWithListener(
        id, "OK", "btn-outline-success", true);

    const cancelButton = createButtonWithListener(
        id, "Cancel", "btn-outline-danger", true);

    const renameInput = createInput(text, true);

    newLi.appendChild(deleteButton);
    newLi.appendChild(editButton);
    newLi.appendChild(acceptButton);
    newLi.appendChild(cancelButton);
    newLi.appendChild(renameInput);

    ol.appendChild(newLi);

    return newLi;
};

function alertInvalidName() {
    alert("Please enter a valid item (non-empty and not consisting of only spaces)");
};

function checkItemValidity(name) {
    const re = /[^ ]+/;
    return re.test(name);
};

function processButtonClick(id, buttonName) {
    if (capturedId != -1 && capturedId != id) return;

    const li = document.querySelector('[data-id="' + id + '"]');
    
    const editMode = li.classList.toggle("edit-mode");
    capturedId = editMode ? id : -1;

    const label = li.querySelector("label");
    const input = li.querySelector("input");
    label.classList.toggle("hide");
    input.classList.toggle("hide");

    for (const button of li.querySelectorAll("button")) {
        button.classList.toggle("hide");
    };

    if (editMode) {
        tempText = label.innerText;
    } else if (buttonName == "OK" && checkItemValidity(input.value)) {
        label.innerText = input.value;
        sortAlphList();
        updateList();
    } else {
        input.value = tempText; 
        if (buttonName == "OK")
            alertInvalidName();
    };
};

function processSortingChange(sortingIndex) {
    if (sortingIndexNow == sortingIndex) return;

    sortingIndexNow = sortingIndex;

    updateList();
};

function updateList() {
    const listToSort = sortingIndexNow < 2 ? innerOrderedList : innerAlphOrderedList;

    switch (sortingIndexNow) {
        case 0:
        case 2:
            for (var i = listToSort.length - 1; i > 0; i--) {
                ol.insertBefore(listToSort[i], listToSort[i+1]);
            };
            break;
        case 1:
        case 3:
            for (var i = 0; i < listToSort.length - 1; i++) {
                ol.insertBefore(listToSort[i+1], listToSort[i]);
            };
            break;
        default:
            break;
    };
};

function createButtonWithListener(id, name, btnOption, isEditMode = false, type = "button") {
    const button = createButton(name, btnOption, type);
    button.addEventListener("click", () => processButtonClick(id, name));

    if (isEditMode)
        button.classList.add("hide");

    return button;
};

function createButton(name, btnOption, type = "button") {
    const button = createElement("button", "btn", btnOption, "btn-sm");
    button.innerText = name;
    button.setAttribute("type", type);

    return button;
};

function createInput(text, isEditMode = false, inputOption = null) {
    const input = createElement("input", inputOption);
    input.value = text;

    if (isEditMode)
        input.classList.add("hide");

    return input;
};

function createElement() {
    const element = document.createElement(arguments[0]);
    for (argument of arguments)
        element.classList.add(argument);

    return element;
};