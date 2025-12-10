import { Source } from '@/types';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import mitt, { type Emitter } from 'mitt';

type FirebaseApp = firebase.app.App;
type FirebaseUser = firebase.User;
type EventEmitter = Emitter<{ user: FirebaseUser }>;

const CONFIG = import.meta.env.VITE_APP_FIREBASE;
const instances: {
  app: FirebaseApp | null;
  user: FirebaseUser | null;
  emitter: EventEmitter | null;
} = {
  app: null,
  user: null,
  emitter: null,
};

function init() {
  if (instances.app) return instances.app;

  if (!instances.emitter) {
    instances.emitter = mitt();
  }

  instances.emitter.on('user', (user) => {
    instances.user = user;
  });

  const config = JSON.parse(CONFIG);
  instances.app = firebase.initializeApp(config);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      instances.emitter.emit('user', user);
    }
  });

  return instances.app;
}

function auth(): Promise<FirebaseUser> {
  init();

  if (instances.user) return Promise.resolve(instances.user);

  return new Promise(function (resolve, reject) {
    instances.emitter.on('user', (user) => resolve(user));

    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .catch((e) => reject(e));
  });
}

type FeedResonse = {
  sources?: Source[];
} | null;

async function loadFeeds(): Promise<FeedResonse> {
  const user = await auth();

  const path = `/feeds/${user.uid}`;
  const data = await firebase.database().ref(path).once('value');
  return data.val();
}

async function saveFeeds(data: FeedResonse) {
  const user = await auth();
  const path = `/feeds/${user.uid}`;

  return firebase.database().ref(path).set(data);
}

export { loadFeeds, saveFeeds, init };
