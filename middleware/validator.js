// this blog post was very helpfull and https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go

const { body, validationResult } = require('express-validator')

const courseValidationRules = () => {
  return [
    // Course title must be at least 5 chars long
    body('title').isLength({ min: 5 }).withMessage('title must be at least 5 chars long'),
    // Course description must be at least 5 chars long
    body('description').isLength({ min: 5 }).withMessage('description must be at least 5 chars long'),
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(400).json({
    errors: extractedErrors,
  })
}

module.exports = {
  courseValidationRules,
  validate,
}
