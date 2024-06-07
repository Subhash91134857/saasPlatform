const RoleModel = require('../model/roleModel');

class RoleService {
    constructor() {
        this.Rmodel = RoleModel;
    }
    async create_roles(name, scopes) {
        const createdRoles = await this.Rmodel.create({ name: name, scopes })
        return {
            createdRoles
        }
    }
    async get_roles() {
        return this.Rmodel.find();
    }
}

module.exports = new RoleService();