// MAIN CLASS
module.exports = class DBResponse {
  constructor() {
    this.data = [];
    this.errors = {};
    this.length = 0;
    this.fields = {};
    this.isExecuted = false;
  };
}
