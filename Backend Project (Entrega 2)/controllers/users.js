require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { getConnection } = require('../db');

const {
  userSchema,
  userLoginSchema,
  editUserSchema,
  editPasswordUserSchema
} = require('./validations');

const {
  processAndSavePhoto,
  deletePhoto,
  randomString,
  sendEmail,
  generateError
} = require('../helpers');

// POST - /user
async function newUser(req, res, next) {
  let connection;
  try {
    // Validate body payload
    await userSchema.validateAsync(req.body);

    connection = await getConnection();
    const { main_language, first_name, second_name, user_password, birth_date, adress, city, province, country, sex, tel, email, user_status, interests, admin_code } = req.body;
    // Check if user email is already in the db
    const [
      existing
    ] = await connection.query('SELECT id from users where email=?', [email]);

    if (existing.length) {
      throw generateError('This email already exists', 409);
    }

    // hash password
    const dbPassword = await bcrypt.hash(user_password, 10);
    const registrationCode = randomString(40);

    const validationURL = `${process.env.PUBLIC_HOST}/users/validate?code=${registrationCode}`;

    let role = 'user';

    if (admin_code === process.env.ADMIN_INVITATION_CODE) {
      role = 'admin';
    }

    try {
      await sendEmail({
        email: email,
        title: 'Valida tu cuenta de usuario en la app de diario mysql',
        content: `Para validar tu cuenta de usuario pega esta url en tu navegador: ${validationURL}`
      });
    } catch (error) {
      console.error(error.response.body);
      throw new Error(
        'Error sending the confirmation email. Try again later.'
      );
    }

    const [result] = await connection.query(
      `
      INSERT INTO users (first_name, second_name, user_password, birth_date, adress, city, province, country, sex, tel, email, user_status, interests, registrationCode, active, creation_date, lastPasswordUpdate, role)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)
    `,
      [first_name, second_name, dbPassword, birth_date, adress, city, province, country, sex, tel, email, user_status, interests, registrationCode, 0, role]
    );
    
    const [lang_id] = await connection.query(
      'SELECT id from languages where lang_name=?', [main_language]);

    await connection.query(
      'INSERT INTO users_languages(id_languages, id_users) VALUES(?, ?)',
      [lang_id[0].id, result.insertId]);

    console.log(result);


    res.send({
      staus: 'ok',
      message:
        'User registered! Check your email to validate your account (check spam inbox too)'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

async function validateUser(req, res, next) {
  let connection;

  try {
    const { code } = req.query;

    connection = await getConnection();

    // Actualizamos el usuario
    const [
      result
    ] = await connection.query(
      'UPDATE users SET active=1,registrationCode=NULL WHERE registrationCode=?',
      [code]
    );

    if (result.affectedRows === 0) {
      throw generateError('Incorrect validation', 400);
    }

    // // Si queremos dar el token descomentar las siguientes líneas
    // const [user] = await connection.query('SELECT role from users where id=?', [
    //   id
    // ]);

    // // Build jsonwebtoken
    // const tokenPayload = { id: id, role: user[0].role };
    // const token = jwt.sign(tokenPayload, process.env.SECRET, {
    //   expiresIn: '30d'
    // });

    res.send({
      status: 'ok',
      message: 'Validated user. You can login now'
      // data: {
      //   token
      // }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// GET - /users/:id
async function getUser(req, res, next) {
  let connection;

  try {
    const { id } = req.params;
    connection = await getConnection();

    const [result] = await connection.query(
      `
      SELECT id, creation_date, email, role, first_name, user_img 
      FROM users WHERE id=?  
    `,
      [id]
    );
    const [userData] = result;
    
    //Gets user language

    const [lang] = await connection.query(
      'SELECT id_languages from users_languages where id_users=?', [id]);

    const [main_lang] = await connection.query(
      'SELECT lang_name from languages where id=?', [lang[0].id_languages]);

    
    // Throw 404 if no results
    if (!result.length) {
      throw generateError(`There is no user with the id ${id}`, 404);
    }


    const payload = {
      creation_date: userData.creation_date,
      first_name: userData.first_name,
      user_img: userData.user_img,
      main_language: main_lang[0].lang_name
    };
    if (userData.id === req.auth.id || req.auth.role === 'admin') {
      payload.email = userData.email;
      payload.role = userData.role;
    }
    
    res.send({
      status: 'ok',
      data: payload
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// POST - /users/login
async function loginUser(req, res, next) {
  let connection;

  try {
    await userLoginSchema.validateAsync(req.body);

    const { email, user_password } = req.body;

    connection = await getConnection();

    // Find the user in the db by email
    const [
      dbUser
    ] = await connection.query(
      'SELECT id, email, user_password, role from users where email=? AND active=1',
      [email]
    );

    if (!dbUser.length) {
      throw generateError(
        'There is no user existing with this email. If you already registered, check your email (and spam inbox) to validate your account',
        404
      );
    }

    const [user] = dbUser;
    console.log(user);
    const passwordsMath = await bcrypt.compare(user_password, user.user_password);

    if (!passwordsMath) {
      throw generateError('Incorrect password', 401);
    }

    // Build jsonwebtoken
    const tokenPayload = { id: user.id, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.SECRET, {
      expiresIn: '30d'
    });

    // Create response
    res.send({
      status: 'ok',
      message: 'Login correcto',
      data: { token }
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// PUT - /users/:id
async function editUser(req, res, next) {
  let connection;

  try {
    await editUserSchema.validateAsync(req.body);

    const { id } = req.params;
    const { first_name, second_name, email } = req.body;

    connection = await getConnection();

    // Check if user exists

    const [current] = await connection.query(
      `
      SELECT id, user_img FROM users WHERE id=?
    `,
      [id]
    );

    if (!current.length) {
      throw generateError(`The user with id ${id} does not exist`, 404);
    }

    // Check if auth user is the same as :id or is admin
    if (current[0].id !== req.auth.id && req.auth.role !== 'admin') {
      throw generateError('You are not allowed to edit this user', 401);
    }

    // Check if there is a uploaded user_img and process it

    let savedFileName;
    if (req.files && req.files.user_img) {
      try {
        savedFileName = await processAndSavePhoto(req.files.user_img);

        if (current && current[0] && current[0].user_img) {
          await deletePhoto(current[0].user_img);
        }

      } catch (error) {
        throw generateError('Can not process upload image. Try again.', 400);
      }
    } else {
      savedFileName = current.user_img;
    }

    // Update user

    await connection.query(
      `
      UPDATE users SET first_name=?, second_name=?, email=?, user_img=? WHERE id=?
    `,
      [first_name, second_name, email, savedFileName, id]
    );

    res.send({ status: 'ok', message: 'Usuario actualizado' });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// POST - /users/:id/password
async function updatePasswordUser(req, res, next) {
  let connection;

  try {
    const { id } = req.params;
    // body: oldpassword, newPassword, newPasswordRepeat (opcional)
    connection = await getConnection();

    await editPasswordUserSchema.validateAsync(req.body);

    const { oldPassword, newPassword } = req.body;

    // Comprobar que el usuario del token es el mismo que el que vamos a cambiar la pass

    if (Number(id) !== req.auth.id) {
      throw generateError(
        `You are not allowed to change the password of the user with id: ${id}`,
        401
      );
    }

    if (oldPassword === newPassword) {
      throw generateError(
        'The new password can not be the same as the older one',
        400
      );
    }

    // Sacar la info del usuario de la base de datos
    const [currentUser] = await connection.query(
      `
      SELECT id, user_password from users where id=?
      `,
      [id]
    );

    // Código un poco redundante
    if (!currentUser.length) {
      throw generateError(`The user with id ${id} does not exist`, 404);
    }

    const [dbUser] = currentUser;

    // Comprobar que la vieja password envíada sea la correcta
    // el orden es: password sin encriptar, password encriptada
    const passwordsMath = await bcrypt.compare(oldPassword, dbUser.user_password);

    if (!passwordsMath) {
      throw generateError('Your old password is incorrect', 401);
    }

    // generar hash de la password
    const dbNewPassword = await bcrypt.hash(newPassword, 10);

    // actualizar la base de datos
    await connection.query(
      `
      UPDATE users SET user_password=?, lastPasswordUpdate=NOW() WHERE id=?
    `,
      [dbNewPassword, id]
    );

    res.send({  
      status: 'ok',
      message:
        'Password changed. Old tokens will not work, login to get your new token.'
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

// DELETE - /users/:id
async function deleteUser(req, res, next) {
  try {
    const connection = await getConnection();

    const { id } = req.params;

    if (req.auth.role !== 'admin' && req.auth.id !== parseInt(id)) {
      const error = new Error(`You must be an admin or the same user as the profile you try to delete`);
      error.httpCode = 500;
      throw error;
    }

    await connection.query('UPDATE users SET hidden=1 WHERE id=?', [req.auth.id]);

    connection.release();

    res.send({
      status: 'ok',
      message: `The user with id ${id} has been deleted`
    });
  } catch (error) {
    next(error);
  }
}


module.exports = {
  newUser,
  loginUser,
  getUser,
  editUser,
  updatePasswordUser,
  validateUser,
  deleteUser
};
