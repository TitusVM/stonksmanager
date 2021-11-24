const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)

class Bill {
    constructor(category, name = "default bill", date = tomorrow.toLocaleDateString(), value = 10, monthly = false, pdfPath = "") {
      this.category = category;
      this.name = name;
      this.date = date;
      this.value = value;
      this.monthly = monthly;
      this.pdfPath = pdfPath;
      this.paid = false;
    }

    logTest() {
        console.log(this.category, this.name, this.date, this.value, this.monthly, this.pdfPath, this.paid);
    }
}

module.exports = Bill