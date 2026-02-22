let chart;

// Generate 30 rows
const tbody = document.getElementById("tbody");
for (let i = 0; i < 30; i++) {
    tbody.innerHTML += `
    <tr>
        <td class="tanggal"></td>
        <td><input type="number" class="pl"></td>
        <td class="saldo">0</td>
    </tr>
    `;
}

function formatCurrency(val) {
    let currency = document.getElementById("currency").value;
    if (currency === "USD") {
        return "$ " + val.toLocaleString("en-US");
    } else {
        return "Rp " + val.toLocaleString("id-ID");
    }
}

function formatDate(date) {
    // Format: dd-mm-yyyy
    let d = date.getDate();
    let m = date.getMonth() + 1;
    let y = date.getFullYear();
    return `${d.toString().padStart(2, '0')}-${m.toString().padStart(2, '0')}-${y}`;
}

function hitung() {
    let saldoAwal = parseFloat(document.getElementById("saldoAwal").value) || 0;
    let saldo = saldoAwal;
    let prev = saldoAwal;

    let startDate = new Date(document.getElementById("startDate").value);
    let candleData = [];

    document.querySelectorAll(".pl").forEach((input, index) => {
        let pl = parseFloat(input.value) || 0;
        saldo += pl;

        document.querySelectorAll(".saldo")[index].innerText = formatCurrency(saldo);

        // Hitung tanggal
        let currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + index);
        document.querySelectorAll(".tanggal")[index].innerText = formatDate(currentDate);

        // Candlestick data
        let open = prev;
        let close = saldo;
        let high = Math.max(open, close) + Math.abs(close - open) * 0.4;
        let low = Math.min(open, close) - Math.abs(close - open) * 0.4;

        candleData.push({
            x: currentDate,
            y: [open, high, low, close]
        });

        prev = saldo;
    });

    updateChart(candleData);
}

function updateChart(data) {
    if (chart) chart.destroy();

    let options = {
        chart: {
            type: 'candlestick',
            height: 400,
            background: '#161b22'
        },
        series: [{
            data: data
        }],
        theme: { mode: 'dark' },
        plotOptions: {
            candlestick: {
                colors: {
                    upward: '#00ff88',
                    downward: '#ff4d4d'
                }
            }
        },
        xaxis: { type: 'datetime' },
        yaxis: { tooltip: { enabled: true } }
    };

    chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
}

// Download PDF
document.getElementById("downloadPdf").addEventListener("click", () => {
    const element = document.getElementById("journal");
    html2pdf().set({ 
        margin: 0.5, 
        filename: 'Trading_Journal.pdf', 
        image: { type: 'jpeg', quality: 0.98 }, 
        html2canvas: { scale: 2 }, 
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } 
    }).from(element).save();
});

document.addEventListener("input", hitung);
hitung();