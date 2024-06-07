const router = require('express').Router();
const RoleController = require('./RoleController');

router.post('/create', RoleController.createRole());
router.get('/getAll', RoleController.getAllRoles());
module.exports = router;