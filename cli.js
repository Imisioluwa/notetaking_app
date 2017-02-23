const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');

class CLI {

	constructor(vorpalInstance) {
		//vorpal instance - to log messages to the stdout
		this.vorpal = vorpalInstance;
		//clear console
		clear();
		//print out an ASCII text banner
		this.vorpal.log(chalk.bgMagenta.white(figlet.textSync('writeSmart')));
		//call the welcomeClient method
		this.welcomeClient();
	}

	welcomeClient() {
		//Prints a welcome message to the console
		this.vorpal.log(chalk.green("Welcome to the WriteSmart application."));
	}

	getCredentials() {
		//Get username and password to signup or login a user
		let questions = [
		{
			name: 'email',
			type: 'input',
			message: "Enter your email address:",
			validate: (email) => {
				return /^\w+@.+$/.test(email) || "Invalid email, please check input...";
			},
			filter: (email) => {
				return email.trim();
			}
		},
		{
			name: 'password',
			type: 'password',
			message: "Enter Password:",
			validate: (password) => {
				return password.length !== 0 || "Password cannot be empty...";
			},
			filter: (password) => {
				return password.trim();
			}
		}
		];
		//return a promise that resolves with user credentials
		return inquirer.prompt(questions).then((credentials) => {
			return credentials;
		});
	}

	outputMessage(message) {
		//Outputs error or success message
		if (message.includes("Success")) {
			//print out success message in green
			this.vorpal.log(chalk.green(message));
		}
		else {
			//print out error message in red
			this.vorpal.log(chalk.red(message));
		}
	}

	writeNote() {
		//Write a note: get note title and content
		let questions = [
		{
			name: 'noteTitle',
			type: 'input',
			message: 'Note Title: '
		},
		{
			name: 'noteContent',
			type: 'editor',
			message: 'Write note and exit the editor to save'
		}
		];
		return inquirer.prompt(questions).then((note) => {
			return note;
		});
	}

	createNoteOutput(note) {
		//write a new note; output new note's id and title
		this.vorpal.log(chalk.green('You wrote a new note'));
		//output note id
		this.vorpal.log("Note id: "+chalk.white(note.id));
		//output note title
		this.vorpal.log("Note title: " +chalk.white(note.title));
		//reminder to syncnote before exit
		this.vorpal.log("You should synchronize your notes before exit. Unsynchronized notes are lost. To synchronize, enter 'syncnotes' ");
	}

	viewNoteOutput(note) {
		//outputs a note in a formatted manner
		//output note id
		this.vorpal.log("Note id: "+chalk.cyan(note.id));
		//output note topic
		this.vorpal.log("Note title: "+chalk.white(note.title)+"\n");
		//ouput note content
		this.vorpal.log(chalk.white(note.content));
		//reminder to syncnote before exit
		this.vorpal.log("You should synchronize your notes before exit. Unsynchronized notes are lost. To synchronize, enter 'syncnotes' ");
	}

	deleteNoteOutput(note) {
		//delete a note; output deleted note's id and title
		this.vorpal.log(chalk.red("You deleted a note"));
		//output node id
		this.vorpal.log("Note id: "+chalk.red(note.id));
		//output node title
		this.vorpal.log("Note title: "+chalk.red(note.title));
		//reminder to syncnote before exit
		this.vorpal.log("You should synchronize your notes before exit. Unsynchronized notes are lost. To synchronize, enter 'syncnotes' ");
	}

	listNotesOutput(notes) {
		//outputs list of notes in a formatted manner
		//Iterate through notes Object and log note id and title
		//if notes is a string error message, output it to console
		if (typeof notes == 'string') {
			this.vorpal.log(notes);
		}
		else {
			for (let note of notes) {
				this.vorpal.log("Note id: "+chalk.cyan(note.id));
				this.vorpal.log("Note title: "+chalk.white(note.title)+"\n");
			}
		}
		//reminder to syncnote before exit
		this.vorpal.log("You should synchronize your notes before exit. Unsynchronized notes are lost. To synchronize, enter 'syncnotes' ");
	}
}

module.exports = CLI;