import defaultApp from "../../environment";
import { firestore } from "firebase/app";
import store from "../../store";
const postToDb = async (author, permlink, isNSFW, postType, tags, postBody) => {
  const dbRef = defaultApp
    .firestore()
    .collection("posts")
    .doc(permlink);
  const username = store.getState().login.username;
  const platform = store.getState().login.platform;
  const batch = defaultApp.firestore().batch();
  const isReblogged = store.getState().newPostInterface.isReblogged;
  const newPost = store.getState().newPost;
  const isEditing = store.getState().newPostInterface.editingExistingPost;
  if (isEditing) {
    batch.update(dbRef, {
      tags: tags,
      video: newPost.video,
      audio: newPost.audio,
      quote: newPost.quote,
      photo: Array.isArray(newPost.photo) ? newPost.photo : [newPost.photo],
      quoteSource: newPost.quoteSource,
      steemblr_body: postBody,
      title: newPost.title
    });
  } else {
    batch.set(dbRef, { permlink: permlink });
    batch.update(dbRef, {
      uid: store.getState().profile.uid,
      isNSFW: isNSFW,
      post_type: postType,
      timestamp: firestore.FieldValue.serverTimestamp(),
      tags: tags,
      video: newPost.video,
      audio: newPost.audio,
      quote: newPost.quote,
      photo: [newPost.photo],
      quoteSource: newPost.quoteSource,
      steemblr_body: postBody,
      platform: platform,
      trending: false,
      rating: 0,
      author: username,
      children: 0,
      active_votes: [],
      title: newPost.title,
      comments: [],
      upvotes: [],
      rebloggs: []
    });
    if (isReblogged) {
      batch.update(dbRef, {
        reblogged_post: newPost.reblogged_post,
        is_reblogged: true
      });
    } else {
      batch.update(dbRef, {
        is_reblogged: false
      });
    }
  }

  batch
    .commit()
    .then(function() {
      return void 0;
    })
    .catch(err => {
      console.log(err);
    });

  return void 0;
};
export default postToDb;
