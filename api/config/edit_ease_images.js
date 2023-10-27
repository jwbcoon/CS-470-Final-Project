const Authorize = require('../Middleware/Authorize.js');
const VerifyJWT = require('../Middleware/VerifyJWT.js');


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
loginRouter.get('/:user_id', LoginController.authorizeUser, (err) => console.log("draught_services_accounts.js: login-route error:", err));

// Accounts router configuration.

const ImagesController = require('../controllers/imagesController.js');
const imagesRouter = require('koa-router')({
    prefix: '/images'
});


imagesRouter.use(VerifyJWT);
imagesRouter.get('/all-allImages', Authorize('admin'), ImagesController.allImages,
    err => console.log(`allAccounts ran into an error: ${err}`));
imagesRouter.get('/:userName/', Authorize('admin'), ImagesController.imagesWithUserName,
    err => console.log(`imagesWithUserName ran into an error: ${err}`));


/**
 * Register all of the controllers into the default controller.
 */
router.use(
    '',
    loginRouter.routes(),
    imagesRouter.routes()
);

module.exports = function (app) {
    app.use(router.routes());
    app.use(router.allowedMethods());
};
