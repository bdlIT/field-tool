function autoStaffing() {

    let pax = parseInt(document.querySelector('input[name="pax"]').value) || 0;

    // DEFAULT VALUES
    let staffing = {
        1: 1, // MedTech
        2: 1, // Team Leader
        3: 1, // Encoder
        4: 1, // RadTech
        5: 1, // ASC
        6: 1, // Nurse
        7: 1, // Receptionist
    };

    // 101–200
    if (pax >= 101) {
        staffing[1] = 2; // MedTech
        staffing[7] = 2; // Receptionist
    }

    // 201–300
    if (pax >= 201) {
        staffing[3] = 2; // Encoder
        staffing[5] = 2; // ASC
    }

    // 301–500
    if (pax >= 301) {
        staffing[1] = 3; // MedTech
    }

    // APPLY VALUES
    for (let row in staffing) {
        let input = document.getElementById('no_' + row);

        if (input) {
            input.value = staffing[row];
            compute(row);
        }
    }
}

function compute(row) {

    let no = parseFloat(document.getElementById('no_' + row)?.value) || 0;

    let rate = parseFloat(document.getElementById('rate_' + row)?.value) || 0;

    let ot = parseFloat(document.getElementById('ot_' + row)?.value) || 0;

    let amount = 0;

    // Rows with OT
    if (row <= 8) {

        let hourlyRate = rate / 8;

        let overtimePay = hourlyRate * 1.25 * ot;

        amount = (no * rate) + (no * overtimePay);

    } else {

        // Commission & Gasoline
        amount = no * rate;
    }

    document.getElementById('amount_' + row).value = amount.toFixed(2);

    computeTotal();
}

function computeTotal() {

    let total = 0;

    for (let i = 1; i <= 10; i++) {

        total += parseFloat(document.getElementById('amount_' + i)?.value) || 0;
    }

    document.getElementById('grand_total').value = total.toFixed(2);
}

function downloadPDF() {

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // =========================
    // COLORS
    // =========================
    const primaryGreen = [76, 140, 110];
    const softGreen = [236, 245, 239];
    const headerGreen = [210, 232, 220];
    const darkText = [40, 40, 40];

    // =========================
    // VALUES
    // =========================
    let pax =
        document.querySelector('input[name="pax"]').value || 0;

    let total =
        document.getElementById('grand_total').value || 0;

    let currentDate = new Date().toLocaleDateString();

    // =========================
    // HEADER BACKGROUND
    // =========================
    doc.setFillColor(...headerGreen);
    doc.rect(0, 0, 210, 42, "F");

    // =========================
    // LOGO
    // =========================
    try {

        const logo = new Image();
        logo.src = "BDL.png";

        doc.addImage(
            logo,
            "PNG",
            15,
            6,
            30,
            30
        );

    } catch (e) {

        console.log("Logo not loaded");

    }

    // =========================
    // TITLE
    // =========================
    doc.setTextColor(...darkText);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(21);

    doc.text(
        "FIELD COMPUTATION REPORT",
        105,
        18,
        { align: "center" }
    );

    // Subtitle
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(
        "Professional Staffing & Overtime Computation",
        105,
        26,
        { align: "center" }
    );

    // =========================
    // INFO SECTION
    // =========================
    doc.setFillColor(245, 248, 246);

    doc.roundedRect(
        14,
        48,
        182,
        18,
        3,
        3,
        "F"
    );

    doc.setFontSize(11);

    doc.text(`Pax: ${pax}`, 20, 59);

    doc.text(`Date: ${currentDate}`, 145, 59);

    // =========================
    // TABLE DATA
    // =========================
    let tableData = [];

    for (let i = 1; i <= 10; i++) {

        let role =
            document.querySelectorAll('.role-cell')[i - 1].innerText;

        let no =
            document.getElementById('no_' + i)?.value || 0;

        let rate =
            document.getElementById('rate_' + i)?.value || 0;

        let ot = "-";

        if (i <= 8) {

            let otElement =
                document.getElementById('ot_' + i);

            ot = otElement
                ? otElement.value || 0
                : 0;
        }

        let amount =
            document.getElementById('amount_' + i)?.value || 0;

        tableData.push([
            role,
            no,
            rate,
            ot,
            amount
        ]);
    }

    // =========================
    // TABLE
    // =========================
    doc.autoTable({

        startY: 75,

        head: [[
            "Staff",
            "No.",
            "Rate",
            "OT",
            "Amount"
        ]],

        body: tableData,

        theme: "grid",

        styles: {
            fontSize: 10,
            cellPadding: 4,
            halign: "center",
            valign: "middle"
        },

        headStyles: {
            fillColor: primaryGreen,
            textColor: 255,
            fontStyle: "bold",
            halign: "center"
        },

        alternateRowStyles: {
            fillColor: softGreen
        },

        columnStyles: {

            0: {
                halign: "left"
            }
        }
    });

    // =========================
    // TOTAL BOX
    // =========================
    let finalY = doc.lastAutoTable.finalY + 15;

    doc.setFillColor(...primaryGreen);

    doc.roundedRect(
        120,
        finalY - 8,
        70,
        16,
        3,
        3,
        "F"
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);

    doc.setTextColor(255, 255, 255);

    doc.text(
        `TOTAL: ${total}`,
        155,
        finalY + 2,
        { align: "center" }
    );

    // =========================
    // SIGNATORIES
    // =========================
    let signY = finalY + 40;

    doc.setTextColor(...darkText);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    // Prepared by
    doc.line(20, signY, 75, signY);

    doc.text(
        "Prepared By",
        47,
        signY + 6,
        { align: "center" }
    );

    // Checked by
    doc.line(80, signY, 135, signY);

    doc.text(
        "Checked By",
        107,
        signY + 6,
        { align: "center" }
    );

    // Approved by
    doc.line(140, signY, 195, signY);

    doc.text(
        "Approved By",
        167,
        signY + 6,
        { align: "center" }
    );

    // =========================
    // FOOTER
    // =========================
    doc.setFontSize(8);

    doc.setTextColor(120);

    doc.text(
        "Generated by IT Department – Blesces Health Services",
        105,
        288,
        { align: "center" }
    );

    // =========================
    // SAVE
    // =========================
    doc.save("Field_Computation_Report.pdf");
}