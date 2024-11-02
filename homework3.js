//Iļja Junkins ij23031

window.addEventListener('DOMContentLoaded', (event) => {
    // Display the information source
    document.getElementById('rates-source').textContent = rates.Sender.name;

    let lookup = {};
    for (let d in rates.Cube) {
        for (let c in rates.Cube[d].Cube) {
            let cur = rates.Cube[d].Cube[c].currency;
            if (cur && !(cur in lookup)) {
                lookup[cur] = {};
            }
            lookup[cur] = 1;
        }
    }

    let currencies = Object.keys(lookup).concat(["EUR"]).sort();
    let currencySell = document.getElementById('currency-sell');
    let currencyBuy = document.getElementById('currency-buy');

    currencies.forEach((currency) => {
        let option = document.createElement('option');
        option.text = currency;
        option.value = currency;
        currencySell.add(option);
        currencyBuy.add(option.cloneNode(true));
    });

    currencySell.addEventListener('change', updateCurrencyBuyList);
    currencyBuy.addEventListener('change', updateCurrencySellList);

    function updateCurrencyBuyList() {
        let selectedCurrency = currencySell.value;
        currencyBuy.innerHTML = '';
        if (selectedCurrency === 'EUR') {
            currencies.forEach((currency) => {
                let option = document.createElement('option');
                option.text = currency;
                option.value = currency;
                currencyBuy.add(option);
            });
        } else {
            let option = document.createElement('option');
            option.text = 'EUR';
            option.value = 'EUR';
            currencyBuy.add(option);
        }
    }

    function updateCurrencySellList() {
        let selectedCurrency = currencyBuy.value;
        currencySell.innerHTML = '';
        if (selectedCurrency === 'EUR') {
            currencies.forEach((currency) => {
                let option = document.createElement('option');
                option.text = currency;
                option.value = currency;
                currencySell.add(option);
            });
        } else {
            let option = document.createElement('option');
            option.text = 'EUR';
            option.value = 'EUR';
            currencySell.add(option);
        }
    }

    document.getElementById('convert').addEventListener('click', convertCurrency);

    function convertCurrency() {
        let date = document.getElementById('date-on').value;
        let amountSell = document.getElementById('amount-sell').value;
        let amountBuy = document.getElementById('amount-buy').value;

        if (date && (amountSell || amountBuy) && !(amountSell && amountBuy)) {
            let sellCurrency = currencySell.value;
            let buyCurrency = currencyBuy.value;
            let rate;

            if (sellCurrency === 'EUR') {
                rate = rates.Cube.find(cube => cube.time === date).Cube.find(cube => cube.currency === buyCurrency).rate;
            } else {
                rate = 1 / rates.Cube.find(cube => cube.time === date).Cube.find(cube => cube.currency === sellCurrency).rate;
            }

            // Display the exchange rate and currency
            document.getElementById('calculator-rate-info').style.display = 'block';
            document.getElementById('calculator-rate').textContent = rate.toFixed(2);
            document.getElementById('calculator-currency').textContent = buyCurrency;

            if (amountSell) {
                document.getElementById('amount-buy').value = (amountSell * rate).toFixed(2);
            } else {
                document.getElementById('amount-sell').value = (amountBuy / rate).toFixed(2);
            }
        } else {
            alert('Please enter a valid date and either an amount to sell or an amount to buy.');
        }
    }
});
