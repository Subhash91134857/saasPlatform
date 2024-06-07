const UserModel = require('../model/userModel');
const AppError = require('../utils/app-error');
const bcrypt = require('bcrypt');
const { gEnv } = require('../utils/env');
const jwt = require('jsonwebtoken');
const CommunityModel = require('../model/communityModel');
class UserService {
    constructor() {
        this.model = UserModel;
        this.Cmodel = CommunityModel;
    }

    // signup
    async user_signup(name, email, password) {
        const user_exist = await this.model.findOne({ email });
        if (user_exist !== null) {
            throw new AppError('Email already exist', 404, true, 'USER_ALREADY_EXIST');
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await this.model.create({ name: name, email: email, password: hashPassword });
        const response = {
            name,
            email

        }
        return {
            response
        }

    }

    // signin
    async user_Signin(email, password) {
        const user_exist = await this.model.findOne({ email });
        if (user_exist == null) {
            throw new AppError('User Not Exist', 404, true, "USER_NOT_FOUND");
        }

        const passwordMatch = await bcrypt.compare(password, user_exist.password);
        if (!passwordMatch) {
            throw new AppError("ID and Password does not match.", 404, true, "INVALID_CREDENTIALS");

        }
        const payload = { userID: user_exist._id };
        const secretKey = gEnv('JWT_SECRET');
        const options = { expiresIn: '7d' };
        const accessToken = jwt.sign(payload, secretKey, options);
        return {
            token: accessToken,
            name: user_exist.name
        }
    }

    // details of the User
    async user_details(userId) {
        const user = await this.model.findOne(userId);
        const community = await this.Cmodel.find({ user: userId });
        return {
            user, community
        }
    }
}

module.exports = new UserService();