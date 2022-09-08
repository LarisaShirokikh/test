import {Router} from "express";
import {inputValidationMiddleWare} from "../middlewares/input-validation";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/validations";
import {checkLimitsIPAttemptsMiddleware} from "../middlewares/checkLimitsIpAttemptsMiddleware";
import {authBearer} from "../middlewares/auth-middleware";
import {container} from "../composition-root";
import {AuthController} from "../controllers/auth-controller";



const authController = container.resolve<AuthController>(AuthController)


export const authRouter = Router({})

authRouter.post('/registration-confirmation',
    checkLimitsIPAttemptsMiddleware, authController.userRegConfirmation.bind(authController))

authRouter.post('/registration',
    loginValidation, emailValidation, passwordValidation, inputValidationMiddleWare,
    checkLimitsIPAttemptsMiddleware, authController.userRegistration.bind(authController))

authRouter.post('/registration-email-resending',
    emailValidation, inputValidationMiddleWare, checkLimitsIPAttemptsMiddleware,
   authController.resendingEmailConfirm.bind(authController))

authRouter.post('/login', loginValidation, passwordValidation,
    inputValidationMiddleWare,
    checkLimitsIPAttemptsMiddleware,
   authController.createJWTPair.bind(authController))

authRouter.post('/refresh-token', authController.sendRefreshToken.bind(authController))

authRouter.post('/logout',
    authController.userLogout.bind(authController))


authRouter.get('/me', authBearer, authController.aboutMe.bind(authController))




