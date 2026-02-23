let chart;
const tbody = document.getElementById("tbody");

function formatCurrency(val) {
    let currency = document.getElementById("currency").value;
    if (currency === "USD") {
        return "$ " + val.toLocaleString("en-US");
    } else {
        return "Rp " + val.toLocaleString("id-ID");
    }
}

function formatDate(date) {
    let d = date.getDate().toString().padStart(2, '0');
    let m = (date.getMonth() + 1).toString().padStart(2, '0');
    let y = date.getFullYear();
    return `${d}-${m}-${y}`;
}

function generateRange() {

    let start = new Date(document.getElementById("startDate").value);
    let end = new Date(document.getElementById("endDate").value);

    if (!document.getElementById("startDate").value ||
        !document.getElementById("endDate").value) {
        alert("Pilih tanggal dulu!");
        return;
    }

    if (end < start) {
        alert("Tanggal akhir tidak boleh sebelum tanggal mulai!");
        return;
    }

    tbody.innerHTML = "";

    let diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    for (let i = 0; i < diffDays; i++) {

        let currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);

        tbody.innerHTML += `
        <tr>
            <td class="tanggal">${formatDate(currentDate)}</td>
            <td><input type="number" class="pl"></td>
            <td class="saldo">0</td>
        </tr>`;
    }

    hitung();
}

function hitung() {

    let saldoAwal = parseFloat(document.getElementById("saldoAwal").value) || 0;
    let saldo = saldoAwal;
    let prev = saldoAwal;
    let candleData = [];

    const rows = document.querySelectorAll("#tbody tr");

    rows.forEach((row, index) => {

        let input = row.querySelector(".pl");
        let saldoCell = row.querySelector(".saldo");

        let pl = parseFloat(input.value) || 0;
        saldo += pl;

        saldoCell.innerText = formatCurrency(saldo);

        let open = prev;
        let close = saldo;
        let high = Math.max(open, close);
        let low = Math.min(open, close);

        candleData.push({
            x: index + 1,
            y: [open, high, low, close]
        });

        prev = saldo;
    });

    updateChart(candleData);
}

function updateChart(data) {

    if (chart) chart.destroy();

    chart = new ApexCharts(document.querySelector("#chart"), {
        chart: {
            type: 'candlestick',
            height: 400,
            background: '#161b22'
        },
        series: [{ data: data }],
        theme: { mode: 'dark' },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#00ff88',
                    downward: '#ff4d4d'
                }
            }
        },
        xaxis: { type: 'category' }
    });

    chart.render();
}

document.getElementById("generateRange")
    .addEventListener("click", generateRange);

document.addEventListener("input", hitung);

document.getElementById("downloadPdf")
    .addEventListener("click", () => {
        html2pdf().from(document.getElementById("journal"))
                  .save("Trading_Journal.pdf");
    });
