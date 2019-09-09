const sessionsActiveTable = document.querySelector('.sessions-active');
const sessionsFinishedTable = document.querySelector('.sessions-finished');
const insertActiveButton = document.getElementById('insertActive');
const insertFinishedButton = document.getElementById('insertFinished');
const removeActiveButton = document.getElementById('removeActive');
const handlerTestButton = document.getElementById('handlerTest');
const body = document.querySelector('body');

const basePath = window.location.protocol + '//' + window.location.host;

let array_sessionsActive = [];
let array_sessionsFinished = [];

let isEqual = (arrayA, arrayB) => {
	// if length is not equal
	if (arrayA.length != arrayB.length) return false;
	else {
		// comapring each element of array
		for (var i = 0; i < arrayA.length; i++)
			if (arrayA[i] != arrayB[i]) return true;
		return true;
	}
};

let flashScreen = () => {
	body.classList.add('flash');
	setTimeout(() => {
		body.classList.remove('flash');
	}, 120);
};

let fetchSessionsFinished = () => {
	fetch(`${basePath}/sessions-finished`)
		.then(res => res.json())
		.then(data => {
			if (!isEqual(array_sessionsFinished, data)) {
				flashScreen();
				array_sessionsFinished = data;
				sessionsFinishedTable.children[0].children[1].innerHTML = '';
				data
					.slice()
					.reverse()
					.forEach(document => {
						sessionsFinishedTable.children[0].children[1].innerHTML += `
				<tr>
					<td>${document._id}</td>
					<td>${document.user}</td>
					<td>${document.start}</td>
					<td>${document.end}</td>
					<td>$${document.fee}</td>
				</tr>
				`;
					});
			}
		});
};

let fetchSessionsActive = () => {
	fetch(`${basePath}/sessions-active`)
		.then(res => res.json())
		.then(data => {
			if (!isEqual(array_sessionsActive, data)) {
				flashScreen();
				array_sessionsActive = data;
				sessionsActiveTable.children[0].children[1].innerHTML = '';
				data
					.slice()
					.reverse()
					.forEach(document => {
						sessionsActiveTable.children[0].children[1].innerHTML += `
				<tr>
					<td>${document._id}</td>
					<td>${document.user}</td>
					<td>${document.start}</td>
				</tr>
				`;
					});
			}
		});
};

fetchSessionsFinished();
fetchSessionsActive();

setInterval(() => {
	fetchSessionsActive();
	fetchSessionsFinished();
}, 1750);

insertActiveButton.addEventListener('click', () => {
	fetch(`${basePath}/sessions-active-add`, {
		method: 'post',
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ name: 'caco' })
	});
});

insertFinishedButton.addEventListener('click', () => {
	fetch(`${basePath}/sessions-finished-add`, {
		method: 'post',
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ name: 'caco' })
	});
});

removeActiveButton.addEventListener('click', () => {
	fetch(`${basePath}/sessions-active-remove`, {
		method: 'post',
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ name: 'caco' })
	});
});

handlerTestButton.addEventListener('click', () => {
	fetch(`${basePath}/sessionHandler`, {
		method: 'post',
		headers: {
			Accept: 'application/json, text/plain, */*',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ name: 'caco' })
	});
});
