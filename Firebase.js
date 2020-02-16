import * as firebase from 'firebase';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyByIah0VXD87DFbt01IutIVIdXSY3PtVHc",
    authDomain: "chat-2f848.firebaseapp.com",
    databaseURL: "https://chat-2f848.firebaseio.com",
    projectId: "chat-2f848",
    storageBucket: "chat-2f848.appspot.com",
    messagingSenderId: "897501274094",
    appId: "1:897501274094:web:7b4a97717c14efc71a78ff"
};

firebase.initializeApp(config);

export default firebase;