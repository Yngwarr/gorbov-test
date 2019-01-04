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
		let res = session.login(username, password);
		if (res[0]) {
			// TODO alter page layout for logged in user
			alter_page();
			hide_modal('win-login');
		} else {
			// TODO add an error notification, ideally with a message
		}
	});

	document.getElementById('sign-out').addEventListener('click', (e) => {
		session.logout();
		alter_page();
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
	if (win === 'win-login') {
		let ins = document.querySelectorAll(`#${win} input`);
		ins.forEach(e => e.value = "");
		setTimeout(() => { ins[0].focus(); }, 0);
	}
	document.getElementById(win).classList.remove('hidden');
}

function hide_modal(win) {
	document.getElementById(win).classList.add('hidden');
}

function alter_page() {
	if (session.user !== null) {
		document.getElementById('sign-out').classList.remove('hidden');
		document.getElementById('sign-in').classList.add('hidden');
		document.getElementById('status').textContent = `Привет, ${session.user}!`;
	} else {
		document.getElementById('sign-out').classList.add('hidden');
		document.getElementById('sign-in').classList.remove('hidden');
		document.getElementById('status').textContent = '';
	}
}
