class Session {
	constructor() {
		this.user = null;
	}
	login(name, passwd) {
		if (!localStorage.users) {
			localStorage.users = "[]";
			/* can't find the user with no users at all */
			return false;
		}
		let users = JSON.parse(localStorage.users);
		let usr = users.filter((u) => {
			return u.n === name && u.p === sha256_digest(passwd);
		});
		/* user not found */
		if (usr.length === 0) return false;
		this.user = usr[0].n;
		return true;
	}
	logout() {
		this.user = null;
	}
	sign_up(name, passwd) {
		/* sanity check */
		if (name.length === 0 || passwd.length === 0) return false;
		if (!localStorage.users) { localStorage.users = "[]"; }

		let users = JSON.parse(localStorage.users);
		let usr = users.filter((u) => { return u.n === name; });
		/* such user exists */
		if (usr.length > 0) return false;
		users.push({ n: name, p: sha256_digest(passwd) });
		localStorage.users = JSON.stringify(users);
		this.user = name;
		return true;
	}
}
