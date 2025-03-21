const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = '8GdSDBNGlthhP7k49JH861xYLtS2'; // Replace with the actual UID

admin.auth().setCustomUserClaims(uid, { role: 'doctor' })
  .then(() => {
    console.log('Custom claims set successfully for user:', uid);
    process.exit(); // Exit the script after setting claims
  })
  .catch((error) => {
    console.error('Error setting custom claims:', error);
    process.exit(1); // Exit with an error code
  });