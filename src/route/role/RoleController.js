const role_services = require('../../service/role_services');
const CommonController = require('../Common-Controller');

class RoleController extends CommonController {
    constructor() {
        super();
        this.service = role_services
    }

    createRole() {
        return this.asyncWrapper(async (req) => {
            const { name, scopes } = req.body;
            const result = await this.service.create_roles(name, scopes);
            return {
                data: result.createdRoles
            }
        })
    }

    getAllRoles() {
        return this.asyncWrapper(async () => {
            const result = await this.service.get_roles();
            return {
                data: result
            }
        })
    }
}

module.exports = new RoleController();