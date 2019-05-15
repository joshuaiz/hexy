import { db, auth } from '../config/firebaseconfig'
import firebase from 'firebase/app'
// import { format } from 'date-fns'

// const formatDate = format
// const DATE_FORMAT = 'yyyy-MM-DD'

export function login(email, password) {
    return auth().signInWithEmailAndPassword(email, password)
}

export function logout() {
    return auth().signOut()
}

export async function signup({
    email,
    password,
    displayName,
    photoURL = 'https://studio.bio/images/avatar2.png',
    startDate
}) {
    try {
        const { user } = await auth().createUserWithEmailAndPassword(
            email,
            password
        )
        await user.updateProfile({ displayName, photoURL })
        await db.doc(`users/${user.uid}`).set({
            displayName: displayName,
            uid: user.uid,
            photoURL: photoURL,
            startDate: startDate
        })
    } catch (e) {
        throw e
    }
}

export function getUser(uid) {
    // const users = db.collection('users').doc(uid)
    // return (getUser = users
    //     .get()
    //     .then(doc => {
    //         if (!doc.exists) {
    //             console.log('No such document!')
    //         } else {
    //             // console.log('Document data:', doc.data())
    //             // return doc.data()
    //             return doc.data()
    //         }
    //     })
    //     .catch(err => {
    //         console.log('Error getting document', err)
    //     }))

    // return getUser

    const users = db.collection('users').doc(uid)
    return (
        users
            // .ref('/users/' + userId)
            .get()
            // .once('value')
            .then(function(snapshot) {
                let userData = snapshot.data() && snapshot.data()
                // ...
                console.log('userData', userData)
                return userData
            })
    )
}

export function fetchUser(uid) {
    return fetchDoc(`users/${uid}`)
}

export function fetchDoc(path) {
    return db
        .doc(path)
        .get()
        .then(doc => {
            doc.data()
            return getDataFromDoc(doc)
        })
}

export function fetchPalettes(uid) {
    return db
        .collection('palettes')
        .orderBy('createdAt')
        .where('uid', '==', uid)
        .get()
        .then(getDocsFromSnapshot)
}

export function getDataFromDoc(doc) {
    return { ...doc.data(), id: doc.id }
}

function getDocsFromSnapshot(snapshot) {
    const docs = []
    snapshot.forEach(doc => {
        docs.push(getDataFromDoc(doc))
    })
    return docs
}

export async function createPalette(palette) {
    return db
        .collection('palettes')
        .add({ createdAt: Date.now(), ...palette })
        .then(ref => ref.get())
        .then(doc => ({ ...doc.data(), id: doc.id }))
}

export function deletePalettes(id) {
    return db.doc(`palettes/${id}`).delete()
}

export function getPalettes(uid) {
    return db
        .collection('palettes')
        .orderBy('createdAt')
        .where('uid', '==', uid)
        .get()
        .then(getDocsFromSnapshot)
}
