const Joi = require('@hapi/joi');

const validateSignUp = (data) => {

  const schema = Joi.object({
    email: Joi.string()
      .email()
      .empty()
      .messages({
        "string.email": "Must be a valid email address",
        "string.empty": "Email is not allowed to be empty",
      }),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
      .rule({
        message: 'Password must be a minimum eight characters, at least one letter, one number and one special character'
      }),
    repeatpassword: Joi.ref('password')
  })

  return schema.validate(data);

}

const validationLogin = (data) => {

  const schema = Joi.object({
    email: Joi.string()
      .email()
      .empty()
      .messages({
        "string.email": "Must be a valid email address",
        "string.empty": "Email is not allowed to be empty",
      }),
    password: Joi.string()
      .empty()
      .messages({
        "string.empty": "Password cannot be empty"
      })
  })

  return schema.validate(data);

}


const validateCreatePost = (data) => {

  const schema = Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "Post Title cannot be empty"
    }),
    postbody: Joi.string().required().messages({
      "string.empty": "Post Body cannot be empty"
    }),
    author: Joi.string().required().messages({
      "string.empty": "Author cannot be empty"
    }),
  })

  return schema.validate(data);

}

const validateUserSettings = (data) => {

  const schema = Joi.object({
    firstname: Joi.string().required().messages({
      "string.empty": "Please enter a firstname"
    }),
    surname: Joi.string().required().messages({
      "string.empty": "Please enter a secondname"
    }),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
      .rule({
        message: 'Password must be a minimum eight characters, at least one letter, one number and one special character'
      })
  })

  return schema.validate(data)
}

const validateNewPassword = (data) => {

  const schema = Joi.object({
    newpassword: Joi.string()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
      .rule({
        message: 'Password must be a minimum eight characters, at least one letter, one number and one special character'
      }),
    newrepeatpassword: Joi.string()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"))
      .rule({
        message: 'Password must be a minimum eight characters, at least one letter, one number and one special character'
      })
  })

  return schema.validate(data);
}


module.exports.validateSignUp = validateSignUp;
module.exports.validationLogin = validationLogin;
module.exports.validateCreatePost = validateCreatePost;
module.exports.validateUserSettings = validateUserSettings;
module.exports.validateNewPassword = validateNewPassword;