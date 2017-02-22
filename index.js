const vorpal = require('vorpal')();
const notesApp = require('./app.js');
const CLI = require('./cli.js');

let NoteApp = new notesApp();
let cli = new CLI(vorpal);

vorpal
.command('signup', 'create a WriteSmart account')
.action((args, cb) => {
	cli.getCredentials()
	.then((credentials) => {
		NoteApp.signup(credentials)
		.then((message) => {
			cli.loginSignupOutput(message);
			cb();
		});
	});
});

vorpal
.command('login', 'login to your WriteSmart account')
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

vorpal
.command('createnote', 'write a note')
.action((args, cb) => {
	cli.writeNote()
	.then((note) => {
		cli.writeNoteOutput(NoteApp.createNote(note));
		cb();
	});
});

vorpal
.command('viewnote <note_id>', 'view a single note')
.action((args, cb) => {
	cli.getNoteOutput(NoteApp.getNote(args.note_id));
	cb();
});

vorpal
.delimiter('WriteSmart >>> ')
.show();

