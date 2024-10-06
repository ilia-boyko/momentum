const todo = {
	action(e) {
		const target = e.target;
		if (target.classList.contains('todo__delete')) {
			const taskItem = document.querySelector('.todo__items');
			taskItem.querySelectorAll('[data-todo-state="completed"]').forEach(e => e.remove());
			this.save();
		}
		if (target.classList.contains('todo__action') || target.classList.contains('chk_active')) {
			const action = target.dataset.todoAction;
			const elemItem = target.closest('.todo__item');
			if (action === 'deleted') {
				elemItem.remove();
			} else {
				const chk = elemItem.querySelector('.chk_active');
				if (action === 'completed') {
					chk.checked = true;
					chk.dataset.todoAction = 'active';
				}
				else {
					chk.checked = false;
					chk.dataset.todoAction = 'completed';
				}
				elemItem.dataset.todoState = action;
			}
			this.save();
		} else if (target.classList.contains('todo__add')) {
			this.add();
			this.save();
		}
	},
	add() {
		const elemText = document.querySelector('.todo__text');
		if (elemText.disabled || !elemText.value.length) {
			alert("Название задачи не может быть пустым!");
			return;
		}
		document.querySelector('.todo__items').insertAdjacentHTML('beforeend', this.create(elemText.value));
		elemText.value = '';
	},
	create(text){
		return `<li class="todo__item" data-todo-state="active">
		<input class="chk_active" type="checkbox" data-todo-action="completed"/>
		<span class="todo__task">
        ${text}
		</span>
		<span class="todo__action todo__action_delete" data-todo-action="deleted"></span></li>`;
	},
	init() {
		const fromStorage = localStorage.getItem('todo');
		if (fromStorage) {
			document.querySelector('.todo__items').innerHTML = fromStorage;
		}
		var tasks = document.querySelector('.tasks');
		tasks.addEventListener('click', this.action.bind(this));
		document.querySelector('.todo__text').addEventListener("keypress", function(event) {
			if (event.key === "Enter") {
				event.preventDefault();
				document.querySelector('.todo__add').click();
			}
		});
		const todoItems = document.querySelector('.todo__items');
		todoItems.querySelectorAll('[data-todo-state="completed"]').forEach(e => {
			var chkbox = e.querySelector('.chk_active');
			chkbox.checked = true;
		});
	},
	save() {
		localStorage.setItem('todo', document.querySelector('.todo__items').innerHTML);
	}
};

todo.init();

function getWeatherData(lat, lon) {
	fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=a13a20d38cfd6e6f46dca29703c17941&lang=ru&units=metric`)
		.then(data => data.json())
		.then(data => {
			var temp = Math.round(data['main']['temp']);
			document.querySelector('.weather_temp').innerHTML = temp + '°';
			var info = data['weather'][0]['description'];
			document.querySelector('.weather_info').innerHTML = info;
		})
}

function weather(){
	function success(pos) {
		var crd = pos.coords;
		var lat = crd.latitude;
		var lon = crd.longitude;
		getWeatherData(lat, lon);
		fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=a13a20d38cfd6e6f46dca29703c17941`)
		.then(data => data.json())
		.then(data => {
			var city = data[0]['local_names']['ru'];
			document.querySelector('.city').innerHTML = city;
			localStorage.setItem('city', city);
		})
	}
	
	function error(err) {
		var city = localStorage.getItem('city');
		if (city === null) {
			city = "Краснодар";
			localStorage.setItem('city', city);
		}
		document.querySelector('.city').innerHTML = city;
		fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=a13a20d38cfd6e6f46dca29703c17941`)
		.then(data => data.json())
		.then(data => {
			var lat = data[0]['lat'];
			var lon = data[0]['lon'];
			getWeatherData(lat, lon);
		})
	}
	navigator.geolocation.getCurrentPosition(success, error);
}
weather();
setInterval(weather, 3600000);

function clock(){
  var date = new Date(),
         hours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours(),
         minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes(),
         seconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
  document.getElementById('time').innerHTML = hours + ':' + minutes + ':' + seconds;
  var days = [
  'воскресенье',
  'понедельник',
  'вторник',
  'среда',
  'четверг',
  'пятница',
  'суббота'
  ];
  var n = date.getDay();
  var months = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря'
  ];
  var m = date.getMonth();
  var d = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate();
  document.getElementById('date').innerHTML = d + ' ' + months[m] + ', ' + days[n];
  var backgnd = document.getElementById('background');
  if (date.getHours() < 6 || (date.getHours() == 6 && date.getMinutes() == 0 && date.getSeconds == 0)) {
	backgnd.style.backgroundImage = 'url("./images/01.jpg")';
  }
  else if (date.getHours() < 12 || (date.getHours() == 12 && date.getMinutes() == 0 && date.getSeconds == 0)) {
  	backgnd.style.backgroundImage = 'url("./images/02.jpg")';
  }
  else if (date.getHours() < 18 || (date.getHours() == 18 && date.getMinutes() == 0 && date.getSeconds == 0)) {
	backgnd.style.backgroundImage = 'url("./images/03.jpg")';
  }
  else {
	backgnd.style.backgroundImage = 'url("./images/04.jpg")';
  }
}
clock();
setInterval(clock, 1000);
