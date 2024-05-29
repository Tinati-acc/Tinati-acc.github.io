// کلاس RoznameEntry برای نگهداری اطلاعات یک ورودی در دفتر روزنامه استفاده می‌شود
class RoznameEntry {
    constructor(date, description, accountName, amount, type) {
        this.date = date; // تاریخ
        this.description = description; // شرح
        this.accountName = accountName; // نام حساب
        this.amount = amount; // مبلغ
        this.type = type; // نوع حساب (بدهکار یا بستانکار)
    }
}

// کلاس RoznameJournal برای نگهداری لیست تراکنش‌های دفتر روزنامه و محاسبه مجموع بدهکار و بستانکار استفاده می‌شود
class RoznameJournal {
    constructor() {
        this.entries = []; // لیست تراکنش‌ها
        this.totalDebit = 0; // مجموع بدهکار
        this.totalCredit = 0; // مجموع بستانکار
    }

    // تابع برای اضافه کردن یک ورودی جدید به دفتر روزنامه
    addEntry(entry) {
        this.entries.push(entry);
        if (entry.type === "بدهکار") {
            this.totalDebit += entry.amount;
        } else {
            this.totalCredit += entry.amount;
        }
    }

    // تابع برای نمایش دفتر روزنامه در جدول HTML
    displayJournal() {
        const tableBody = document.getElementById("journalBody");
        tableBody.innerHTML = ""; // پاک کردن همه ردیف‌های جدول

        this.entries.forEach(entry => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.description}</td>
                <td>${entry.type === "بدهکار" ? entry.accountName : ""}</td>
                <td>${entry.type === "بستانکار" ? entry.accountName : ""}</td>
                <td>${entry.type === "بدهکار" ? entry.amount : ""}</td>
                <td>${entry.type === "بستانکار" ? entry.amount : ""}</td>
            `;
            tableBody.appendChild(row);
        });

        // نمایش مجموع بدهکار و بستانکار
        document.getElementById("totalDebit").textContent = this.totalDebit;
        document.getElementById("totalCredit").textContent = this.totalCredit;
    }

    // تابع برای نمایش دفتر کل
    displayLedger() {
        const ledgerDiv = document.getElementById("ledger");
        const ledger = this.calculateLedger();

        ledgerDiv.innerHTML = "";
        for (const account in ledger) {
            const accountDiv = document.createElement("div");
            accountDiv.classList.add("account");
            accountDiv.innerHTML = `<h3>${account}</h3><p>مانده: ${ledger[account]}</p>`;
            ledgerDiv.appendChild(accountDiv);
        }
    }

    // تابع برای محاسبه مانده حساب‌ها در دفتر کل
    calculateLedger() {
        const ledger = {};

        this.entries.forEach(entry => {
            if (!ledger[entry.accountName]) {
                ledger[entry.accountName] = 0;
            }
            if (entry.type === "بدهکار") {
                ledger[entry.accountName] += entry.amount;
            } else {
                ledger[entry.accountName] -= entry.amount;
            }
        });

        return ledger;
    }

    // تابع برای نمایش صورت سود و زیان
    displayIncomeStatement() {
        const incomeStatementDiv = document.getElementById("incomeStatement");
        const revenue = this.calculateTotal("بستانکار");
        const expenses = this.calculateTotal("بدهکار");
        const profit = revenue - expenses;

        incomeStatementDiv.innerHTML = `
            <p>درآمد کل: ${revenue}</p>
            <p>هزینه کل: ${expenses}</p>
            <p>سود: ${profit}</p>
        `;
    }

    // تابع برای محاسبه مجموع مبالغ بر اساس نوع
    calculateTotal(type) {
        return this.entries
            .filter(entry => entry.type === type)
            .reduce((sum, entry) => sum + entry.amount, 0);
    }

    // تابع برای نمایش نمودار خطی
    displayChart() {
        const ctx = document.getElementById('lineChart').getContext('2d');
        const labels = this.entries.map(entry => entry.date);
        const data = this.entries.map(entry => entry.amount);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'مبالغ',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// ایجاد یک نمونه از کلاس RoznameJournal
const journal = new RoznameJournal();

// تابع برای اضافه کردن یک تراکنش جدید به دفتر روزنامه
function addEntry() {
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;
    const accountName = document.getElementById("accountName").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const type = determineAccountType(accountName); // تشخیص نوع حساب

    if (!date || !description || !accountName || isNaN(amount)) {
        alert("لطفاً تمام فیلدها را پر کنید و مبلغ را به عدد وارد کنید.");
        return;
    }

    const entry = new RoznameEntry(date, description, accountName, amount, type);
    journal.addEntry(entry); // اضافه کردن تراکنش به دفتر روزنامه
    journal.displayJournal(); // نمایش دفتر روزنامه با تراکنش جدید
    journal.displayLedger(); // نمایش دفتر کل
    journal.displayIncomeStatement(); // نمایش صورت سود و زیان
    journal.displayChart(); // نمایش نمودار خطی
}

// تابع برای تشخیص نوع حساب (بدهکار یا بستانکار) بر اساس نام حساب
function determineAccountType(accountName) {
    // در اینجا یک لیست از حساب‌های بدهکار و بستانکار تعریف می‌شود
    const debitAccounts = [ "حساب دریافتنی" , "نقد", "بانک" , "موجودی کالا" , "هزینه"  , "دارایی ثابت"];
    const creditAccounts = ["سرمایه", "حساب پرداختنی" , "درامد" , "فروش"];


    if (debitAccounts.includes(accountName)) {
        return "بدهکار";
    } else if (creditAccounts.includes(accountName)) {
        return "بستانکار";
    } else {
        alert("حساب معتبر نیست.");
        return null;
    }
}
