import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import event from './event';

let _app;
let _user;


event.$on('user', user => {
  _user = user;
})

function init() {
  if (_app) return _app;

  let config = JSON.parse(process.env.VUE_APP_FIREBASE);
  _app = firebase.initializeApp(config);

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      event.$emit('user', user);
    }
  });

  return _app;
};


function getUser() {
  return _user;
}

function auth() {
  init();

  if (_user) return Promise.resolve(_user);

  return new Promise(function (resolve, reject) {
    event.$on('user', user => resolve(user));

    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
      .signInWithPopup(provider)
      .catch(e => reject(e));
  });
}

async function loadFeeds() {
  await auth();
  let user = await getUser();
  let path = `/feeds/${user.uid}`;
  let data = await firebase.database().ref(path).once('value');
  return data.val();
}

async function saveFeeds(data) {
  await auth();
  let user = await getUser();
  let path = `/feeds/${user.uid}`;

  return firebase.database().ref(path).set(data);
}

export {
  loadFeeds,
  saveFeeds,
  init,
}

