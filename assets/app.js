let results = [];
let filteredResults = [];
let ageSortDESC = true;

const getUsers = function () {
	isLoading(true);
	const items = getRandom(200, 500);

	fetch(`https://randomuser.me/api/?inc=gender,name,phone,email,dob,location,picture,login&results=${items}`)
	.then(function(response) {
		return response.json();
	}).then(function (data) {
		results = data.results;

		filterResults();

		sortResults();

		drawTable();

		drawCounter();

		isLoading(false);
	});
}

const filterResults = function () {
	const min_age = document.querySelector('#min_age').value;
	const max_age = document.querySelector('#max_age').value;
	const exact_age = document.querySelector('#exact_age').value;


	filteredResults = results.filter(function (user) {
		if (exact_age !== '') {

			return user.dob.age == exact_age;

		} else {
			if (min_age === '' && max_age !== '') {

				return max_age >= user.dob.age;

			} else if (min_age !== '' && max_age === '') {

				return user.dob.age >= min_age;

			} else if (min_age !== '' && max_age !== '') {

				return user.dob.age >= min_age && max_age >= user.dob.age;
			}
		}

		return true;
	});
}

const sortResults = function () {
	filteredResults.sort(function (a, b) {
		return ageSortDESC ? a.dob.age - b.dob.age : b.dob.age - a.dob.age;
	});
}


const drawTable = function() {
	const tableBody = document.querySelector('#table_body');
	let html = '';

	filteredResults.forEach(function (user) {
		html += `
			<tr>
		      <th>
		      <image width="50" height="50" src="${user.picture.thumbnail}" />	
		      ${user.name.title} ${user.name.first} ${user.name.last}
		      </th>
		      <td>${user.login.username}</td>
		      <td>${user.dob.age}</td>
		      <td>${user.email}</td>
		      <td>${user.phone}</td>
		      <td>${user.location.city}</td>
		    </tr>
		`;
	});

	tableBody.innerHTML = html;
}

const drawCounter = function () {
	const element = document.getElementById('counter');
	const min_age = document.querySelector('#min_age').value;
	const max_age = document.querySelector('#max_age').value;
	const exact_age = document.querySelector('#exact_age').value;

	if (filteredResults.length === 1) {
		element.innerHTML = `<h3 class="text-center text-success">
			We found ${filteredResults.length} user in ${results.length} users.
		</h3>`;
	} else if (filteredResults.length === 0) {
		element.innerHTML = `<h3 class="text-center text-success">
			We could not found any user in ${results.length} users.
		</h3>`;
	} else if (min_age === '' && max_age === '' && exact_age === '') {
		element.innerHTML = `<h3 class="text-center text-success">
				We found ${filteredResults.length} users.
			</h3>`;
	} else {
		element.innerHTML = `<h3 class="text-center text-success">
			We found ${filteredResults.length} users in ${results.length} users.
		</h3>`;
	}

	element.style.display = 'block';
}

const getRandom = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const isLoading = function (loading) {
	const table = document.getElementById('table');
	const spinner = document.getElementById('spinner');
	const counter = document.getElementById('counter');

	if (loading) {
		table.style.display = 'none';
		counter.style.display = 'none';
		spinner.style.display = 'block';
	} else {
		table.style.display = 'table';
		counter.style.display = 'block';
		spinner.style.display = 'none';
	}
}

document.querySelector('#search').addEventListener('click', function() {
	caretPosition();
	getUsers();
});

const caretPosition = function() {
	html = 'Age ';

	if(ageSortDESC) {
		html += '<i class="fa-solid fa-lg fa-caret-up text-primary fw-bolder"></i>';
	} else {
		html += '<i class="fa-solid fa-lg fa-caret-down text-primary fw-bolder"></i>';
	}

	document.getElementById('age_sorter').innerHTML = html;
}

document.getElementById('age_sorter').addEventListener('click', function() {
	ageSortDESC = !ageSortDESC;

	caretPosition();

	sortResults();

	drawTable();
})




