const replitDB = require("@replit/database");

class replitSupport {
    _db = null;

    constructor() {
        this._db = new replitDB();
        require('./express.js');
    }
    
    async get(key) {
        return await this._db.get(key);
    }
    
    async set(key, value) {
        return await this._db.set(key, value)
    }
}

module.exports = replitSupport;