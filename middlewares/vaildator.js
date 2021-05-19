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
            .isEmail()
            .notEmpty()
            .withMessage("EMAIL_REQUIRED"),
        // Password Validation must be at least 8 chars long
        body('password')
            .notEmpty()
            .withMessage('PASSWORD_REQUIRED')
            .isStrongPassword({
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1
            }),
    ]
}



module.exports = {
    loginValidationRules,
    validate,
}