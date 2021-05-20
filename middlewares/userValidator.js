const { validationResult, body } = require('express-validator')

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

const loginValidationRules = () => {
    return [
        // Email Validation
        body('email')
            .notEmpty()
            .withMessage("EMAIL_REQUIRED")
            .isEmail()
            .withMessage("WRONG_EMAIL_FORMAT"),

        // Password Validation must be at least 8 chars long
        body('password')
            .notEmpty()
            .withMessage('PASSWORD_REQUIRED')
            .isLength({ min: 8 })
            .withMessage('PASSWORD_MUST_8_CHARACTERS_LONG'),

    ]
}
const resetValidationRules = () => {
    return [
        // Email Validation
        body('email')
            .notEmpty()
            .withMessage("EMAIL_REQUIRED")
            .isEmail()
            .withMessage("WRONG_EMAIL_FORMAT"),

    ]
}
const recoverValidationRules = () => {
    return [
        // Email Validation
        body('password')
            .notEmpty()
            .withMessage('PASSWORD_REQUIRED')
            .isLength({ min: 8 })
            .withMessage('PASSWORD_MUST_8_CHARACTERS_LONG'),

    ]
}
const registerValidationRules = () => {
    return [
        // Email Validation
        body('email')
            .notEmpty()
            .withMessage("EMAIL_REQUIRED")
            .isEmail()
            .withMessage("WRONG_EMAIL_FORMAT"),
        // firstName Validation
        body('firstName')
            .notEmpty()
            .withMessage("FIRSTNAME_REQUIRED")
            .isLength({ min: 3, max: 30 })
            .withMessage('FIRSTNAME_MUST_3_CHARACTERS_MIN_30_CHARACTERS_MAX'),
        // lastname Validation
        body('lastName')
            .notEmpty()
            .withMessage("LASTNAME_REQUIRED")
            .isLength({ min: 3, max: 30 })
            .withMessage('LASTNAME_MUST_3_CHARACTERS_MIN_30_CHARACTERS_MAX'),
        // role Validation
        body('role')
            .notEmpty()
            .withMessage("USER_ROLE_REQUIRED"),

        // Password Validation must be at least 8 chars long
        body('password')
            .notEmpty()
            .withMessage('PASSWORD_REQUIRED')
            .isLength({ min: 8 })
            .withMessage('PASSWORD_MUST_8_CHARACTERS_LONG'),

    ]
}



module.exports = {
    loginValidationRules,
    registerValidationRules,
    resetValidationRules,
    recoverValidationRules,
    validate,
}