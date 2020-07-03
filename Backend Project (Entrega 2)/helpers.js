require('dotenv').config();

const { format } = require('date-fns');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs-extra');
const uuid = require('uuid');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');

const imageUploadPath = path.join(__dirname, process.env.UPLOADS_DIR);

// Format a date to DB
function formatDateToDB(date) {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

// Save a photo and get filename
async function processAndSavePhoto(uploadedImage) {
  // Random File name to be saved
  const savedFileName = `${uuid.v1()}.jpg`;

  // Ensure the uploads path exists
  await fs.ensureDir(imageUploadPath);

  // Process image
  const finalImage = sharp(uploadedImage.data);

  // Check image size
  const imageInfo = await finalImage.metadata();

  // If image is wider than 500px resize it
  if (imageInfo.width > 500) {
    finalImage.resize({
      width: 450,
      height: 300
    });
  }

  // Save image
  await finalImage.toFile(path.join(imageUploadPath, savedFileName));

  return savedFileName;
}

// Save a photo and get filename
async function processAndSaveProfilePhoto(uploadedImage) {
  // Random File name to be saved
  const savedFileName = `${uuid.v1()}.jpg`;

  // Ensure the uploads path exists
  await fs.ensureDir(imageUploadPath);

  // Process image
  const finalImage = sharp(uploadedImage.data);

  // Check image size
  const imageInfo = await finalImage.metadata();

  // If image is wider than 500px resize it
  if (imageInfo.width > 500) {
    finalImage.resize(500);
  }

  // Save image
  await finalImage.toFile(path.join(imageUploadPath, savedFileName));

  return savedFileName;
}

// Delete a photo
async function deletePhoto(imagePath) {
  await fs.unlink(path.join(imageUploadPath, imagePath));
}

// Random string

function randomString(size = 20) {
  return crypto.randomBytes(size).toString('hex').slice(0, size);
}

// Send email
async function sendEmail({ email, title, content }) {
  sgMail.setApiKey(process.env.SENDGRID_KEY);

  const msg = {
    to: email,
    from: 'marioblancocid@hotmail.es',
    subject: title,
    text: content,
    html: `<div>
        <h1 style="color:#3F3D56;">Valida tu email en <span style="text-decoration:underline;">Coffee & Talk:</span></h1>
    <h2 style="color:black;">Déjanos confirmar que eres tú clicando en este enlace: ${content}</h2>
    <h2 style="color:black;">¿Preparad@ para aprender idiomas de la mejor manera posible?</h2>
    <br>
    <br>
    <br>
    <footer  style="color:black; font-side:0.5rem">Mario Blanco Cid © 2020 - Hack a Boss</footer>

    </div>`
  };

  await sgMail.send(msg);
}

// Send email to request host
async function emailToHost({ email, title, content }) {
  sgMail.setApiKey(process.env.SENDGRID_KEY);

  const msg = {
    to: email,
    from: 'marioblancocid@hotmail.es',
    subject: title,
    text: content,
    html: `<div>
      <h1>Alguien se ha apuntado a tu Meeting!</h1>
      <h2>No olvides aceptarlo!</h2>
      <p>${content}</p>  
    </div>`
  };

  await sgMail.send(msg);
}

// Send email to acept user
async function emailToUser({ email, title, content }) {
  sgMail.setApiKey(process.env.SENDGRID_KEY);

  const msg = {
    to: email,
    from: 'marioblancocid@hotmail.es',
    subject: title,
    text: content,
    html: `<div>
      <h1>Te han aceptado para el meeting!</h1>
      <h2>No puedes faltar!</h2>
      <p>${content}</p>  
    </div>`
  };

  await sgMail.send(msg);
}

function generateError(message, code) {
  const error = new Error(message);
  if (code) error.httpCode = code;
  return error;
}

module.exports = {
  formatDateToDB,
  processAndSavePhoto,
  processAndSaveProfilePhoto,
  deletePhoto,
  randomString,
  sendEmail,
  emailToHost,
  emailToUser,
  generateError
};
