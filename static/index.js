var firstChallengeElement = document.getElementById('first-challenge');
var secondChallengeElement = document.getElementById('second-challenge');
var thirdChallengeElement = document.getElementById('third-challenge');
let [isFetching, invoiceData, nameData] = [true, null, null];

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

displayState()
fetchProductsData().then(() => {
    isFetching = false;
    createFirstChallengeGraph()
    createSecondChallengeGraph()
    displayState()
}).catch(err => console.log(err))