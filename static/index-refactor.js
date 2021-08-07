var firstChallengeElement = document.getElementById('first-challenge');
var secondChallengeElement = document.getElementById('second-challenge');
var thirdChallengeElement = document.getElementById('third-challenge');
var filterChallengeElement = document.getElementById('filter-challenge');
let [isFetching, parsedProducts, parsedTypes] = [true, [], []];

async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function displayState() {
    var stateElement = document.getElementById('state');
    if (isFetching) {
        stateElement.innerHTML = 'Fetching data...'
    } else {
        stateElement.innerHTML = ''
    }
}

async function parseProductList() {
    const invoiceData = await fetchData('api/data/invoices')
    console.log(typeof invoiceData);
    const nameData = await fetchData('api/data/products')
    const itemList = {}
    invoiceData.map(obj => {
        // Set para evitar que o mesmo valor seja incluido mais de uma vez
        itemType = [...new Set(nameData.flatMap(el => String(el.type).toLowerCase()))]
        const objDetails = nameData.find(product => product.id == obj.product_id)
        const parsedDate = new Date(obj.date)
        const date = parsedDate.getDate() + "/" + (parsedDate.getMonth() + 1) + "/" + parsedDate.getFullYear()
        itemList[obj.id] = { quantity: (itemList[obj.id] || 0) + obj.quantity, name: objDetails.name, type: String(objDetails.type).toLowerCase(), date }
    })
    parsedProducts = itemList
}

function createFirstChallengeGraph() {
    // Remapping properties names
    const itemList = {}
    for (const product in parsedProducts) {
        itemList[parsedProducts[product].name] = { quantity: (itemList[product.name]?.quantity || 0) + parsedProducts[product].quantity, name: parsedProducts[product].name }
    }
    firstChallengeElement.innerHTML = generateGraphHTML(itemList)
}

function createSecondChallengeGraph() {
    const itemList = {}
    for (const product in parsedProducts) {
        itemList[parsedProducts[product].name] = { quantity: (itemList[product.name]?.quantity || 0) + parsedProducts[product].quantity, name: parsedProducts[product].date }
    }
    secondChallengeElement.innerHTML = generateGraphHTML(itemList)
}

function createThirdChallengeGraph() {
    const itemList = {}
    for (const product in parsedProducts) {
        itemList[parsedProducts[product].type] = { quantity: (itemList[parsedProducts[product].type]?.quantity || 0) + parsedProducts[product].quantity, name: parsedProducts[product].type }
    }
    thirdChallengeElement.innerHTML = generateGraphHTML(itemList)
}

function createFilterChallengeGraph() {
    const itemList = {}
    for (const product in parsedProducts) {
        itemList[parsedProducts[product].id] = { quantity: (itemList[product.name]?.id || 0) + parsedProducts[product].id, name: parsedProducts[product].name, type: parsedProducts[product].type }
    }

    // Cria select
    var selectType = document.createElement("select");
    selectType.id = 'type-selector'
    selectType.onchange = (e) => {
        const productList = filterProductByType(e.target.value);
        filterChallengeElement.innerHTML = generateGraphHTML(productList);
    }

    filterChallengeElement.insertAdjacentElement('beforebegin', selectType)
    for (const type in itemType) {
        const typeName = itemType[type];
        var option = document.createElement("option");
        option.value = typeName;
        option.text = typeName;
        selectType.appendChild(option);
    }

    const chosenTypeProducts = filterProductByType(itemType[0])
    filterChallengeElement.innerHTML = generateGraphHTML(chosenTypeProducts)
}

function filterProductByType(typeName) {
    return Object.values(parsedProducts).filter(product => product.type == typeName)
}

function generateGraphHTML(productsArray) {
    // Alternative:
    // const maxNumber = [...Object.values(productsArray)].reduce((max, value) => Math.max(max || 0, value.quantity), [Infinity, -Infinity])
    const maxNumber = Math.max(...[...Object.values(productsArray)].map(x => x.quantity))
    let productsHTML = "";
    for (const product in productsArray) {
        const qty = Number(productsArray[product].quantity).toFixed(2)
        productsHTML += `<br /><div class="item--wrapper">
        <div class="bar" style="height: ${(qty / maxNumber) * 100}px;">
        <span>${qty}</span>
        </div>
            <div class="item--data">
            <div class="number">${qty}</div>
                <div class="item">${productsArray[product].name}</div>
            </div>
        </div>`
    }
    return productsHTML
}

displayState()
parseProductList().then(() => {
    isFetching = false;
    displayState()
    parseProductList()
    createFirstChallengeGraph()
    createSecondChallengeGraph()
    createThirdChallengeGraph()
    createFilterChallengeGraph()
}).catch(err => console.log(err))