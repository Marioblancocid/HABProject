//IMPORTAMOS AXIOS PARA LAS LLAMADAS A LA BBDD
import axios from 'axios'

//IMPORTAMOS JWT PARA LA GESTION DEL TOKEN
import jwt from 'jwt-decode'

//DECLARACIÓN DE VARIABLES QUE NECESITAREMOS PARA NUESTRAS FUNCIONES
const ENDPOINT = 'http://localhost:3001';
const AUTH_TOKEN_KEY = "authToken";

// FUNCIÓN DE LOGIN
export function loginUser(usuario, password) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios({
        url: `${ENDPOINT}/users/login`, // URL DE LA AUTENTICACIÓN
        method: "POST", // MÉTODO DE LA AUTENTICACIÓN
        data: {
          email: usuario,
          user_password: password
        }, // DATOS DE LA AUTENTICACIÓN
      });
      setAuthToken(res.data.data);
      resolve();
    } catch (err) {
      reject(err);
    }
  })
}
//GET LANGUAGES
export function getLang() {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios({
        url: `${ENDPOINT}/languages`, // URL DE LA AUTENTICACIÓN
        method: "GET", // MÉTODO DE LA AUTENTICACIÓN
      });
      resolve(res.data.data[0]);
    } catch (err) {
      console.log('Error consiguiendo los idiomas: ', err);
      reject(err)
    }
  })
}

//GET EMAIL (CHECKS IF AN EMAIL ALREADY EXISTS)
export function getEmail(mail) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios({
        url: `${ENDPOINT}/email`, // URL DE LA AUTENTICACIÓN
        method: "POST", // MÉTODO DE LA AUTENTICACIÓN
        data: {
          email: mail
        }
      });
      resolve(res.data.emailExists);
    } catch (err) {
      console.log('Error consiguiendo los idiomas: ', err);
      reject(err)
    }
  })
}

//GET USERNAME (GETS AN USERNAME WITH AN INPUT ID)
export function getUserName(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios({
        url: `${ENDPOINT}/userName`, // URL DE LA AUTENTICACIÓN
        method: "GET", // MÉTODO DE LA AUTENTICACIÓN
        data: {
          id: id
        }
      });
      resolve(res.data.emailExists);
    } catch (err) {
      console.log('Error consiguiendo el nombre: ', err);
      reject(err)
    }
  })
}


// FUNCIÓN DE REGISTER
export function registerUser(usuario, user_password, main_language, first_name, second_name, birth_date, adress, city, province, country, sex, tel, user_status, interests, admin_code) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios({
        url: `${ENDPOINT}/users`, // URL DE LA AUTENTICACIÓN
        method: "POST", // MÉTODO DE LA AUTENTICACIÓN
        data: {
          email: usuario,
          user_password: user_password,
          main_language: main_language,
          first_name: first_name,
          second_name: second_name,
          birth_date: birth_date,
          adress: adress,
          city: city,
          province: province,
          country: country,
          sex: sex,
          tel: tel,
          user_status: user_status,
          interests: interests
        }, 
      });
      resolve()
    } catch (err) {
      console.log('Error en Registro: ', err);
      reject(err)
    }
  })
}

// FUNCIÓN DE ADDMEETING
export function addMeeting(photoFormData) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios({
        url: `${ENDPOINT}/entries`, // URL DE LA AUTENTICACIÓN
        method: "POST", // MÉTODO DE LA AUTENTICACIÓN
        data: photoFormData,
        headers: {
          'Content-Type': 'multipart/form-data; boundary=${form._boundary}'
        }
      });
      resolve()
    } catch (err) {
      console.log('Error en Registro: ', err);
      reject(err)
    }
  })
}

// FUNCIÓN DE EDITUSER
export function editUser(photoFormData, id) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios({
        url: `${ENDPOINT}/users/${id}`, // URL DE LA AUTENTICACIÓN
        method: "PUT", // MÉTODO DE LA AUTENTICACIÓN
        data: photoFormData,
        headers: {
          'Content-Type': 'multipart/form-data; boundary=${form._boundary}'
        }
      });
      resolve()
    } catch (err) {
      console.log('Error en Registro: ', err);
      reject(err)
    }
  })
}

// GUARDAR TOKEN EN LOCALSTORAGE
export function setAuthToken(token){
  axios.defaults.headers.common["Authorization"] = token.token;
  localStorage.setItem(AUTH_TOKEN_KEY, token.token);
  localStorage.setItem('id', token.id);
}

// LOGOUT
export function clearLogin(){
  axios.defaults.headers.common["Authorization"] = ``;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem('id');
}

// COGER EL TOKEN
export function getAuthToken(){
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

// CONSIGUIENDO FECHA DE EXPIRACIÓN DEL TOKEN
export function getTokenExpirationDate(encodedToken){
  let token = jwt(encodedToken)
  //si no hay, no sigue
  if(!token.exp) {
    return null
  }
  let date = new Date(0)
  date.setUTCSeconds(token.exp)
  return date
}

// COMPROBANDO SI LA FECHA SIGUE VIGENTE O NO
export function isTokenExpired(token){
  let expirationDate = getTokenExpirationDate(token)
  return expirationDate < new Date()
}

//COMPROBAR SI EL USER ESTÁ LOGEADO O NO
export function isLoggedIn() {
  let authToken = getAuthToken();
  return !!authToken && !isTokenExpired(authToken);
}
