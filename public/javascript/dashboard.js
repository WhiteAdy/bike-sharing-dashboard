const sessionsActiveTable = document.querySelector('.sessions-active');
const sessionsFinishedTable = document.querySelector('.sessions-finished');
const insertActiveButton = document.getElementById('insertActive');
const insertFinishedButton = document.getElementById('insertFinished');
const removeActiveButton = document.getElementById('removeActive');
const handlerTestButton = document.getElementById('handlerTest');

const basePath = window.location.protocol + '//' + window.location.host;

fetch(`${basePath}/sessions-finished`)
	.then(res => res.json())
	.then(data => {
		console.log(data);
		data.forEach(document => {
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
	});

fetch(`${basePath}/sessions-active`)
	.then(res => res.json())
	.then(data => {
		console.log(data);
		data.forEach(document => {
			sessionsActiveTable.children[0].children[1].innerHTML += `
            <tr>
				<td>${document._id}</td>
				<td>${document.user}</td>
				<td>${document.start}</td>
			</tr>
            `;
		});
	});

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
