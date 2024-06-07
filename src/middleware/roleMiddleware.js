const Member = require('../model/memberModel');
const Role = require('../model/roleModel');

module.exports = (requiredScopes) => {
    return async (req, res, next) => {
        try {

            var communityId;
            if (!req.params.id) {
                const { community } = req.body;
                communityId = community
            } else {
                const { id } = req.params;
                communityId = id
            }

            const userId = req.user._id;
            const member = await Member.findOne({ community: communityId, user: userId });
            if (!member) {
                return res.status(403).json({ message: 'Access denied. User is not a member of this community.' });
            }
            const role = await Role.findOne({ _id: member.role });
            const hasRequiredScope = requiredScopes.every(scope => role.scopes.includes(scope));

            if (!hasRequiredScope) {
                return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
};