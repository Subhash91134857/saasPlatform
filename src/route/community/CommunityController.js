const Community_service = require('../../service/community_service');
const CommonController = require('../Common-Controller');

class CommunityController extends CommonController {
    constructor() {
        super();
        this.service = Community_service;
    }

    createCommunity() {
        return this.asyncWrapper(async (req) => {
            const { name } = req.body;
            const { user } = req;
            const result = await this.service.create_community(name, user._id)
            return {
                data: result
            }
        })
    }

    getAllCommunities() {
        return this.asyncWrapper(async (req) => {
            const result = await this.service.getall_communities();
            return {
                data: result
            }
        })
    }

    getAllMembers() {
        return this.asyncWrapper(async (req) => {
            const { id } = req.params;
            const result = await this.service.getall_members(id);
            return {
                data: result,
            };
        })
    }
    // getMyOwnedCommunities
    getMyOwnedCommunities() {
        return this.asyncWrapper(async (req) => {
            const { user } = req;
            const result = await this.service.getmy_owned_community(user._id);
            return {
                data: result,
            };
        })
    }

    // getMyJoinedCommunities
    getMyJoinedCommunities() {
        return this.asyncWrapper(async (req) => {
            const { user } = req;
            const result = await this.service.getmy_joined_community(user._id);
            return {
                data: result,
            };
        })
    }

    // add memeber
    addMember() {
        return this.asyncWrapper(async (req) => {
            const { community, newMemberID, role } = req.body;
            const { user } = req;
            const result = await this.service.add_member(community, newMemberID, role, user._id);
            return {
                data: result,
            };
        })
    }

    removeMember() {
        return this.asyncWrapper(async (req) => {
            const { id } = req.params;
            const result = await this.service.remove_member(id);
          return {
            data: {},
          };
        })
    }
}

module.exports = new CommunityController();