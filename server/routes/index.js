'use strict'
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
require('dotenv').config();
const env = process.env;


// console.log(env.PROJECT_ID);
admin.initializeApp({
  credential: admin.credential.cert({
    project_id: env.PROJECT_ID,
    client_email: env.CLIENT_EMAIL,
    private_key: env.PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: "https://jphack2.firebaseio.com"
});

let db = admin.firestore();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/setting_game/:id', (req, res) => {
  // 1. expo clientから受け取る.
  // firestoreでゲーム振り分け
  const time_manegement = (time) => {
    let t = {
      hour: 0,
      minute: 0,
      second: 0,
    };
    t.hour = time.getHours();
    t.minute = time.getMinutes();
    t.second = time.getSeconds();
    return t;
  };

  const compare_time = (t, t2) => {
    let T = t.minute * 60 + t.second;
    let T2 = t2.minute * 60 + t2.second;
    let compare = Math.abs(T - T2);
    return compare;
  }

  db.collection('events').get().then((snapshot) => {
    snapshot.forEach((doc) => {
      // console.log(doc.data());
      let t = time_manegement(new Date(doc.data().get_up_time));

      let t_hope = time_manegement(new Date(doc.data().getup_hope_time));

      let diff = compare_time(t, t_hope) / 60.0;

      if (diff < 10.0) {
        // unityRendering
        // 3. unityWebGLページを返す
        console.log(diff);
      } else {
        // form
        console.log(diff);
      }
    })

  }).catch((err) => {
    console.log('Error getting documents', err);
  });
});



router.post('/unity_score', (req, res) => {
  // unityHTTPRequestでうけとる
  // req.body.user_score = 1(clear) || 0(failure) 的な感じ
  // firestoreのユーザースコアと派閥スコアに反映。
  // reactへ
});



// test Setting_game
router.get('/test_setting_game', (req, res) => {
  console.log(req.query.uid);
  // 1. expo clientから受け取る.
  // firestoreでゲーム振り分け
  const time_manegement = (time) => {
    let t = {
      hour: 0,
      minute: 0,
      second: 0,
    };
    t.hour = time.getHours();
    t.minute = time.getMinutes();
    t.second = time.getSeconds();
    return t;
  };

  const compare_time = (t, t2) => {
    let T = t.minute * 60 + t.second;
    let T2 = t2.minute * 60 + t2.second;
    let compare = Math.abs(T - T2);
    return compare;
  }

  let eventsRef = db.collection('events');

  eventsRef.where('uid', '==', req.query.uid).limit(1).get().then(snapshot => {
    if (snapshot.empty) {
      console.log('No matching documents.');
      return
    }
    snapshot.forEach((doc) => {
      // console.log(doc.data());
      let t = time_manegement(new Date(doc.data().get_up_time));

      let t_hope = time_manegement(new Date(doc.data().getup_hope_time));

      let diff = compare_time(t, t_hope) / 60.0;

      if (diff <= 10.0) {
        // unityRendering
        // 3. unityWebGLページを返す
        console.log("sucess!" + diff);
      } else {
        // form
        console.log("failure" + diff);
      }
    })
  }).catch((err) => {
    console.log('Error getting documents', err);
  });
});

// test unity build
router.get('/test_unity_build', (req, res) => {
  res.render('unity_build');
});

// test Unity_score
router.get('/test_unity_score', (req, res) => {
  // let data = req.body.unity_score;
  let data = "hoge";
  res.render('test_unity_score', { test_data: data });
});

module.exports = router;