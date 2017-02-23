const vorpal = require('vorpal')();
const notesApp = require('./app.js');
const CLI = require('./cli.js');

let NoteApp = new notesApp();
let cli = new CLI(vorpal);

vorpal
.command('signup', 'Create a WriteSmart account')
.action((args, cb) => {
	cli.getCredentials()
	.then((credentials) => {
		NoteApp.signup(credentials)
		.then((message) => {
			cli.outputMessage(message);
			cb();
		});
	});
});

vorpal
.command('login', 'Login to your WriteSmart account')
.action((args, cb) => {
	cli.getCredentials()
	.then((credentials) => {
		NoteApp.login(credentials)
		.then((message) => {
			cli.outputMessage(message);
			cb();
		});
	});
});

vorpal
.command('createnote', 'Write a note')
.action((args, cb) => {
	cli.writeNote()
	.then((note) => {
		cli.createNoteOutput(NoteApp.createNote(note));
		cb();
	});
});

vorpal
.command('viewnote <note_id>', 'View a single note')
.action((args, cb) => {
	cli.viewNoteOutput(NoteApp.getNote(args.note_id));
	cb();
});

vorpal
.command('deletenote <note_id>', "Delete a single note")
.action((args, cb) => {
	cli.deleteNoteOutput(NoteApp.deleteNote(args.note_id));
	cb();
});

vorpal
.command('listnotes', "List all notes")
.option('-l, --limit <num>', "Number of items to display on a page at once")
.validate((args) => {
	if(args.options.limit) {
		return Number.isInteger(args.options.limit) || "limit must be an integer";
	}
})
.action((args, cb) => {
	cli.listNotesOutput(NoteApp.getAllNotes(args.options.limit));
	cb();
});

vorpal
.command('next', "See the next set of data in the running query")
.action((args, cb) => {
	cli.listNotesOutput(NoteApp.next());
	cb();
});

vorpal
.command('syncnotes', "Synchronize notes with online datastore")
.action((args, cb) => {
	NoteApp.syncNotes()
	.then((message) => {
		cli.outputMessage(message);
		cb();
	});
});

vorpal
.command('logout', "Log out from writesmart")
.action((args, cb) => {
	NoteApp.logout()
	.then((message) => {
		cli.outputMessage(message);
		cb();
	});
});

vorpal
.delimiter('WriteSmart >>> ')
.show();

