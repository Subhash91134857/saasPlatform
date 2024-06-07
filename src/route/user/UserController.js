const CommonController = require('../Common-Controller');
const UserService = require('../../service/user_service');

class UserController extends CommonController {
    constructor() {
        super();
        this.service = UserService;
    }
    signup() {
        return this.asyncWrapper(async (req) => {
            const { name, email, password } = req.body;
            const result = await this.service.user_signup(name, email, password);
            return {
                data: result.response
            }
        })
    }

    signin() {
        return this.asyncWrapper(async (req) => {
            const { email, password } = req.body;
            const token = await this.service.user_Signin(email, password);
            const response = {
                name: token.name,
                email: email,
                accessToken:token.token
            }
            return {
                data: response,
                
            }
        })
    }

    getMe() {
        return this.asyncWrapper(async (req)=>{
            const { userId } = req.user;
            const details = await this.service.user_details(userId);
            const response = {
                user: details.user,
                community:details.community
            }
            return {
                data:response,
            }
        })
    }
}

module.exports = new UserController();