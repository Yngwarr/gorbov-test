const SIDE = 5

let board;
let timer;
let session;

function init() {
	board = new Board();
	timer = new Timer();
	session = new Session();

	document.getElementById('btn-login').addEventListener('click', (e) => {
		let username = document.getElementById('in-username').value;
		let password = document.getElementById('in-password').value;
		if (session.login(username, password)) {
			// TODO alter page layout for logged in user
			hide_modal('win-login');
		} else {
			// TODO add an error notification, ideally with a message
		}
	});

	//start();
}

function start() {
	document.getElementById('ctl').classList.add('disabled');
	board.reset(() => { timer.start(); });
}

function fail(btn) {
	timer.el.classList.add('stopped');
	btn.classList.add('red');
	setTimeout((b) => {
		btn.classList.remove('red');
		setTimeout(() => {
			timer.el.classList.remove('stopped');
		}, 200);
	}, 200, btn);
}

function show_modal(win) {
	document.getElementById(win).classList.remove('hidden');
}

function hide_modal(win) {
	document.getElementById(win).classList.add('hidden');
}
