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

displayState()
fetchProductsData().then(() => {
    isFetching = false;
    displayState()
}).catch(err => console.log(err))