const router = require('express').Router();
const authMiddleware = require('../../middleware/authMiddleware');
const roleMiddleware = require('../../middleware/roleMiddleware')
const CommunityController = require('./CommunityController');




router.post('/', authMiddleware, CommunityController.createCommunity());
router.get('/', authMiddleware, CommunityController.getAllCommunities());

router.get('/:id/members', authMiddleware, roleMiddleware(['member-get']), CommunityController.getAllMembers());
router.get('/me/owner', authMiddleware, CommunityController.getMyOwnedCommunities());
router.get('/me/member', authMiddleware, CommunityController.getMyJoinedCommunities());

router.put('/', authMiddleware, roleMiddleware(['member-add']), CommunityController.addMember())
router.delete('/:id', authMiddleware, roleMiddleware["member-remove"], CommunityController.removeMember());
module.exports = router;