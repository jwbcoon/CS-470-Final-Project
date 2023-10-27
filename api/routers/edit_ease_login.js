const Authorize = require('../middleware/Authorize.js');
const VerifyJWT = require('../middleware/VerifyJWT.js');


/*
|--------------------------------------------------------------------------
| Default router
|--------------------------------------------------------------------------
|
| Default router is used to define any routes that don't belong to a
| controller. Also used as a parent container for the other routers.
|
*/
const router = require('koa-router')({
    prefix: '/api/v1'
});

router.get('/', function (ctx) {
    console.log('router.get(/)');
    return ctx.body = 'What is up?';
});

/*
|--------------------------------------------------------------------------
| login router
|--------------------------------------------------------------------------
|
| Description
|
*/

// Login router configuration.

const LoginController = require('../controllers/loginController');

const loginRouter = require('koa-router')({
    prefix: '/login'
});
loginRouter.get('/:username', LoginController.authorizeUser,
    (err) => console.log("edit_ease_login.js: login-route error:", err));
loginRouter.use(VerifyJWT);

loginRouter.get('/:username', Authorize('admin'), LoginController.usersWithUsername,
    err => console.log(`usersWithUsername ran into an error: ${err}`));

/**
 * Register all of the controllers into the default controller.
 */
router.use(
    '',
    loginRouter.routes(),
);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
