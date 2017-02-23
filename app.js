const firebase = require('firebase');

const config = {
    apiKey: "AIzaSyCCrecOwhstv7Z_q-tyjCz21hopgZCB4i0",
    authDomain: "notesconsole-e0f14.firebaseapp.com",
    databaseURL: "https://notesconsole-e0f14.firebaseio.com",
    storageBucket: "notesconsole-e0f14.appspot.com",
    messagingSenderId: "1033480285886"
};
firebase.initializeApp(config);

class NotesApp {

	constructor(user=null) {
		//initialise with user = null
		//user can use the class as a null user
		//or signup/login to use the class as a registered user
		this.user = user;
		this.notesCount = 0;
		this.notes = {};
	}

	signup({email, password}) {
		//create a new user account
		return firebase.auth().createUserWithEmailAndPassword(email, password)
		.then((userObject) => {
			this.user = userObject;
			return "Signup Successful!"
		}, (error) => {
			return "Signup failed!";
		});
	}

	login({email, password}) {
		//login an existing user
		return firebase.auth().signInWithEmailAndPassword(email, password)
		.then((userObject) => {
			this.user = userObject;
			this.getNotesFromStore();
			return "Login Successful!";
		}, (error) => {
			return "Login failed!";
		});
	}

	logout() {
		//logout a signed-in user.
		return firebase.auth().signOut()
		.then(() => {
			this.user = null;
			return "Logout Successful!";
		}, (error) => {
			return "Logout failed";
		});
	}

	getNotesFromStore() {
		//Get personal notes from online store
		const db = firebase.database();
		db.ref(`${this.user.uid}/notes`)
		.once('value', (snapshot) => {
			if (snapshot.exists()) {
				Object.assign(this.notes, snapshot.val());
				this.notesCount = snapshot.numChildren();
			}
		});
	}

	generateId(noteTitle) {
		//generate id for a new note
		this.notesCount+=1;
		let formatTopic = noteTitle.split(/\s+/).slice(0, 2).join('-');
		let noteId = `${formatTopic}-${this.notesCount}`;
		return noteId; 
	}

	createNote({noteTitle, noteContent}) {
		//create a note
		let noteId = this.generateId(noteTitle);
		let newNote = new note(noteId, noteTitle, noteContent);
		this.notes[noteId] = newNote;
		return {id: newNote.id, title: newNote.title};
	}

	getNote(noteId) {
		//get a single note
		return Object.assign({}, this.notes[noteId]);
	}

	editNote(noteId, newNoteTitle=null, newNoteContent=null) {
		//modify a note
		if (newNoteTitle !== null) {
			let Note = this.notes[noteId];
			Note.title = newNoteTitle;
		}
		if (newNoteContent !== null) {
			this.notes[noteId].content = newNoteContent;
		}
		return Object.assign({}, this.notes[noteId]);
	}

	deleteNote(noteId) {
		//delete a single note
		let note = this.notes[noteId];
		delete this.notes[noteId];
		return {id: note.id, title: note.title};
	}

	getAllNotes(limit=null) {
		//get all notes
		let notesArray = ((notes) => {
			let temp = [];
			for (let item in notes) {
				temp.push(notes[item]);
			}
			return temp;
		})(this.notes);

		if (limit === null || limit > notesArray.length) {
			return notesArray;
		}
		else {	
			let initialDataShown = notesArray.splice(0, limit);
			this.currentQuery = {"unshownData": notesArray, "limit": limit };
			return initialDataShown;
		}
	}

	next() {
		//display next set of notes
		//For commands like getAllNotes and searchNote which have --limit
		if (typeof this.currentQuery === 'undefined' || this.currentQuery === null) {
			return "Error! No pending data to fetch"
		}
		else {
			let remainingData = this.currentQuery["unshownData"];
			let limit = this.currentQuery["limit"];
			if (remainingData.length > limit) {
				return remainingData.splice(0, limit);
			}
			else {
				this.currentQuery = null;
				return remainingData;
			}
		}
	}

	syncNotes() {
		//Synchronize notes with online datastore
		if (this.user === null) {
			return firebase.Promise.resolve("Login to synchronise notes. New user? Signup");
		}
		const db = firebase.database();
		return db.ref(`${this.user.uid}/notes`).update(this.notes)
		.then(() => {
			return "Synchronization Complete:::::::Success";
		}, (error) => {
			return "Synchronization Failed::::::::";
		});
	}

	searchNote(queryString, limit) {
		//to be implemented
	}
}

class note { 
	constructor(noteId, noteTitle, noteContent) {
		this.id = noteId;
		this.title = noteTitle;
		this.content = noteContent;
	}
}

module.exports = NotesApp;