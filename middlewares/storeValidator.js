const { validationResult, body } = require('express-validator');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
        errors: extractedErrors,
    });
};

const storeValidationRules = () => {
    return [
        // Name Validation
        body('name')
            .notEmpty()
            .withMessage("FIRSTNAME_REQUIRED")
            .isLength({ min: 2 })
            .withMessage('NAME_MUST_3_CHARACTERS_MIN'),
        // Email Validation
        body('email')
            .notEmpty()
            .withMessage("EMAIL_REQUIRED")
            .isEmail()
            .withMessage("WRONG_EMAIL_FORMAT"),
        body('phoneNumber')
            .notEmpty()
            .withMessage("PHONE_REQUIRED")
            .isMobilePhone()
            .withMessage("WRONG_PHONE_FORMAT"),

    ];
};
module.exports = {
    storeValidationRules,
    validate,
};