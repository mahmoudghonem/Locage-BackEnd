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

const addValidationRules = () => {
    return [
        // title validation
        body('title')
        .notEmpty()
        .withMessage('TITLE_REQUIRED')
        .isLength({ min: 3 })
        .withMessage('MINIMUM_3_CHARACTERS_TITLE')
        .isLength({ max: 150 })
        .withMessage('MAX_150_CHARACTERS_TITLE'),

        // description validation
        body('description')
        .notEmpty()
        .withMessage('DESCRIPTION_REQUIRED')
        .isLength({ min: 50 })
        .withMessage('MINIMUM_50_CHARACTERS_TITLE')
        .isLength({ max: 500 })
        .withMessage('MAX_500_CHARACTERS_TITLE'),

        // price validation
        body('price')
        .notEmpty()
        .withMessage('PRICE_REQUIRED')
        .isNumeric()
        .withMessage('INVAILD_PRICE_VALUE'),

        // quantity validation
        body('quantity')
        .notEmpty()
        .withMessage('QUANTITY_REQUIRED')
        .isNumeric()
        .withMessage('INVAILD_QUANTITY_VALUE'),
    ]

}

module.exports = {
    addValidationRules,
    validate,
};