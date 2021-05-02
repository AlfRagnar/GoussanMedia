const functions = require("firebase-functions");
const app = require("express")();
const fbAuth = require("./util/fbAuth");

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream,
} = require("./handlers/screams");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  markNotificationsRead,
  getUserDetails,
} = require("./handlers/users");
const { db } = require("./util/admin");

// Scream Routes
app.get("/screams", getAllScreams);
app.get("/scream/:screamId", getScream);
// Need to be Authenticated to access
app.post("/scream", fbAuth, postOneScream);
app.delete("/scream/:screamId", fbAuth, deleteScream);
app.get("/scream/:screamId/like", fbAuth, likeScream);
app.get("/scream/:screamId/unlike", fbAuth, unlikeScream);
app.post("/scream/:screamId/comment", fbAuth, commentOnScream);

// Users Routes
app.post("/signup", signup);
app.post("/login", login);
app.get("/user/:handle", getUserDetails);
// Need to be Authenticated to access
app.post("/user/image", fbAuth, uploadImage);
app.post("/user", fbAuth, addUserDetails);
app.get("/user", fbAuth, getAuthenticatedUser);
app.post("/notifications", fbAuth, markNotificationsRead);

exports.api = functions.region("europe-west3").https.onRequest(app);
const fireStoneInvoke = functions.region("europe-west3").firestore;

exports.createNotificationOnLike = fireStoneInvoke
  .document("likes/{id}")
  .onCreate((snapshot) => {
    db.doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => console.error(err));
  });
exports.deleteNotificationOnUnLike = fireStoneInvoke
  .document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => console.error(err));
  });
exports.createNotificationOnComment = fireStoneInvoke
  .document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => console.error(err));
  });

exports.onUserImageChange = fireStoneInvoke
  .document("/users/{userId}")
  .onUpdate((change) => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("image has changed");
      const batch = db.batch();
      return db
        .collection("screams")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onScreamDelete = fireStoneInvoke
  .document("/screams/{screamId}")
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("screamId", "==", screamId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("screamId", "==", screamId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("screamId", "==", screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
