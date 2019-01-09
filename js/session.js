class Session {
	constructor() {
		this.user = null;
	}
	login(name, passwd) {
		if (this.user !== null) return [false, "logged in"];
		if (!localStorage.users) {
			localStorage.users = "[]";
			/* can't find the user with no users at all */
			return [false, "В базе пусто, попробуйте зарегистрироваться."];
		}
		let users = JSON.parse(localStorage.users);
		let usr = users.filter((u) => {
			return u.n === name && u.p === sha256_digest(passwd);
		});
		/* user not found */
		if (usr.length === 0) return [false, "Неверный логин или пароль."];
		this.user = usr[0].n;
		return [true];
	}
	logout() {
		this.user = null;
		return [true];
	}
	sign_up(name, passwd) {
		/* sanity check */
		if (name.length === 0) return [false, "Введите имя."];
		if (passwd.length === 0) return [false, "Введите пароль."];
		if (!localStorage.users) { localStorage.users = "[]"; }

		let users = JSON.parse(localStorage.users);
		let usr = users.filter((u) => { return u.n === name; });
		/* such user exists */
		if (usr.length > 0) return [false, "Пользователь с таким именем уже существует."];
		users.push({ n: name, p: sha256_digest(passwd) });
		localStorage.users = JSON.stringify(users);
		this.user = name;
		return [true];
	}
	save_dump(dump) {
		if (this.user === null) return false;
		if (!localStorage.ds) localStorage.ds = "{}";
		let ds = JSON.parse(localStorage.ds);
		ds[this.user] = dump;
		localStorage.ds = JSON.stringify(ds);
		return true;
	}
	load_dump() {
		if (this.user === null) return [];
		if (!localStorage.ds) return [];
		let ds = JSON.parse(localStorage.ds);
		if (!ds[this.user]) return [];
		return ds[this.user];
	}
}
