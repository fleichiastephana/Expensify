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

const localStorageTransactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

let transactions = localStorageTransactions;

// Add Transaction
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === "" || amount.value.trim() === "") {
        alert("Please add a text and amount");
        return;
    }

    const transaction = {
        id: generateID(),
        text: text.value,
        amount:
            type.value === "expense"
                ? -Math.abs(+amount.value)
                : Math.abs(+amount.value),
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateLocalStorage();
    updateValues();
    checkBudget();

    emptyEl.style.display = "none";

    text.value = "";
    amount.value = "";
}

// Add Transaction to DOM
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");

    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML = `
        ${transaction.text} 
        <span>${sign}Rp${Math.abs(transaction.amount)}</span> 
        <small>(${transaction.amount < 0 ? "Expense" : "Income"})</small>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// Update values
function updateValues() {
    const amounts = transactions.map((t) => t.amount);

    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);

    const income = amounts
        .filter((item) => item > 0)
        .reduce((acc, item) => acc + item, 0)
        .toFixed(2);

    const expense = (
        amounts
            .filter((item) => item < 0)
            .reduce((acc, item) => acc + item, 0) * -1
    ).toFixed(2);

    balance.innerText = `Rp${total}`;
    money_plus.innerText = `Rp${income}`;
    money_minus.innerText = `Rp${expense}`;
}

// Check Budget
function checkBudget() {
    const budget = parseFloat(budgetInput.value);

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

// Delete Transaction
function removeTransaction(id) {
    transactions = transactions.filter((t) => t.id !== id);

    updateLocalStorage();
    init();
}

// Local Storage
function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Init
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

// Generate ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

form.addEventListener("submit", addTransaction);

init();