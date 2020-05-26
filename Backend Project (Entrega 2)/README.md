# Backend de mi proyecto // My project's Backend

En este repositorio encontrareis el backend de mi proyecto de Hack a Boss de una app para practicar idiomas donde la gente puede quedar para hablar.
----------------------------------------------------------------------------------------------------------------------------------------------------
In this repository you can find my Hack a Boss project's backend about an app where you can meet people to learn languages by making social meetings.

## Funcionamiento backend

1-Cubre el .env.example adecuadamente y guardalo como .env
2-Utiliza "node initDB.js" en el terminal para crear la estructura y la data inicial de la base de datos.
3-Espera hasta que se llene la base de datos con la Random Data (Random Data: 500 users, 135 languages, 300 meetings, 500 user-languages inserts, 500 language-meetings inserts, 500 user-meetings inputs and 500 ratings).
4-A juguetear!
----------------------------------------------------------------------------------------------------------------------------------------------------
1-Fill the .env.example file properly and save it as .env
2-Use "node initDB.js" in the terminal to create the database's structure and initial data.
3-Wait while node.js writes all the Random Data (Random Data: 500 users, 135 languages, 300 meetings, 500 user-languages inserts, 500 language-meetings inserts, 500 user-meetings inputs and 500 ratings).
4-Enjoy!

### User Routes

- /users - POST - Crea un nuevo usuario
- /users/login - POST - Logea en tu user con un JSON con estos keys: email, user_password
- /users/validate - GET - Valida tu email (siguiendo el enlace recibido en tu mail)
- /users/:id/password - POST - Cambia la contraseña
- /users/:id - GET - Lee el perfil de un usuario
- /users/:id - PUT - Edita tu perfil
- /users/:id - DELETE - "Borra" (esconde) un perdil de usuario (sólo si eres admin o si eres el propio usuario)

---------------------------------------------------------------------------------------------------------------

- /users - POST - Create a new user
- /users/login - POST - Login in your user with a json with this keys: email, user_password
- /users/validate - GET - Validate your email (by clicking the link received in your mail)
- /users/:id/password - POST - Changes password
- /users/:id - GET - Gets info about an user
- /users/:id - PUT - Edits your user
- /users/:id - DELETE - "Deletes" (hides) an user (only if you are this user or an admin)

### Diary Routes

- /entries - GET - Busca y muestra las charlas
- /entries/:id - GET - Muestra la charla con ese id
- /entries - POST - Crea una nueva charla
- /entries/join/:id - POST - Envía petición para participar en una charla
- /entries/join/:id - PUT - El host acepta la petición para entrar en su charla
- /entries/:id/votes - GET - Muestra la votacion media de una charla
- /entries/:id/votes - POST - Vota una charla
- /entries/:id - PUT - Edita una charla
- /entries/:id - DELETE - "Borra" (esconde) una charla (sólo puede hacerlo el host de la charla o un admin)

---------------------------------------------------------------------------------------------------------------

- /entries - GET - Searchs and list meetings
- /entries/:id - GET - Gets one meeting
- /entries - POST - Creates a new meeting
- /entries/join/:id - POST - A user joins a meeting (only if they didnt created it)
- /entries/join/:id - PUT - The host allows users to join his meeting
- /entries/:id/votes - GET - Get rating of a meeting
- /entries/:id/votes - POST - Vote a meeting (Only if you joinned it)
- /entries/:id - PUT - Edit meeting (Only host_user or admin)
- /entries/:id - DELETE - "Deletes" (hide) a meeting (only user that created the post or an admin)