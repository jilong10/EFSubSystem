const firebase = require('firebase');

// Firebase Setup
firebase.initializeApp({
    serviceAccount: "./ef-subsystem-firebase-adminsdk-ca3jm-d210775e87.json",
    databaseURL: "https://ef-subsystem.firebaseio.com"
});

module.exports = firebase;