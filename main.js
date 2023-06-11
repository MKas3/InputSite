let ulInput = document.querySelector(".ul-input");
let input = ulInput.querySelector(".form-control");
let addButton = ulInput.querySelector(".btn");

let ul = document.querySelector(".main-ul").querySelector("ul");


addButton.onclick = function () {
    if (input.value != "")
    {
        var newLi = document.createElement("li");
        newLi.appendChild(document.createTextNode(input.value));
        
        ul.appendChild(newLi);

        input.value = "";
    };
};