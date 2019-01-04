class Session {
	constructor() {
		this.user = null;
	}
	login(name, passwd) {
		if (this.user !== null) return [false, "logged in"];
		if (!localStorage.users) {
			localStorage.users = "[]";
			/* can't find the user with no users at all */
			return [false, "wrong credentials"];
		}
		let users = JSON.parse(localStorage.users);
		let usr = users.filter((u) => {
			return u.n === name && u.p === sha256_digest(passwd);
		});
		/* user not found */
		if (usr.length === 0) return [false, "wrong credentials"];
		this.user = usr[0].n;
		return [true];
	}
	logout() {
		this.user = null;
		return [true];
	}
	sign_up(name, passwd) {
		/* sanity check */
		if (name.length === 0) return [false, "no name"];
		if (passwd.length === 0) return [false, "no password"];
		if (!localStorage.users) { localStorage.users = "[]"; }

		let users = JSON.parse(localStorage.users);
		let usr = users.filter((u) => { return u.n === name; });
		/* such user exists */
		if (usr.length > 0) return [false, "name exists"];
		users.push({ n: name, p: sha256_digest(passwd) });
		localStorage.users = JSON.stringify(users);
		this.user = name;
		return [true];
	}
}
