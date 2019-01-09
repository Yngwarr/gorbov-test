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
			timer.dumps = session.load_dump();
			alter_page();
			hide_modal('win-login');
		} else {
			notify('Ой!', res[1]);
		}
	});

	document.getElementById('btn-reg').addEventListener('click', (e) => {
		let pwd = [
			document.getElementById('reg-passwd').value,
			document.getElementById('reg-passwd2').value
		];
		if (pwd[0] !== pwd[1]) return notify('Ой!', 'Пароли не совпадают.');
		let username = document.getElementById('reg-username').value;
		let res = session.sign_up(username, pwd[0]);
		if (res[0]) {
			timer.dumps = session.load_dump();
			alter_page();
			hide_modal('win-reg');
		} else {
			notify('Ой!', res[1]);
		}
	});

	document.getElementById('sign-out').addEventListener('click', (e) => {
		session.logout();
		alter_page();
	});

	document.getElementById('show-dump').addEventListener('click', (e) => {
		draw_stats();
		show_modal('win-stats');
	});

	let note = document.getElementById('note');
	note.addEventListener('animationend', (e) => {
		if (e.animationName === 'fadein') {
			note.classList.remove('fade-in');
			setTimeout(() => {
				note.classList.add('fade-out');
			}, 3000);
		}
		if (e.animationName === 'fadeout') {
			note.classList.add('hidden');
			note.classList.remove('fade-out');
		}
	})

	//draw_results(JSON.parse("{\"s\":[1508,2011,2814,4322,6986,8444,11614,12065,14327,14729,16135,16689,18096,24075,24677,25984,28347,30958,31762,33219,34075,35734,36186,36588,37191],\"f\":[3870,4925,6282]}"));
	//show_modal('win-stats');

	//start();
}

function draw_stats() {
	let res = timer.dumps.map(d => JSON.parse(d));
	let ts = _.flatten(res.map(r => deltify(r.s)));
	let mcs = res.map(r => r.f.length);
	let avg_t = ts.reduce((a,b) => a+b) / ts.length;
	let avg_mcs = mcs.reduce((a,b) => a+b) / mcs.length;
	document.getElementById('oa-avg-t').textContent = p_secs(avg_t);
	document.getElementById('oa-max-t').textContent = p_secs(_.max(ts));
	document.getElementById('oa-min-t').textContent = p_secs(_.min(ts));
	document.getElementById('avg-mc').textContent = avg_mcs;
	draw_results(JSON.parse(timer.dumps[0]));
}

function draw_results(res) {
	let f = res.f;
	let s = res.s;
	let mcs = [];
	/* prepare misclick info for drawing */
	for (let i = 0; i < f.length; ++i) {
		for (let j = 0; j < s.length; ++j) {
			if (f[i] > s[j]) continue;
			mcs.push([j, s[j] - f[i]]);
			break;
		}
	}
	s = deltify(res.s);
	/* draw the info */
	chart(s, mcs);
	document.getElementById('avg-t').textContent
		= p_secs(s.reduce((a, b) => a + b) / s.length);
	document.getElementById('min-t').textContent
		= p_secs(_.min(s));
	document.getElementById('max-t').textContent
		= p_secs(_.max(s));
	document.getElementById('mc').textContent
		= f.length.toString();
}

// mock for chart
function chart(data, mcs) {
	/* scales for bars */
	let x = d3.scaleLinear().domain([0, 25]).range([0, 375]);
	let y = d3.scaleLinear().domain([0, d3.max(data)]).range([0, 290]);
	/* scales for axes */
	let xa = d3.scaleLinear().domain([1, 26]).range([0, 375]);
	let ya = d3.scaleLinear().domain([0, d3.max(data)]).range([290, 0]);
	/* axes */
	let xAxis = d3.axisBottom().scale(xa).ticks(25);
	let yAxis = d3.axisLeft().scale(ya);

	/* drawing bars */
	let bars = d3.select('svg #bars').selectAll('rect').data(data);
	bars.merge(bars)
		.transition()
		//.attr('x', (d, i) => x(i+1))
		.attr('y', (d) => 290-y(d))
		//.attr('width', 10)
		.attr('height', (d) => y(d));

	/* drawing axes */
	let svg = d3.select('svg');
	svg.selectAll('.axis').remove();
	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(10,290)')
		.call(xAxis);
	svg.append('g')
		.attr('class', 'y axis')
		.attr('transform', 'translate(10,0)')
		.call(yAxis);

	/* drawing misclicks */
	let misclick = svg.selectAll('.misclick');
	misclick.selectAll('rect').remove();
	misclick.selectAll('rect')
		.data(mcs)
		.enter().append('rect')
		.transition().delay(250)
		.attr('x', ([b, h]) => x(b+1))
		.attr('y', ([b, h]) => 290-y(h))
		.attr('width', 10)
		.attr('height', 5);
}

function start() {
	document.getElementById('ctl').classList.add('disabled');
	//timer.dumps = [];
	timer.reset();
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
	if (win === 'win-login' || win === 'win-reg') {
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
		document.getElementById('sign-up').classList.add('hidden');
		document.getElementById('status').textContent = `Привет, ${session.user}!`;
	} else {
		document.getElementById('sign-out').classList.add('hidden');
		document.getElementById('sign-in').classList.remove('hidden');
		document.getElementById('sign-up').classList.remove('hidden');
		document.getElementById('status').textContent = '';
	}
	if (timer.dumps.length !== 0) {
		document.getElementById('show-dump').classList.remove('hidden');
	} else {
		document.getElementById('show-dump').classList.add('hidden');
	}
}

function change_chart_test(n) {
	if (n > timer.dumps.length || n < 0) return;
	draw_results(JSON.parse(timer.dumps[n]));
}

function notify(head, body) {
	let note = document.getElementById('note');
	document.querySelector('#note h1').textContent = head;
	document.querySelector('#note p').textContent = body;
	note.classList.remove('hidden');
	note.classList.add('fade-in');
}

function deltify(_arr) {
	let arr = JSON.parse(JSON.stringify(_arr));
	let acc = arr[0];
	for (let i = 1; i < arr.length; ++i) {
		arr[i] -= acc;
		acc += arr[i];
	}
	return arr;
}
