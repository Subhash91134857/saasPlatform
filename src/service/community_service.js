const CommunityModel = require('../model/communityModel');
const UserModel = require('../model/userModel');
const MemberModel = require('../model/memberModel');
const RoleModel = require('../model/roleModel');
const { generateSlug } = require('../utils/slugGenerator');
const AppError = require('../utils/app-error')

class CommunityService {
    constructor() {
        this.Cmodel = CommunityModel;
        this.Umodel = UserModel;
        this.Mmodel = MemberModel;
        this.Rmodel = RoleModel;
    }
    // create Community
    async create_community(name, userId) {
        const slug = generateSlug(name);
        const community = await this.Cmodel.create({ name: name, slug: slug, owner: userId })
        const adminRole = await this.Rmodel.findOne({ name: "Community Admin" })
        const member = await this.Mmodel.create({
            community: community.id,
            user: userId,
            role: adminRole.id
        })
        return {
            community
        }
    }
    // getAll
    async getall_communities() {
        return await this.Cmodel.find();
    }

    // getAllMembers
    async getall_members(communityId) {
        const members = await this.Mmodel.find({ community: communityId }).populate('role');
        return {
            members
        }
    }

    // getMyOwnedCommunity
    async getmy_owned_community(userId) {
        return await this.Cmodel.find({ owner: userId })
    }
    // getmyjoined communities
    async getmy_joined_community(userId) {
        const membership = await this.Mmodel.find({ user: userId }).populate('community');
        const joinedCommunities = membership.map(membership => membership.community);
        return {
            joinedCommunities
        }
    }

    // addmember
    async add_member(communityId, newUserId, roleId, userId) {
        // checking if the user making the request is admin
        const requestedMember = await this.Mmodel.findOne({ community: communityId, user: userId }).populate('role');
        if (!requestedMember || requestedMember.role.name !== 'Community Admin' && requestedMember.role.name !== 'Community Moderator') {
            throw new AppError("Not Allowed Access", 404, true, "NOT_ALLOWED_ACCESS");
        }
        const member = await this.Mmodel.create(
            {
                community: communityId,
                user: newUserId,
                role: roleId
            }
        )
        return {
            member
        }
    }

    // remove member
    async remove_member(communityId, memberId) {
        return await this.Mmodel.deleteOne({
            community: communityId,
            _id: memberId
        })

    }


}

module.exports = new CommunityService();