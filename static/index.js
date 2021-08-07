var firstChallengeElement = document.getElementById('first-challenge');
var secondChallengeElement = document.getElementById('second-challenge');
var thirdChallengeElement = document.getElementById('third-challenge');
let [isFetching, invoiceData, nameData, parsedProducts] = [true, null, null, []];

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function fetchProductsData(params) {
    invoiceData = await fetchData('/data/invoices.json')
    nameData = await fetchData('/data/products.json')
}

function displayState() {
    var stateElement = document.getElementById('state');
    if (isFetching) {
        stateElement.innerHTML = 'Fetching data...'
    } else {
        stateElement.innerHTML = ''
    }
}

function createFirstChallengeGraph() {
    const itemList = {}

    invoiceData.map(obj => {
        const name = nameData.find(x => x.id == obj.product_id).name
        itemList[name] = (itemList[name] || 0) + obj.quantity
    })

    const maxNumber = Math.max(...Object.values(itemList))
    for (const item in itemList) {
        const qty = Number(itemList[item]).toFixed(2)
        firstChallengeElement.innerHTML += `<div class="item--wrapper">
        <div class="bar" style="height: ${(qty / maxNumber) * 100}px;">
        <span>${qty}</span>
        </div>
            <div class="item--data">
            <div class="number">${qty}</div>
                <div class="item">${item}</div>
            </div>
        </div>`
    }
}

function createSecondChallengeGraph() {
    const itemList = {}

    invoiceData.map(obj => {
        const parsedDate = new Date(obj.date)
        const date = parsedDate.getDate() + "/" + (parsedDate.getMonth() + 1) + "/" + parsedDate.getFullYear()
        itemList[obj.id] = { quantity: (itemList[obj.id] || 0) + obj.quantity, date }
    })

    const maxNumber = [...Object.values(itemList)].reduce((max, value) => Math.max(max || 0, value.quantity), [Infinity, -Infinity])

    for (const item in itemList) {
        const qty = Number(itemList[item].quantity).toFixed(2)
        secondChallengeElement.innerHTML += `<div class="item--wrapper">
        <div class="bar" style="height: ${(qty / maxNumber) * 100}px;">
        <span>${qty}</span>
        </div>
            <div class="item--data">
            <div class="number">${qty}</div>
                <div class="item">${itemList[item].date}</div>
            </div>
        </div>`
    }
}

function createThirdChallengeGraph() {
    const itemList = {}
    let itemType = []

    invoiceData.map(obj => {
        // Set para evitar que o mesmo valor seja incluido mais de uma vez
        itemType = [...new Set(nameData.flatMap(el => el.type))]
        const objDetails = nameData.find(x => x.id == obj.product_id)
        itemList[obj.id] = { quantity: (itemList[obj.id] || 0) + obj.quantity, name: objDetails.name, type: objDetails.type }
    })
    parsedProducts = itemList

    // Cria select
    var selectType = document.createElement("select");
    selectType.id = 'type-selector'
    selectType.onchange = (e) => generateThirdGraph(e.target.value)
    thirdChallengeElement.insertAdjacentElement('beforebegin',selectType)
    for (const type in itemType) {
        const typeName = String(itemType[type]).toLowerCase()
       var option = document.createElement("option");
       option.value = typeName;
       option.text = typeName;
       selectType.appendChild(option);
    }
    generateThirdGraph(itemType[0])

}

function generateThirdGraph(typeName) {
    const choosenType = Object.values(parsedProducts).filter(product => String(product.type).toLowerCase() == String(typeName).toLowerCase())
    const maxNumber = [...Object.values(choosenType)].reduce((max, value) => Math.max(max || 0, value.quantity), [Infinity, -Infinity])
    let productsHTML = "";
    for (const item in choosenType) {
        const qty = Number(choosenType[item].quantity).toFixed(2)
        productsHTML += `<br /><div class="item--wrapper">
        <div class="bar" style="height: ${(qty / maxNumber) * 100}px;">
        <span>${qty}</span>
        </div>
            <div class="item--data">
            <div class="number">${qty}</div>
                <div class="item">${choosenType[item].name}</div>
            </div>
        </div>`
    }
    thirdChallengeElement.innerHTML = productsHTML
}

displayState()
fetchProductsData().then(() => {
    isFetching = false;
    createFirstChallengeGraph()
    createSecondChallengeGraph()
    createThirdChallengeGraph()
    displayState()
}).catch(err => console.log(err))