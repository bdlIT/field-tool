function compute(row) {
    let no = document.getElementById('no_' + row).value;
    let baseRate = document.getElementById('rate_' + row).value;

    let hours = document.querySelector('input[name="hours"]').value || 8;
    let extraHours = Math.max(0, hours - 8);

    let adjustedRate = parseFloat(baseRate || 0) + (extraHours * 100);

    let amount = no * adjustedRate;

    document.getElementById('amount_' + row).value = amount || 0;

    computeTotal();
}

// 🔥 NEW: recompute ALL rows when hours changes
function recomputeAll() {
    for (let i = 1; i <= 10; i++) {
        compute(i);
    }
}

function computeTotal() {
    let total = 0;
    for (let i = 1; i <= 10; i++) {
        let val = parseFloat(document.getElementById('amount_' + i).value) || 0;
        total += val;
    }
    document.getElementById('grand_total').value = total;
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let pax = document.querySelector('input[name="pax"]').value || 0;
    let hours = document.querySelector('input[name="hours"]').value || 8;
    let extraHours = Math.max(0, hours - 8);

    // =========================
    // 🔥 LOGO + HEADER
    // =========================
    const logo = new Image();
    logo.src = "BDL.png";

    doc.addImage(logo, "PNG", 15, 10, 30, 30);

    doc.setFontSize(16);
    doc.text("FIELD COMPUTATION REPORT", 105, 20, { align: "center" });

    doc.setFontSize(11);
    doc.text(`Pax: ${pax}`, 15, 45);
    doc.text(`Hours: ${hours}`, 60, 45);
    doc.text(`Extra Hour Rate: +100/hr`, 120, 45);

    // =========================
    // 🔥 TABLE DATA
    // =========================
    let tableData = [];

    for (let i = 1; i <= 10; i++) {
        let role = document.querySelectorAll('.role-cell')[i - 1].innerText;
        let no = document.getElementById('no_' + i).value || 0;
        let baseRate = document.getElementById('rate_' + i).value || 0;

        let adjustedRate = parseFloat(baseRate) + (extraHours * 100);
        let amount = document.getElementById('amount_' + i).value || 0;

        tableData.push([
            role,
            no,
            adjustedRate,
            amount
        ]);
    }

    // =========================
    // 🔥 TABLE (ALIGNED)
    // =========================
    doc.autoTable({
        startY: 55,
        head: [["Staff", "No.", "Rate", "Amount"]],
        body: tableData,
        styles: {
            fontSize: 10,
            halign: "center"
        },
        headStyles: {
            fillColor: [74, 108, 247],
            textColor: 255,
            halign: "center"
        },
        columnStyles: {
            0: { halign: "left" },
            1: { halign: "center" },
            2: { halign: "center" },
            3: { halign: "center" }
        }
    });

    // =========================
    // 🔥 TOTAL
    // =========================
    let total = document.getElementById('grand_total').value || 0;

    doc.setFontSize(12);
    doc.text(`TOTAL: ${total}`, 150, doc.lastAutoTable.finalY + 10);

    doc.save("computation.pdf");

}