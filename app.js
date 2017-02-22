class NotesApp {

	constructor(user=null) {
		//initialises with  a user
		this.user = user;
		this.notesCount = 0;
		this.notes = {};
	}

	generateId(noteTopic) {
		//generate id for a new note
		this.notesCount+=1;
		let formatTopic = noteTopic.split(/\s+/).slice(0, 2).join('-');
		let noteId = `${formatTopic}-${this.notesCount}`;
		return noteId; 
	}

	createNote(noteTopic, noteContent) {
		//create a note
		let noteId = this.generateId(noteTopic);
		let newNote = new note(noteId, noteTopic, noteContent);
		this.notes[noteId] = newNote;
		return Object.assign({}, newNote);
	}

	getNote(noteId) {
		//get a single note
		return Object.assign({}, this.notes[noteId]);
	}

	editNote(noteId, newNoteTopic=null, newNoteContent=null) {
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
		let notesCopies = Object.assign({}, this.notes);
		if (limit === null) {
			return notesCopies;
		}
		else {
			let notesArray = notesCopies.entries();
			let initialDataShown = notesArray.splice(0, limit);
			this.currentQuery = {"unshownData": notesArray, "limit": limit };
			return initialDataShown;
		}
	}

	next() {
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

let newNotesApp = new NotesApp();
let Note = newNotesApp.createNote('Test the notesapp', 'this is just a test');
console.log(newNotesApp.notes);
newNotesApp.editNote('Test-the-1', "Test the NotesApp class", "Like I said, this is just a test");
console.log(newNotesApp.getAllNotes());