class Bill {
    constructor(category, name, date, value, monthly) {
      this.category = category;
      this.name = name;
      this.date = date;
      this.value = value;
      this.monthly = monthly;
      this.paid = false;
    }

    logTest() {
        console.log(this.category, this.name, this.date, this.value, this.monthly, this.paid);
    }
}

module.exports = Bill