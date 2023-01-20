import crypto from 'crypto';
var secret_key = 'fd85b494-0b5a-4b0c-9c1c-8c1c8c1c8c1c';
var secret_iv = 'dgukgfvbgbfj';
var encryptionMethod = 'AES-256-CBC';

const key = crypto
  .createHash('sha256')
  .update(secret_key, 'utf-8')
  .digest('hex')
  .substring(0, 32);
const iv = crypto
  .createHash('sha256')
  .update(secret_iv, 'utf-8')
  .digest('hex')
  .substring(0, 16);

function encrypt(text) {
  let cipher = crypto.createCipheriv(encryptionMethod, key, iv);
  let encrypted =
    cipher.update(text, 'utf-8', 'base64') + cipher.final('base64');
  return Buffer.from(encrypted).toString('base64');
}

function decrypt(text) {
  let buff = Buffer.from(text, 'base64');
  text = buff.toString('utf-8');
  var decryptor = crypto.createDecipheriv(encryptionMethod, key, iv);
  return decryptor.update(text, 'base64', 'utf-8') + decryptor.final('utf-8');
}

export { encrypt, decrypt };
