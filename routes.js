var express = require('express');

var router = express.Router();
var authController = require('./AuthController');

var docusign = require('./docusign');

router.get('/auth/register', authController.register);
router.get('/auth/login', authController.login);
router.get('/auth/validate', authController.validate_token);
router.get('/auth/getData', authController.get_user_data);
router.get('/auth/checkJWTToken', authController.check_jwt_token);

router.get('/docusign', docusign.test);
router.get('/docusignreturn', docusign.reutrnurl);

module.exports = router;


