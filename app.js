const firebase = require('firebase');

const config = {
	apiKey: "AIzaSyDtwD8StzSnSh27q7KlTRnXyoRNGl_VPng",
	authDomain: "prom-79c6c.firebaseapp.com",
    databaseURL: "https://prom-79c6c.firebaseio.com",
    storageBucket: "prom-79c6c.appspot.com",
    messagingSenderId: "161943421263"
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

	getNotesFromStore() {
		//Get personal notes from online store
		const db = firebase.database();
		db.ref('notes').orderByChild('userId').equalTo(this.user.uid)
		.once('value', function(snapshot) {
			Object.assign(this.notes, snapshot.val());
		});
	}

	generateId(noteTopic) {
		//generate id for a new note
		this.notesCount+=1;
		let formatTopic = noteTopic.split(/\s+/).slice(0, 2).join('-');
		let noteId = `${formatTopic}-${this.notesCount}`;
		return noteId; 
	}

	createNote({noteTopic, noteContent}) {
		//create a note
		let noteId = this.generateId(noteTopic);
		let newNote = new note(noteId, noteTopic, noteContent);
		this.notes[noteId] = newNote;
		return {id: newNote.id, title: newNote.topic};
	}

	getNote(noteId) {
		//get a single note
		return Object.assign({}, this.notes[noteId]);
	}

	editNote(noteId, newNoteTopic=null, newNoteContent=null) {
		//modify a note
		if (newNoteTopic !== null) {
			let Note = this.notes[noteId];
			Note.topic = newNoteTopic;
		}
		if (newNoteContent !== null) {
			this.notes[noteId].content = newNoteContent;
		}
		return Object.assign({}, this.notes[noteId]);
	}

	deleteNote(noteId) {
		//delete a single note
		delete this.notes[noteId];
	}

	getAllNotes(limit=null) {
		//get all notes
		let notesCopies = Object.assign({}, this.notes);
		if (limit === null) {
			return notesCopies;
		}
		else {
			let notesArray = ((notesCopies) => {
				let temp = [];
				for (let item in notesCopies) {
					temp.push([item, notesCopies[item]]);
				}
				return temp;
			})(notesCopies);
			let initialDataShown = notesArray.splice(0, limit);
			this.currentQuery = {"unshownData": notesArray, "limit": limit };
			return initialDataShown;
		}
	}

	next() {
		//display next set of notes
		//For commands like getAllNotes and searchNote which have --limit
		if (typeof this.currentQuery === 'undefined') {
			return "Error! No subsistent query"
		}
		else {
			let remainingData = this.currentQuery["unshownData"];
			let limit = this.currentQuery["limit"];
			if (remainingData.length > limit) {
				return remainingData.splice(0, limit);
			}
			else {
				return remainingData;
			}
		}
	}

	searchNote(queryString) {
		//to be implemented
	}
}

class note { 
	constructor(noteId, noteTopic, noteContent) {
		this.id = noteId;
		this.topic = noteTopic;
		this.content = noteContent;
	}
}
module.exports = NotesApp;