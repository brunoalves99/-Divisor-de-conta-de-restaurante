import {
    inputClient,
    btnClient,
    inputProduct,
    inputProductValue,
    btnProduct,
    divClients,
    btnDone,
    divProducts,
    btnCalcValue,
    secAddClient,
    secAddProduct,
    mainElement,
    divFinalValues,
    pInfo,
    btnReset
} from "./elements.js";

let clients = [];
let products = [];

btnClient.addEventListener("click", () => {
    clients.push({name: inputClient.value});
    inputClient.value = "";
});

btnProduct.addEventListener("click", () => {
    products.push({[inputProduct.value]: Number(inputProductValue.value)});
    inputProduct.value = "";
    inputProductValue.value = "";
});

btnReset.addEventListener("click", () => {
    clients = [];
    products = [];
    btnReset.classList.add("hide");
    secAddClient.classList.remove("hide");
    secAddProduct.classList.remove("hide");
    btnDone.classList.remove("hide");
    divProducts.innerHTML = '';
    divClients.innerHTML = '';
    divFinalValues.innerHTML = '';
});

btnDone.addEventListener("click", () => {
    secAddClient.classList.add("hide");
    secAddProduct.classList.add("hide");
    btnDone.classList.add("hide");

    divProducts.classList.remove("hide");
    divClients.classList.remove("hide");
    btnCalcValue.classList.remove("hide");

    pInfo.classList.remove("hide");

    products.forEach((product) => {
        const newDiv = document.createElement("div");
        let nameProduct = Object.entries(product)[0][0];
        let newP = document.createElement("p");
        let button = document.createElement("button");
        button.addEventListener('click', () => addShared(nameProduct));
        button.textContent = "Compartilhado";
        newP.textContent = `${nameProduct}`;
        newP.appendChild(button);
        newDiv.appendChild(newP);
        divProducts.appendChild(newDiv);
    });

    clients.forEach((client) => {
        const newDiv = document.createElement("div");
        newDiv.classList.add('client');
        const p = document.createElement("p");
        p.textContent = client.name;
        newDiv.appendChild(p);

        products.forEach((product) => {
            let nameProduct = Object.entries(product)[0][0];
            let newP = document.createElement("p");

            let buttonLess = document.createElement("button");
            buttonLess.addEventListener('click', () => removeProduct(client.name, nameProduct, buttonLess));
            buttonLess.textContent = "-";

            let spanValue = document.createElement("span");
            spanValue.textContent = 0;

            let button = document.createElement("button");
            button.addEventListener('click', () => addProduct(client.name, nameProduct, button));
            button.textContent = "+";
            newP.textContent = `${nameProduct}`;

            let divButtons = document.createElement("div");
            divButtons.classList.add("divButtons");

            divButtons.appendChild(buttonLess);
            divButtons.appendChild(spanValue);
            divButtons.appendChild(button);

            newP.appendChild(divButtons);
            newDiv.appendChild(newP);
        });

        divClients.appendChild(newDiv);
    });
});

btnCalcValue.addEventListener("click", () => {
    calcValue();
});

function addProduct(name, product, btn) {
    btn.previousSibling.textContent = Number(Number(btn.previousSibling.textContent) + 1);

    for(let i = 0; i < clients.length; i++) {
        if(clients[i].name == name) {

            if(clients[i].hasOwnProperty(product)) {
                clients[i] = {...clients[i], [product]: clients[i][product] + 1};
            }else {
                clients[i] = {...clients[i], [product]: 1};
            }
        }
    }

    console.log(clients);
}

function removeProduct(name, product, btn) {
    if(Number(btn.nextSibling.textContent) >= 1) {
        btn.nextSibling.textContent = Number(Number(btn.nextSibling.textContent) - 1);
    }
    
    for(let i = 0; i < clients.length; i++) {
        if(clients[i].name == name) {

            if(clients[i].hasOwnProperty(product) && clients[i][product] >= 1) {
                clients[i] = {...clients[i], [product]: clients[i][product] - 1};
                if(clients[i][product] <= 0) {
                    delete clients[i][product];
                }
            } 
        }
    }

    console.log(clients);
}

function addShared(product) {
    for(let j = 0; j < products.length; j++) {
        if(products[j].hasOwnProperty(product)) {
            products[j] = {...products[j], shared: true};
        }
    }
}


function calcValue() {
    for(let i = 0; i < clients.length; i++) {
        if(clients[i].hasOwnProperty("valueToPay")) {
            clients[i]["valueToPay"] = 0;
        }
    }
    
    

    products.forEach((product) => {
        let nameProduct = Object.entries(product)[0][0];
        for(let i = 0; i < clients.length; i++) {

            if(clients[i].hasOwnProperty(nameProduct)) {
                if(product["shared"]) {
                    let clientsWithProducts = 0;
                    let pay2 = 0;
                    let clientProductAmount = clients[i][nameProduct];
                    let y = clientProductAmount;

                    for(y; y > 0; y--) {
                        for(let j = 0; j < clients.length; j++) {
                            if(clients[j].hasOwnProperty(nameProduct) && clients[j][nameProduct] >= clientProductAmount) {
                                clientProductAmount = clientProductAmount - 1;
                                clientsWithProducts++;
                            }
                        }

                        if(clientsWithProducts < 1) {
                            clientsWithProducts = 1;
                        }

                        pay2 += Number((product[nameProduct] / clientsWithProducts).toFixed(2));
                        clients[i] = {...clients[i], ["valueToPay"]: clients[i].valueToPay ? clients[i].valueToPay += pay2 : pay2};                    
                        clientsWithProducts = 0;
                        pay2 = 0;
                    }

                } else {
                    let pay = 0;
                    pay += Number((clients[i][nameProduct] * product[nameProduct]));
                    clients[i] = {...clients[i], ["valueToPay"]: clients[i].valueToPay ? clients[i].valueToPay += pay : pay};
                    pay = 0;
                }
            }
        }
     });
    

                let productsWithoutShared = [];
                products.forEach((product) => {
                        if(!product.hasOwnProperty("shared")) {
                            let nameProduct = Object.entries(product)[0][0];
                            productsWithoutShared.push(nameProduct);
                        }
                });
                clients.forEach((client) => {
                    let quantity = 0;
                    for(let n = 0; n < productsWithoutShared.length; n++) {
                        if(client.hasOwnProperty(productsWithoutShared[n])) {
                            quantity++;
                        }
                    }
                    if(quantity > 0) {
                        client.valueToPay = client.valueToPay + Number((client.valueToPay / 10).toFixed(2));
                    }
                });
                
                divProducts.classList.add("hide");
                divClients.classList.add("hide");
                btnCalcValue.classList.add("hide");
                btnReset.classList.remove("hide");

                clients.forEach((client) => {
                    pInfo.classList.add("hide");
                    let p = document.createElement("p");
                    p.style.color = "white";
                    p.textContent = `${client.name}: R$ ${(client.valueToPay).toFixed(2)}`;
                    divFinalValues.appendChild(p);
                });
}