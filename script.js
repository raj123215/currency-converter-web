const BASE_URL = "https://api.exchangerate-api.com/v4/latest/USD";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const amountInput = document.querySelector(".amount input");
const message = document.querySelector(".msg");

// Populate dropdowns with currency options
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = true;
        }
        select.appendChild(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update flag images
const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Button click event listener
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amtVal = parseFloat(amountInput.value);
    if (isNaN(amtVal) || amtVal <= 0) {
        alert("Please enter a valid posetive number");
        return;
    }

    const fromCurrency = fromCurr.value.toUpperCase();
    const toCurrency = toCurr.value.toUpperCase();
    
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const rate = data.rates[toCurrency];
        const convertedAmount = amtVal * rate;
        message.textContent = `${amtVal} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
});
