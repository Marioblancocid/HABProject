const { getConnection } = require('../db');

const {
  formatDateToDB,
  processAndSavePhoto,
  deletePhoto,
  emailToHost,
  emailToUser
} = require('../helpers');

const { entrySchema, joinEntrySchema, allowJoinSchema, voteSchema, searchSchema } = require('./validations');

// GET - /entries
async function listEntries(req, res, next) {
  try {
    const connection = await getConnection();
    const { search, filter } = req.query;

    let result;

    
    if (search) {
      await searchSchema.validateAsync(search);
      if (filter === 'lang') {

        result = await connection.query(
          `SELECT d.*, 
        (SELECT AVG(stars) FROM ratings WHERE id_meetings=d.id) AS voteAverage,
        r.lang_name
        FROM meetings d
        left join languages_meetings l
        on d.id = l.id_meetings
        left join languages r
        on l.id_languages = r.id
        WHERE d.hidden=false AND r.lang_name LIKE ? AND d.meeting_date>CURDATE() 
        ORDER BY d.meeting_date ASC
        LIMIT 8`,
          [`%${search}%`]
        );
      } else if (filter === 'city') {
        result = await connection.query(
          `SELECT d.*, 
        (SELECT AVG(stars) FROM ratings WHERE id_meetings=d.id) AS voteAverage,
        r.lang_name
        FROM meetings d
        left join languages_meetings l
        on d.id = l.id_meetings
        left join languages r
        on l.id_languages = r.id
        WHERE d.hidden=false AND d.city LIKE ? AND d.meeting_date>CURDATE()
        OR d.hidden=false AND d.country LIKE ? AND d.meeting_date>CURDATE()
        OR d.hidden=false AND d.adress LIKE ? AND d.meeting_date>CURDATE() 
        OR d.hidden=false AND d.province LIKE ? AND d.meeting_date>CURDATE() 
        ORDER BY d.meeting_date ASC
        LIMIT 8`,
          [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
        );
      } else if (filter === 'level') {
        result = await connection.query(
          `SELECT d.*, 
        (SELECT AVG(stars) FROM ratings WHERE id_meetings=d.id) AS voteAverage,
        r.lang_name
        FROM meetings d
        left join languages_meetings l
        on d.id = l.id_meetings
        left join languages r
        on l.id_languages = r.id
        WHERE d.hidden=false AND d.lang_level LIKE ? AND d.meeting_date>CURDATE()
        ORDER BY d.meeting_date ASC
        LIMIT 8`,
          [`%${search}%`]
        );
      } else if (filter === 'age') {
        
        var d = new Date();
        const date = d.getFullYear() - parseInt(search, 10);
        const min_date = date + '/01/01';
        const max_date = (date + 10) + '/01/01';

        result = await connection.query(
          `SELECT d.*, 
        (SELECT AVG(stars) FROM ratings WHERE id_meetings=d.id) AS voteAverage,
        r.lang_name
        FROM meetings d
        left join users u
        on d.id_user_host = u.id
        left join languages_meetings l
        on d.id = l.id_meetings
        left join languages r
        on l.id_languages = r.id
        WHERE d.hidden=false AND u.birth_date between ? and ?  AND d.meeting_date>CURDATE() 
        ORDER BY d.meeting_date ASC
        LIMIT 8`, [min_date, max_date]
        );
      } else if (filter === 'interests') {
        result = await connection.query(
          `SELECT d.*, 
        (SELECT AVG(stars) FROM ratings WHERE id_meetings=d.id) AS voteAverage,
        r.lang_name
        FROM meetings d
        left join users u
        on d.id_user_host = u.id
        left join languages_meetings l
        on d.id = l.id_meetings
        left join languages r
        on l.id_languages = r.id
        WHERE d.hidden=false AND u.interests LIKE ? AND d.meeting_date>CURDATE() 
        ORDER BY d.meeting_date ASC
        LIMIT 8`,
          [`%${search}%`]
        );
      } else {

      result = await connection.query(
        `SELECT d.*, 
        (SELECT AVG(stars) FROM ratings WHERE id_meetings=d.id) AS voteAverage,
        r.lang_name
        FROM meetings d
        left join languages_meetings l
        on d.id = l.id_meetings
        left join languages r
        on l.id_languages = r.id
        WHERE d.hidden=false AND d.title LIKE ? AND d.meeting_date>CURDATE() 
        OR d.hidden=false AND d.commentary LIKE ? AND d.meeting_date>CURDATE() 
        OR d.hidden=false AND r.lang_name LIKE ? AND d.meeting_date>CURDATE() 
        OR d.hidden=false AND d.city LIKE ?  AND d.meeting_date>CURDATE()
        OR d.hidden=false AND d.country LIKE ? AND d.meeting_date>CURDATE()
        ORDER BY d.meeting_date ASC
        LIMIT 8`,
        [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
      );
      }
    } else {
      result = await connection.query(
        `SELECT d.*, 
        (SELECT AVG(stars) FROM ratings WHERE id_meetings=d.id) AS voteAverage,
        r.lang_name
        FROM meetings d
        left join languages_meetings l
        on d.id = l.id_meetings
        left join languages r
        on l.id_languages = r.id
        WHERE d.hidden=false AND d.meeting_date>CURDATE()
        ORDER BY d.meeting_date ASC
        LIMIT 8`
      );
    }

    const [entries] = result; 
    connection.release();

    res.send({
      status: 'ok',
      data: entries
    });
  } catch (error) {
    next(error);
  }
}

// POST - /entries
async function newEntry(req, res, next) {
  //Meterlos en la base de datos
  try {
    console.log(req.files, req.photo);
    await entrySchema.validateAsync(req.body);
    
    const { language, meeting_date, title, online_meeting, adress, city, province, country, min_users, max_users, sex, commentary, duration_minutes, lang_level } = req.body;
    

    let savedFileName;

    if (req.files && req.files.photo) {
      try {
        savedFileName = await processAndSavePhoto(req.files.photo);
      } catch (error) {
        const imageError = new Error(
          'Can not process upload image. Try again.'
        );
        imageError.httpCode = 400;
        throw imageError;
      }
    }

    const connection = await getConnection();

    const date = formatDateToDB(new Date());

    const [
      result
    ] = await connection.query(
      'INSERT INTO meetings(image, meeting_date, title, online_meeting, adress, city, province, country, min_users, max_users, sex, commentary, duration_minutes, lang_level, id_user_host, creation_date) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [savedFileName, meeting_date, title, online_meeting, adress, city, province, country, min_users, max_users, sex, commentary, duration_minutes, lang_level, req.auth.id, date]
    );

    const [lang_id] = await connection.query(
      'SELECT id from languages where lang_name=?', [language]);

    await connection.query(
      'INSERT INTO languages_meetings(id_languages, id_meetings) VALUES(?, ?)',
      [lang_id[0].id, result.insertId]);

    connection.release();

    res.send({
      status: 'ok',
      data: {
        id: result.insertId,
        meeting_date: meeting_date, 
        title: title, online_meeting, 
        adress: adress, 
        city: city, 
        province: province, 
        country: country, 
        min_users: min_users, 
        max_users: max_users, 
        sex: sex, 
        commentary: commentary, 
        duration_minutes: duration_minutes,
        lang_level: lang_level,
        id_user_host: req.auth.id,
        creation_date: date,
        image: savedFileName,
        lang_id: lang_id[0].id,
        language: language
      }
    });
  } catch (error) {
    next(error);
  }
}

//GET -- /entries/join/:id
async function getPeopleInAMeeting(req, res, next) {
  try {
  const { id } = req.params;
  const connection = await getConnection();
    const [results] = await connection.query(
  'Select * from users_meetings where id_meetings=? AND user_admitted=1',
  [id]
    ); 
  
  connection.release();

    res.send({
      status: 'ok',
      data: results
    });
  } catch (error) {
    next(error);
  }
}

//GET -- /entries/allJoins/:id
async function getAllPeopleInAMeeting(req, res, next) {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const [results] = await connection.query(
      `Select a.*, b.*
      FROM users_meetings a
      left join users b
      on a.id_users = b.id
      where id_meetings=?`,
      [id]
    );
    `SELECT d.*, 
        (SELECT AVG(stars) FROM ratings WHERE id_meetings=d.id) AS voteAverage,
        r.lang_name
        FROM meetings d
        left join languages_meetings l
        on d.id = l.id_meetings
        left join languages r
        on l.id_languages = r.id
        WHERE d.hidden=false AND d.meeting_date>CURDATE()
        ORDER BY d.meeting_date ASC`
    connection.release();

    res.send({
      status: 'ok',
      data: results
    });
  } catch (error) {
    next(error);
  }
}

//GET -- /entries/myMeetings/:id
async function getMyMeetings(req, res, next) {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const [results] = await connection.query(
      `Select a.*, b.*
      from users_meetings a 
      left join meetings b 
      on a.id_meetings = b.id
      where a.id_users=? and b.hidden=0`,
      [id]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: results
    });
  } catch (error) {
    next(error);
  }
}

//GET -- /entries/myMeetings/:id
async function getMyMeetingsHosted(req, res, next) {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const [results] = await connection.query(
      `Select *
      from meetings 
      where id_user_host=? and hidden=0`,
      [id]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: results
    });
  } catch (error) {
    next(error);
  }
}

// POST -- /entries/join/:id
async function joinEntry(req, res, next) {
  try {
    const connection = await getConnection();

    const { id } = req.params;

    //Checks if the meeting exists
    const [meeting] = await connection.query(
      'Select * from meetings where id=?',
      [id]
    );

    if (!meeting.length) {
      const error = new Error(`The meeting does not exist. Please choose another existing meeting`);
      error.httpCode = 400;
      throw error;
    }

    //Checks if the user is already the host
    const [ host ] = await connection.query(
      'Select * from meetings where id_user_host=? and id=?',
      [req.auth.id, id]
    );

    if (host.length) {
      const error = new Error(`You can't join your own meeting`);
      error.httpCode = 400;
      throw error;
    }

    //Checks if the user already joinned the meeting
    const [join] = await connection.query(
      'Select * from users_meetings where id_users=? and id_meetings=?',
      [req.auth.id, id]
    );

    if (join.length) {
      const error = new Error(`You already joinned the meeting`);
      error.httpCode = 400;
      throw error;
    }

    await joinEntrySchema.validateAsync(req.body);

    const { message } = req.body;

    const [emailHost] = await connection.query(
      `SELECT a.email 
      from users a
      left join meetings b
      on a.id = b.id_user_host
      where b.id=?`,
      [id]
    );
    console.log(emailHost);
    try {
      await emailToHost({
        email: emailHost,
        title: 'Alguien se ha apuntado a tu evento!',
        content: `El usuario te ha enviado este mensaje junto con la peticion: ${message}`
      });
    } catch (error) {
      console.error(error.response.body);
      throw new Error(
        'Error sending the confirmation email. Try again later.'
      );
    }
    

    await connection.query(
      'INSERT INTO users_meetings(id_users, id_meetings, join_message) VALUES(?, ?, ?)',
      [req.auth.id, id, message]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: {
        id_user: req.auth.id,
        id_meeting: id,
        message: message
      }
    });
  } catch (error) {
    next(error);
  }
}

//PUT - /entries/join/:id
async function allowJoin(req, res, next) {
  try {
    const connection = await getConnection();
    const { id } = req.params;
    const { id_user_join } = req.body;
    
    //Checks if the user is the host (if not, throws error)
    const [host] = await connection.query(
      'Select * from meetings where id_user_host=? and id=?',
      [req.auth.id, id]
    );

    if (!host.length) {
      const error = new Error(`You can't allow people if you didn't created the meeting`);
      error.httpCode = 400;
      throw error;
    }

    //Checks if the id_user_join requested to join the meeting
    const [userJoin] = await connection.query(
      'Select * from users_meetings where id_users=? and id_meetings=? and user_admitted=0',
      [id_user_join, id]
    );

    if (!userJoin.length) {
      const error = new Error(`The user didnt asked to join or its already allowed`);
      error.httpCode = 400;
      throw error;
    }

    await allowJoinSchema.validateAsync(req.body);

    const [useremail] = await connection.query(
      'select email from users where id=?',
      [id_user_join]
    );
    try {
      await emailToUser({
        email: useremail,
        title: 'Te han aceptado en el evento!',
        content: `No faltes a la charla, aprenderemos un monton!`
      });
    } catch (error) {
      console.error(error.response.body);
      throw new Error(
        'Error sending the confirmation email. Try again later.'
      );
    }

    await connection.query(
      'UPDATE users_meetings SET user_admitted=1 WHERE id_users=? AND id_meetings=?',
      [id_user_join, id]
    );

    connection.release();

    res.send({
      status: 'ok',
      data: {
        id_user_acepted: id_user_join,
        id_meeting: id
      }
    });
  } catch (error) {
    next(error);
  }
}

// PUT - /entries/:id
async function editEntry(req, res, next) {
  try {
        const {
          language,
          meeting_date,
          title,
          online_meeting,
          adress,
          city,
          province,
          country,
          min_users,
          max_users,
          sex,
          commentary,
          duration_minutes,
          lang_level
        } = req.body;
        const { id } = req.params;

        await entrySchema.validateAsync(req.body);

        const connection = await getConnection();

        const [
          current
        ] = await connection.query(
          'SELECT id_user_host, image FROM meetings WHERE id=?',
          [id]
        );

        if (!current.length) {
          const error = new Error(`The entry with id ${id} does not exist`);
          error.httpCode = 404;
          throw error;
        }
        // Check if the authenticated user is the entry author or admin
        if (
          current[0].id_user_host !== req.auth.id &&
          req.auth.role !== 'admin'
        ) {
          const error = new Error(
            'No tienes permisos para editar esta entrada'
          );
          error.httpCode = 401;
          throw error;
        }

        // CAMBIAR EL LANGUAGE 
        console.log(language, id);

        let [[newIdLang]] = await connection.query('SELECT id FROM languages WHERE lang_name=?', [language]);
        await connection.query('UPDATE languages_meetings SET id_languages=? WHERE id_meetings=?', [newIdLang.id, id]);

        let savedFileName;

        if (req.files && req.files.photo) {
          try {

            savedFileName = await processAndSavePhoto(req.files.photo);

            if (current && current[0] && current[0].image) {
              await deletePhoto(current[0].image);
            }
            
          } catch (error) {
            const imageError = new Error(
              'Can not process upload image. Try again.'
            );
            imageError.httpCode = 400;
            throw imageError;
          }
        } else {
          savedFileName = current.image;
        }
        let last_modification = formatDateToDB(new Date());
        await connection.query('UPDATE meetings SET image=?, meeting_date=?, title=?, online_meeting=?, adress=?, city=?, province=?, country=?, min_users=?, max_users=?, sex=?, commentary=?, duration_minutes=?, lang_level=?, last_modification=? WHERE id=?',
          [savedFileName, meeting_date, 
            title,
        online_meeting,
        adress,
        city,
        province,
        country,
        min_users,
        max_users,
        sex,
        commentary,
        duration_minutes,
        lang_level,
        last_modification,
            id
          ]
        );

        connection.release();

        res.send({
          status: 'ok',
          data: {
            id: id,
            meeting_date: meeting_date,
            title: title,
            online_meeting,
            adress: adress,
            city: city,
            province: province,
            country: country,
            min_users: min_users,
            max_users: max_users,
            sex: sex,
            commentary: commentary,
            duration_minutes: duration_minutes,
            lang_level: lang_level,
            id_user_host: req.auth.id,
            last_modification: last_modification,
            image: savedFileName
          }
        });
      } catch (error) {
    next(error);
  }
}

// GET - /entries/:id
async function getEntry(req, res, next) {
  try {
    const { id } = req.params;

    const connection = await getConnection();

    const [result] = await connection.query(
      `select d.*, z.first_name, z.second_name, r.lang_name, avg(v.stars) as vote
      from meetings d
      left join ratings v
      on d.id = v.id_meetings
      left join languages_meetings l
      on d.id = l.id_meetings
      left join languages r
      on l.id_languages = r.id
      left join users z
      on d.id_user_host = z.id
      WHERE d.hidden=false AND d.id=?
      GROUP BY r.lang_name`,
      [id]
    );

    if (!result[0].id) {
      const error = new Error(`The entry with id ${id} does not exist`);
      error.httpCode = 404;
      throw error;
    }

    connection.release();

    res.send({
      status: 'ok',
      data: result[0]
    });
  } catch (error) {
    next(error);
  }
}

// DELETE - /entries/:id
async function deleteEntry(req, res, next) {
  try {
    const connection = await getConnection();

    const { id } = req.params;

    const [host] = await connection.query('SELECT id_user_host from meetings where id=?', [id]);

    if (req.auth.role !== 'admin' && req.auth.id !== host[0].id_user_host) {
      const error = new Error(`You must be an admin or the user that created the entrie you try to delete`);
      error.httpCode = 500;
      throw error;
    }

    await connection.query('UPDATE meetings SET hidden=1 WHERE id=?', [id]);

    connection.release();

    res.send({
      status: 'ok',
      message: `The entry with id ${id} has been deleted`
    });
  } catch (error) {
    next(error);
  }
}

// POST - /entries/:id/votes
async function voteEntry(req, res, next) {
  try {
    const { id } = req.params;
    // Validate payload
    await voteSchema.validateAsync(req.body);

    const { vote, commentary } = req.body;

    const connection = await getConnection();

    // Check if the entry actually exists
    const [entry] = await connection.query('SELECT id from meetings where id=?', [
      id
    ]);

    if (!entry.length) {
      const error = new Error('The entry with this id does not exist');
      error.httpCode = 404;
      throw error;
    }

    // Check if the user with the current ID already voted for this entry
    const [
      existingVote
    ] = await connection.query(
      'SELECT id from ratings where id_meetings=? AND id_users=?',
      [id, req.auth.id]
    );

    if (existingVote.length) {
      const error = new Error('You already votted with your ID');
      error.httpCode = 403;
      throw error;
    }
/* 
    // Check if the user went to the meeting 
    const [
      userJoin
    ] = await connection.query(
      'SELECT * from users_meetings where id_meetings=? AND id_users=? AND user_admitted=1',
      [id, req.auth.id]
    );

    if (!userJoin.length) {
      const error = new Error('You can not vote a meeting if you didnt join it');
      error.httpCode = 403;
      throw error;
    } */

    //Vote
    await connection.query(
      `
      INSERT INTO ratings(stars, commentary, id_users, id_meetings, creation_date) 
      VALUES(?, ?, ?, ?, ?)`,
      [vote, commentary, req.auth.id, id, formatDateToDB(new Date())]
    );

    connection.release();

    res.send({
      status: 'ok',
      message: `The vote (${vote} points) to the entry with id ${id} was successful`
    });
  } catch (error) {
    next(error);
  }
}

async function getEntryVotes(req, res, next) {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    const [
      votes
    ] = await connection.query(`SELECT d.*, b.*
    from ratings d 
    left join users b
    on d.id = b.id
    WHERE id_meetings=?`, [
      id
    ]);
    connection.release();

    res.send({
      status: 'ok',
      data: votes
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listEntries,
  newEntry,
  joinEntry,
  allowJoin,
  getPeopleInAMeeting,
  getAllPeopleInAMeeting,
  getMyMeetings,
  getMyMeetingsHosted,
  getEntry,
  deleteEntry,
  editEntry,
  voteEntry,
  getEntryVotes
};
