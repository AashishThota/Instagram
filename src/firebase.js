import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAK7YgOS-XhYCz_eGzMPWRVPw264Mp1YDs",
    authDomain: "instagram-144eb.firebaseapp.com",
    databaseURL: "https://instagram-144eb.firebaseio.com",
    projectId: "instagram-144eb",
    storageBucket: "instagram-144eb.appspot.com",
    messagingSenderId: "544362576739",
    appId: "1:544362576739:web:7d009e7fdcd1875b7bb156",
    measurementId: "G-Q8J6VN6XTP"
  });

  const auth=firebase.auth();
  const db= firebaseApp.firestore();
  const storage=firebase.storage();

  export {auth, db, storage};