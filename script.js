const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");

const text = document.getElementById("text");
const amount = document.getElementById("amount");
const type = document.getElementById("type");

const budgetInput = document.getElementById("budget");
const statusEl = document.getElementById("status");
const warningEl = document.getElementById("warning");
const emptyEl = document.getElementById("empty");

const startingBalanceInput = document.getElementById("starting-balance");

const localStorageTransactions =
JSON.parse(localStorage.getItem("transactions")) || [];

let transactions = localStorageTransactions;

function cleanNumberInput(input) {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "");
    });
}

function limitInputLength(input, maxLength) {
    input.addEventListener("input", () => {
        if (input.value.length > maxLength) {
            input.value = input.value.slice(0, maxLength);
        }
    });
}

cleanNumberInput(amount);
cleanNumberInput(budgetInput);
cleanNumberInput(startingBalanceInput);

limitInputLength(amount, 20);
limitInputLength(budgetInput, 20);
limitInputLength(startingBalanceInput, 20);
limitInputLength(text, 25);

function formatRupiah(number) {
    return Number(number).toLocaleString("id-ID");
}

function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === "" || amount.value.trim() === "") {
        alert("Please fill all fields.");
        return;
    }

    const transaction = {
        id: generateID(),
        text: text.value.trim(),
        amount:
            type.value === "expense"
                ? -Math.abs(Number(amount.value))
                : Math.abs(Number(amount.value)),
    };

    transactions.push(transaction);

    updateLocalStorage();
    init();

    text.value = "";
    amount.value = "";
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";

    const item = document.createElement("li");

    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML = `
        <button
            class="delete-btn"
            onclick="removeTransaction(${transaction.id})"
        >
            X
        </button>

        ${transaction.text}

        <span>
            ${sign}Rp${formatRupiah(Math.abs(transaction.amount))}
        </span>
    `;

    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map((t) => t.amount);

    const startingBalance =
        Number(startingBalanceInput.value) || 0;

    const total = amounts.reduce(
        (acc, item) => acc + item,
        startingBalance
    );

    const income = amounts
        .filter((item) => item > 0)
        .reduce((acc, item) => acc + item, 0);

    const expense =
        amounts
            .filter((item) => item < 0)
            .reduce((acc, item) => acc + item, 0) * -1;

    balance.innerText = `Rp${formatRupiah(total)}`;
    money_plus.innerText = `Rp${formatRupiah(income)}`;
    money_minus.innerText = `Rp${formatRupiah(expense)}`;
}

function checkBudget() {
    const budget = Number(budgetInput.value);

    const expense = transactions
        .filter((t) => t.amount < 0)
        .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    if (!budget) {
        statusEl.innerText = "Safe";
        warningEl.innerText = "";
        return;
    }

    if (expense > budget) {
        statusEl.innerText = "Over Budget ⚠️";
        warningEl.innerText = "You are spending too much!";
    } else {
        statusEl.innerText = "Safe";
        warningEl.innerText = "";
    }
}

function removeTransaction(id) {
    transactions = transactions.filter((t) => t.id !== id);

    updateLocalStorage();
    init();
}

function updateLocalStorage() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function init() {
    list.innerHTML = "";

    transactions.forEach(addTransactionDOM);

    updateValues();
    checkBudget();

    if (transactions.length === 0) {
        emptyEl.style.display = "block";
    } else {
        emptyEl.style.display = "none";
    }
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

form.addEventListener("submit", addTransaction);

budgetInput.addEventListener("input", checkBudget);

startingBalanceInput.addEventListener("input", updateValues);

init();
