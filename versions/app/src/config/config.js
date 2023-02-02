import firebase from 'firebase/app'
//Include any libraries you plan on using below...
import '@firebase/auth';
import '@firebase/firestore';
import '@firebase/storage';


const configKeys = {
	apiKey: "AIzaSyD7rHwMdVtWfdhTGGH0fTQ1Xhk4RjRwfZI",
	authDomain: "elite-ee4b7.firebaseapp.com",
	projectId: "elite-ee4b7",
	storageBucket: "elite-ee4b7.appspot.com",
	messagingSenderId: "37474980291",
	appId: "1:37474980291:web:63150f372b3e92267dad76",
	measurementId: "G-WSZ014RCDH",
	databaseURL: "https://elite-ee4b7.firebaseio.com",
	api_local: "http://localhost:8080/v1/",
	api_dev: "https://epc-express-server.onrender.com/",
	api_live: "https://epc-express-server.onrender.com/",
	// api_live: "https://elite-personal-chefs-server.onrender.com/v1/",
};

if (!firebase.apps.length) {
    firebase.initializeApp(configKeys);
}

export { firebase, configKeys };