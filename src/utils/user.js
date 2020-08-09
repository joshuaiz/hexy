// import React from 'react'
import { db, auth } from '../config/firebaseconfig'
import firebase from 'firebase/app'
// import { format } from 'date-fns'

// const formatDate = format
// const DATE_FORMAT = 'yyyy-MM-DD'

// export function login(email, password) {
//     // return auth().signInWithEmailAndPassword(email, password)
//     auth()
//         .signInWithEmailAndPassword(email, password)
//         .then(function(firebaseUser) {
//             return auth().signInWithEmailAndPassword(email, password)
//         })
//         .catch(error => {
//             console.log(error)
//             throw error
//         })
// }

export function login(email, password) {
    return new Promise((resolve, reject) => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                console.log('res', res)
                resolve(res)
            })
            .catch((error) => {
                console.log(error)
                reject(error)
            })
    })
}

export function logout() {
    localStorage.removeItem('hexy_user')
    return auth().signOut()
}

export async function signup({
    email,
    password,
    displayName,
    photoURL = 'https://studio.bio/images/avatar2.png',
    startDate,
}) {
    try {
        const { user } = await auth().createUserWithEmailAndPassword(
            email,
            password
        )
        await user.updateProfile({ displayName, photoURL, email })

        await user
            .sendEmailVerification()
            .then(function () {
                // Email sent.
                console.log('Verification email sent.')
            })
            .catch(function (error) {
                // An error happened.
                console.log('Verification email could not be sent.')
            })

        await db.doc(`users/${user.uid}`).set({
            displayName: displayName,
            uid: user.uid,
            email: email,
            photoURL: photoURL,
            startDate: startDate,
            accountType: 'standard',
        })

        let response = await fetch('/.netlify/functions/welcome', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                displayName: displayName,
            }),
        })

        if (response.ok) {
            console.log('Welcome email sent')
        } else {
            console.log('Welcome email could not be sent.')
        }
    } catch (error) {
        console.log(error)
        throw error
    }
}

export function getUser(uid) {
    const users = db.collection('users').doc(uid)
    return users.get().then(function (snapshot) {
        let userData = snapshot.data() && snapshot.data()
        // ...
        console.log('userData', userData)
        return userData
    })
}

export function getUserCart(uid) {
    //this is code for javascript
    var docRef = db.collection('users').doc(uid)

    docRef
        .get()
        .then(function (doc) {
            if (doc.exists) {
                var cart = doc.get('cart')
                // console.log(cart)

                return cart
            } else {
                // doc.data() will be undefined in this case
                console.log('No such document!')
            }
        })
        .catch(function (error) {
            console.log('Error getting document:', error)
        })
}

export function createID() {
    return Math.random().toString(36).substr(2, 9)
}

export function fetchUser(uid) {
    return fetchDoc(`users/${uid}`)
}

export function fetchDoc(path) {
    return db
        .doc(path)
        .get()
        .then((doc) => {
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
    snapshot.forEach((doc) => {
        docs.push(getDataFromDoc(doc))
    })
    return docs
}

export async function createPalette(palette) {
    return db
        .collection('palettes')
        .add({ createdAt: Date.now(), ...palette })
        .then((ref) => ref.get())
        .then((doc) => ({ ...doc.data(), id: doc.id }))
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
