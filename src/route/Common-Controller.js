const asyncWrapper = require('../utils/async-wrapper');

class CommonController {
    constructor() {
        this.asyncWrapper = asyncWrapper;
    }
}

module.exports = CommonController;