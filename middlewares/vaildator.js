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



module.exports = {
    loginValidationRules,
    validate,
}