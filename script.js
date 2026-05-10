const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");

const list = document.getElementById("list");

const form = document.getElementById("form");

const text = document.getElementById("text");
const amount = document.getElementById("amount");

const type = document.getElementById("type");

const budgetInput = document.getElementById("budget");
const startingBalanceInput = document.getElementById("starting-balance");

const statusEl = document.getElementById("status");
const warningEl = document.getElementById("warning");
const emptyEl = document.getElementById("empty");

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];


// REMOVE LETTERS/SYMBOLS/E/DECIMALS
function cleanNumberInput(input) {

    input.addEventListener("input", () => {

        input.value = input.value.replace(/[^0-9]/g, "");

    });

}

cleanNumberInput(amount);
cleanNumberInput(budgetInput);
cleanNumberInput(startingBalanceInput);


// FORMAT RUPIAH
function formatRupiah(number) {

    return "Rp" + Number(number).toLocaleString("id-ID");

}


// ADD TRANSACTION
function addTransaction(e) {

    e.preventDefault();

    const textValue = text.value.trim();
    const amountValue = amount.value.trim();

    // VALIDATION
    if (textValue === "" || amountValue === "") {

        alert("Please fill all fields.");
        return;

    }

    if (textValue.length > 30) {

        alert("Transaction name too long.");
        return;

    }

    if (Number(amountValue) <= 0) {

        alert("Amount must be more than 0.");
        return;

    }

    const transaction = {

        id: generateID(),

        text: textValue,

        amount:
            type.value === "expense"
                ? -Math.abs(Number(amountValue))
                : Math.abs(Number(amountValue))

    };

    transactions.push(transaction);

    updateLocalStorage();

    init();

    text.value = "";
    amount.value = "";

}


// ADD TO DOM
function addTransactionDOM(transaction) {

    const sign = transaction.amount < 0 ? "-" : "+";

    const item = document.createElement("li");

    item.classList.add(
        transaction.amount < 0 ? "minus" : "plus"
    );

    item.innerHTML = `

        ${transaction.text}

        <span>
            ${sign}${formatRupiah(Math.abs(transaction.amount))}
        </span>

        <button
            class="delete-btn"
            onclick="removeTransaction(${transaction.id})"
        >
            x
        </button>

    `;

    list.appendChild(item);

}


// UPDATE VALUES
function updateValues() {

    const amounts = transactions.map(
        transaction => transaction.amount
    );

    const startingBalance =
        Number(startingBalanceInput.value) || 0;

    const total =
        amounts.reduce((acc, item) => acc + item, 0)
        + startingBalance;

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0);

    const expense = amounts
        .filter(item => item < 0)
        .reduce((acc, item) => acc + item, 0) * -1;

    balance.innerText = formatRupiah(total);

    money_plus.innerText = formatRupiah(income);

    money_minus.innerText = formatRupiah(expense);

}


// CHECK BUDGET
function checkBudget() {

    const budget = Number(budgetInput.value);

    const expense = transactions
        .filter(t => t.amount < 0)
        .reduce((acc, t) =>
            acc + Math.abs(t.amount), 0);

    if (!budget) {

        statusEl.innerText = "Safe";
        warningEl.innerText = "";
        return;

    }

    if (expense > budget) {

        statusEl.innerText = "Over Budget ⚠️";
        warningEl.innerText =
            "You are spending too much!";

    } else {

        statusEl.innerText = "Safe";
        warningEl.innerText = "";

    }

}


// DELETE
function removeTransaction(id) {

    transactions =
        transactions.filter(
            transaction => transaction.id !== id
        );

    updateLocalStorage();

    init();

}


// LOCAL STORAGE
function updateLocalStorage() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// INIT
function init() {

    list.innerHTML = "";

    transactions.forEach(addTransactionDOM);

    updateValues();

    checkBudget();

    emptyEl.style.display =
        transactions.length === 0
            ? "block"
            : "none";

}


// GENERATE ID
function generateID() {

    return Math.floor(
        Math.random() * 100000000
    );

}


form.addEventListener("submit", addTransaction);

budgetInput.addEventListener("input", checkBudget);

startingBalanceInput.addEventListener("input", updateValues);

init();
