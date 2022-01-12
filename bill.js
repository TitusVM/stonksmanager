export class Bill {

    constructor(category, name, date, value, monthly) {
      /**
       * @type {string}
       * @public
       */
      this.category = category;

      /**
       * @type {string}
       * @public
       */
      this.name = name;

      /**
       * @type {Date}
       * @public
       */
      this.date = date;

      /**
       * @type {number}
       * @public
       */
      this.value = value;

      /**
       * @type {boolean}
       * @public
       */
      this.monthly = monthly;

      /**
       * @type {boolean}
       * @public
       */
      this.paid = false;
    }

    logTest() {
        console.log(this.category, this.name, this.date, this.value, this.monthly, this.paid);
    }

    static arrayFromJson(json) {
      let array = [];
      json.forEach(function(el) {
        array.push(new Bill(
          el.category,
          el.description,
          new Date(el.date),
          el.amount,
          el.is_monthly
        ));
      });
      return array;
    }
}