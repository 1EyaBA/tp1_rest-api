// generate-token.js
const jwt = require('jsonwebtoken');

const token = jwt.sign({ userId: 2 }, 'secret'); // Remplace 'secret' si tu as une autre clé
console.log('Token JWT :');
console.log(token);
