let newFormInput = document.querySelector(".ol-input");
let input = newFormInput.querySelector("input");

let radioButtons = document.querySelectorAll(".form-check-input");

let itemsListNode = document.querySelector("ol");

const SortingTypes = {
    AscendingNumbers: 0,
    DescendingNumbers: 1,
    AlphabeticalOrder: 2,
    ReverseAlphabeticalOrder: 3,
};

let innerList = [];

let nextId = 1;
let editorBusy = false;
let sortingIndexNow = SortingTypes.AscendingNumbers;

newFormInput.addEventListener("submit", addNewItem);

for (let i = 0; i < radioButtons.length; i++) {
    radioButtons[i].addEventListener("click", () => processSortingChange(i));
}

document.addEventListener("click", function (event) {
    let target;
    if (target = event.target.closest('.del-button') ) {
        if (editorBusy) return;
        const arrIndex = target.closest('li').getAttribute('data-index');
        const id = innerList[arrIndex].id;
        innerList.splice(arrIndex, 1);
        for (var i = 0; i < innerList.length; i++) {
            if (innerList[i].id > id) {
                innerList[i].id--;
            }
        }
        nextId--;
        updateList();
        return;
    }
    if (target = event.target.closest('.edit-button')) { // включение редактирования. чисто визуальные изменения
        if (editorBusy) return;
        toggleEditMode(target.closest('li'));
        editorBusy = true;
        return;
    }
    if (target = event.target.closest('.cancel-button')) { // отмена редактирования
        target.closest('li').querySelector('input').value = innerList[target.closest('li').getAttribute('data-index')].text;
        toggleEditMode(target.closest('li'));
        editorBusy = false;
        return;
    }
    if (target = event.target.closest('.accept-button')) { // подтверждение редактирования
        if (!checkNameValidity(target.closest('li').querySelector('input').value)) {
            alertInvalidName();
            return;
        }
        innerList[target.closest('li').getAttribute('data-index')].text = target.closest('li').querySelector('input').value;
        editorBusy = false;
        updateList();
        return;
    }
})

function addNewItem(event) {
    event.preventDefault();

    if (!checkNameValidity(input.value)) {
        alertInvalidName();
        return;
    }
    innerList.push({text: input.value.trim(), id: nextId});
    updateList();
    input.value = "";
    nextId++;
}

function processSortingChange(sortingIndex) {
    if (sortingIndexNow == sortingIndex) return;

    sortingIndexNow = sortingIndex;
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

function toggleEditMode(li) {
    for (const element of li.querySelectorAll(".hideable")) {
        element.classList.toggle("hide");
    }
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

function updateList() {
    sortList();
    renderList();
}

function sortList() {
    if (innerList.length < 2) return;

    switch (sortingIndexNow) {
        case SortingTypes.AscendingNumbers:
            innerList.sort(
                (a, b) => a.id - b.id
            );
            break;
        case SortingTypes.DescendingNumbers:
            innerList.sort(
                (a, b) => b.id - a.id
            );
            break;
        case SortingTypes.AlphabeticalOrder:
            innerList.sort(
                (a, b) => a.text.localeCompare(b.text) 
            );
            break;
        case SortingTypes.ReverseAlphabeticalOrder:
            innerList.sort(
                (a, b) => b.text.localeCompare(a.text)
            );
            break;
        default:
            break;
    }
}

function renderList() {
    itemsListNode.innerHTML = '';
    let htmlResult = '';
    for (var i = 0; i < innerList.length; i++) {
        const labelHTML = `<label class="hideable">${innerList[i].text}</label>`;
        const inputHTML = `<input class="hideable hide" value="${innerList[i].text}">`;
        const buttonsHTML =
            "<button class='btn btn-outline-danger btn-sm hideable del-button' type='button'>X</button>" +
            "<button class='btn btn-outline-secondary btn-sm hideable edit-button' type='button'>Edit</button>" +
            "<button class='btn btn-outline-success btn-sm hideable accept-button hide' type='button'>OK</button>" +
            "<button class='btn btn-outline-danger btn-sm hideable cancel-button hide' type='button'>Cancel</button>";

        htmlResult += `<li data-index="${i}"" data-id="${innerList[i].id}">${labelHTML}${buttonsHTML}${inputHTML}</li>`;
    }
    itemsListNode.innerHTML = htmlResult
}
