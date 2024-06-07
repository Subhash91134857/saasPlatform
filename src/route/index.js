const RoleRouter = require('./role/index')
const UserRouter = require('./User/index');
const CommunityRouter = require('./community/index');

module.exports = (app) => {
    app.use('/v1/role', RoleRouter);
    app.use('/v1/auth', UserRouter);
    app.use('/v1/community', CommunityRouter)
    app.use('/v1/member', CommunityRouter)

}