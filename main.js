let ulInput = document.querySelector(".ul-input");
let input = ulInput.querySelector("input");
let addButton = ulInput.querySelector(".btn");

let ul = document.querySelector(".main-ul ul");

let isItemCaptured = false;


ulInput.addEventListener("submit", processSubmit);


function processSubmit(event) {
    event.preventDefault();

    if (checkItemValidity(input.value)) {
        var newLi = document.createElement("li");

        var textNode = document.createTextNode(input.value.trim());
        newLi.appendChild(textNode);
        
        var editButton = createButton("Edit", "btn-outline-secondary");
        editButton.onclick = () => processEditClick(textNode, editButton, deleteButton, newLi);

        var deleteButton = createButton("X", "btn-outline-danger");
        deleteButton.onclick = () => newLi.remove();

        newLi.appendChild(deleteButton);
        newLi.appendChild(editButton);

        newLi.setAttribute("onmouseover", "this.style.color='#8a8a8a'");
        newLi.setAttribute("onmouseout", "this.style.color='#ffffff'");

        ul.appendChild(newLi);

        input.value = "";
    }
    else {
        alertInvalidName();
    };
};

function alertInvalidName() {
    alert("Please enter a valid item (non-empty and not consisting of only spaces)");
}

function checkItemValidity(name) {
    var re = /[^ ]+/;
    return re.test(name);
}

function processEditClick(textNode, editButton, deleteButton, newLi) {
    if (isItemCaptured) return;

    isItemCaptured = true;
    
    var tempText = captudedTempText = textNode.textContent;

    var renameInput = createInput(tempText, "rename-field");
        
    var acceptButton = createButton("OK", "btn-outline-success", "submit");   
    var cancelButton = createButton("Cancel", "btn-outline-danger");

    acceptButton.onclick = () => tryReplaceBack(renameInput.value);
    cancelButton.onclick = () => tryReplaceBack(tempText);

    newLi.replaceChild(renameInput, textNode);
    newLi.replaceChild(acceptButton, editButton);
    newLi.replaceChild(cancelButton, deleteButton);

    function tryReplaceBack(text) {

        if (!checkItemValidity(text)) {
            alertInvalidName();
            return;
        };

        textNode.textContent = text;

        newLi.replaceChild(textNode, renameInput);
        newLi.replaceChild(editButton, acceptButton);
        newLi.replaceChild(deleteButton, cancelButton);

        renameInput.remove();
        acceptButton.remove();
        cancelButton.remove();
        isItemCaptured = false;
    };
};

function createButton(name, btnOption, type = "button") {
    var button = createElement("button", "btn", btnOption, "btn-sm");
    button.innerText = name;
    button.setAttribute("type", type);

    return button;
};

function createInput(text, inputOption) {
    var input = createElement("input", inputOption);
    input.value = text;

    return input;
};

function createElement() {
    var element = document.createElement(arguments[0]);
    for (argument of arguments)
        element.classList.add(argument);

    return element;
};