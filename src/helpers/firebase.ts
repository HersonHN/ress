import { Source } from '@/types';
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';
import { GoogleAuthProvider, getAuth, signInWithPopup, type User } from 'firebase/auth';

type FirebaseUser = User;

type FeedResonse = {
  sources?: Source[];
} | null;

const CONFIG = import.meta.env.VITE_APP_FIREBASE;
const instances: {
  app: FirebaseApp | null;
  user: FirebaseUser | null;
} = {
  app: null,
  user: null,
};

function init() {
  if (instances.app) {
    return instances.app;
  }

  const config = JSON.parse(CONFIG);
  const app: FirebaseApp = initializeApp(config);

  instances.app = app;
  return instances.app;
}

async function auth(): Promise<FirebaseUser> {
  if (instances.user) {
    return instances.user;
  }

  const app = init();
  const aunthenticator = getAuth(app);
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(aunthenticator, provider);
  instances.user = result.user;

  return instances.user;
}

async function loadFeeds(): Promise<FeedResonse> {
  const app = init();
  const user = await auth();

  try {
    const path = `feeds/${user.uid}`;
    const db = getDatabase(app);
    const dataRef = ref(db, path);
    const data = await get(dataRef);
    const jsonData = data.val() as FeedResonse;
    return {
      sources: jsonData.sources,
    };
  } catch (error: any) {
    console.error(error);
  }
}

async function saveFeeds(data: FeedResonse) {
  const app = init();
  const user = await auth();

  const path = `feeds/${user.uid}`;
  const db = getDatabase(app);
  const dataRef = ref(db, path);
  await set(dataRef, data);
}

export { loadFeeds, saveFeeds, init };
