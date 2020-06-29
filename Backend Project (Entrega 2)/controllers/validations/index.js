const JoiBase = require('@hapi/joi');
const JoiDate = require('@hapi/joi-date');
const Joi = JoiBase.extend(JoiDate);

const { generateError } = require('../../helpers');

// Basic Schemas
const searchSchema = Joi.string()
  .min(2)
  .required()
  .error(
    generateError(
      'The search field needs to be longer than 2 characters.',
      400
    )
  );

const emailSchema = Joi.string()
  .email()
  .required()
  .error(generateError('The email field is not properly filled.', 400));

const passwordSchema = Joi.string()
  .min(6)
  .max(100)
  .required()
  .error(
    generateError('The password has to be longer than 6 characters and shorter than 100.', 400)
  );

const varcharSchema = Joi.string()
  .min(3)
  .max(100)
  .required()
  .error(
    generateError('The field has to be longer than 3 characters and shorter than 100.', 400)
  );

// Object Schemas
const entrySchema = Joi.object().keys({
  language: varcharSchema,
  meeting_date: Joi.date().required(),
  title: varcharSchema,
  online_meeting: Joi.number().min(0).max(1).required()
    .error(
      generateError(
        'The online_meeting field has to be 0 or 1',
        400
      )),
  adress: varcharSchema,
  city: varcharSchema,
  province: varcharSchema,
  country: varcharSchema,
  min_users: Joi.number().min(2).max(10).required()
    .error(
      generateError(
        'The min_users field has to be between 2 and 10.',
        400
      )),
  max_users: Joi.number().min(2).max(10).required()
    .error(
      generateError(
        'The max_users field has to be between 2 and 10.',
        400
      )),
  sex: Joi.string().valid('Male', 'Female', 'Unrestricted').error(
      generateError(
        'sex field only can handle this values: Male, Female, Unrestricted',
        400)),
  commentary: Joi.string()
    .max(1000)
    .required()
    .error(
      generateError(
        'Commentary field is required and cnat be longer than 1000 characters.',
        400
      )
    ),
  duration_minutes: Joi.number().min(15).max(300).required()
    .error(
      generateError(
        'duration_minutes is required and has to be between 15 and 300',
        400
      )),
  lang_level: Joi.string().valid('beginner', 'intermediate', 'senior', 'expert').required()
      .error(
        generateError(
          'lang_level field only can handle this values: beginner, intermediate, senior o expert',
          400
        ))
});

const joinEntrySchema = Joi.object().keys({
  message: varcharSchema
});

const allowJoinSchema = Joi.object().keys({
  id_user_join: Joi.number()
});
const voteSchema = Joi.object().keys({
  vote: Joi.number()
    .min(1)
    .max(5)
    .integer()
    .required()
    .error(
      generateError(
        'The vote field must exist and it has to be between 1 and 5',
        400
      )
    ),
  commentary: varcharSchema
});

const userSchema = Joi.object().keys({
  main_language: varcharSchema,
  first_name: varcharSchema,
  second_name: varcharSchema,
  birth_date: Joi.date().required(),
  adress: varcharSchema,
  province: varcharSchema,
  city: varcharSchema,
  country: varcharSchema,
  sex: varcharSchema,
  tel: varcharSchema,
  user_status: varcharSchema,
  interests: varcharSchema,
  email: emailSchema,
  user_password: passwordSchema,
  admin_code: Joi.string().max(20).allow(null)
});

const userLoginSchema = Joi.object().keys({
  email: emailSchema,
  user_password: passwordSchema
});

const editUserSchema = Joi.object().keys({
  email: emailSchema,
  first_name: varcharSchema,
  second_name: varcharSchema,
  birth_date: Joi.date().required(),
  adress: varcharSchema,
  province: varcharSchema,
  city: varcharSchema,
  country: varcharSchema,
  sex: varcharSchema,
  tel: varcharSchema,
  user_status: varcharSchema,
  interests: varcharSchema
});

const editPasswordUserSchema = Joi.object().keys({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
  newPasswordRepeat: Joi.any()
    .valid(Joi.ref('newPassword'))
    .error(generateError('newPassword and newPasswordRepeat must be the same', 400))
});

module.exports = {
  entrySchema,
  joinEntrySchema,
  allowJoinSchema,
  voteSchema,
  searchSchema,
  userSchema,
  userLoginSchema,
  editUserSchema,
  editPasswordUserSchema
};
