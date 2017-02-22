const vorpal = require('vorpal')();
const notesApp = require('./app.js');
const CLI = require('./cli.js');
//Instantiating notesApp
let NoteApp = new notesApp();
//Instantiating a new object 'CLI' which passes vorpal
let cli = new CLI(vorpal);

vorpal
//Initiates command for signup
.command('signup', 'Create a WriteSmart account')
//Passes args which contain parameter and callback
.action((args, cb) => {
	//Get credentials for Signup and login activity
	cli.getCredentials()
	//resolves credentials
	.then((credentials) => {
		NoteApp.signup(credentials)
		.then((message) => {
			cli.loginSignupOutput(message);
			cb();
		});
	});
});

vorpal
//Initiates command for login
.command('login', 'Login to your WriteSmart account')
.action((args, cb) => {
	cli.getCredentials()
	.then((credentials) => {
		NoteApp.login(credentials)
		.then((message) => {
			cli.loginSignupOutput(message);
			cb();
		});
	});
});
  //Initiates command for createnote
vorpal
.command('createnote', 'Write a note')
.action((args, cb) => {
	cli.writeNote()
	.then((note) => {
		cli.createNoteOutput(NoteApp.createNote(note));
		cb();
	});
});
   //Initiates command for viewnote
vorpal
.command('viewnote <note_id>', 'View a single note')
.action((args, cb) => {
	cli.viewNoteOutput(NoteApp.getNote(args.note_id));
	cb();
});
  //Initiates command for deletenote
vorpal
.command('deletenote <note_id>', "Delete a single note")
.action((args, cb) => {
	cli.deleteNoteOutput(NoteApp.deleteNote(args.note_id));
	cb();
});
  //Initiates command for listnotes
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
   //Calls the next sets of notes
vorpal
.command('next', "See the next set of data in the running query")
.action((args, cb) => {
	cli.listNotesOutput(NoteApp.next());
	cb();
});
//Customize console prompt
vorpal
.delimiter('WriteSmart >>> ')
.show();

