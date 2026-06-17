// DOM Element Selectors
const amountInput = document.getElementById('amount-input');
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const convertButton = document.getElementById('convert-button');
const resultDiv = document.getElementById('result');

// Global object to store rates once fetched from the API
let exchangeRates = {};

// 1. Fetch live rates from a reliable public API
async function fetchCurrencyRates() {
    try {
        resultDiv.innerText = "Loading live rates...";
        
        // Using a free, reliable open API (Base currency is USD)
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        
        if (!response.ok) throw new Error("Network response failed.");
        
        const data = await response.json();
        exchangeRates = data.rates; // Extracts the dictionary of rates
        
        // Inject currency codes into select dropdowns
        populateDropdownMenus(Object.keys(exchangeRates));
        resultDiv.innerText = "Rates loaded. Enter an amount!";
        
    } catch (error) {
        console.error("API Fetch Error:", error);
        resultDiv.innerText = "Error loading live data. Try again later.";
    }
}

// 2. Populate the dropdown HTML elements with API data
function populateDropdownMenus(currencyCodes) {
    currencyCodes.forEach(code => {
        const optionFrom = document.createElement('option');
        const optionTo = document.createElement('option');
        
        optionFrom.value = code;
        optionFrom.innerText = code;
        optionTo.value = code;
        optionTo.innerText = code;
        
        // Set smart default values
        if (code === 'USD') optionFrom.selected = true;
        if (code === 'EUR') optionTo.selected = true;
        
        fromCurrency.appendChild(optionFrom);
        toCurrency.appendChild(optionTo);
    });
}

// 3. Perform conversion logic based on selected currencies
function performConversion() {
    const amount = parseFloat(amountInput.value);
    const sourceCurrency = fromCurrency.value;
    const targetCurrency = toCurrency.value;

    // Validation
    if (isNaN(amount) || amount <= 0) {
        resultDiv.innerHTML = "<span style='color: red;'>Please enter a valid positive amount.</span>";
        return;
    }

    // Formula calculation: convert amount back to base USD, then convert to target currency
    const amountInUSD = amount / exchangeRates[sourceCurrency];
    const convertedFinal = amountInUSD * exchangeRates[targetCurrency];

    // Render result to UI
    resultDiv.innerHTML = `<strong>${amount.toLocaleString()} ${sourceCurrency}</strong> = <br><span class='highlight'>${convertedFinal.toFixed(2)} ${targetCurrency}</span>`;
}

// Event Listeners
convertButton.addEventListener('click', performConversion);

// Initial application trigger on page load
fetchCurrencyRates();