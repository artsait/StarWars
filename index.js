let person = new Object();
const form = document.querySelector('form');
const input = form.querySelector('#input')
const rectangle = document.querySelector(".content-rectangle").style;
const message = document.querySelector("#message");

function api(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response)
            } else {
                resolve(xhr.response);
            }
        };
        xhr.onerror = () => {
            reject(xhr.response)
        };
        xhr.send()
    })
}

//проверяем что бы вводились только цифры
input.onkeypress = function (evt) {
    const charCode = evt.which;
    const charStr = String.fromCharCode(charCode);

    if (isNaN(charStr)) {
        return false;
    }
};

//получаем данные из формы
form.addEventListener('submit', function (event) {
    event.preventDefault();
    const id = input.value;

    id > 0
        ? getPeople(id)
        : message.innerHTML = 'введите положительное число';
});

//получаем данные персонажа
const getPeople = (id) => {
    api(`http://swapi.dev/api/people/${id}`)
        .then(response => getPlanet(response))
        .catch(() => switchStatus(true))
};

// получаем название планеты
const getPlanet = (data) => {
    api(data.homeworld)
        .then(planet => {
            transform(data, planet.name);
            switchStatus(false)
            display();
        })
        .catch(() => switchStatus(true))
};

// обновляем данные в объекте
const transform = (data, planet) => {
    person.name = data.name;
    person.planet = planet;
    person.eye_color = data.eye_color;
    person.height = data.height;
    person.mass = data.mass;
    person.gender = data.gender;
};

//отрисовываем данные
const display = () => {
    document.querySelector("#name").textContent = person.name;
    document.querySelector("#planet").textContent = person.planet;

    rectangle.background = person.eye_color;
    rectangle.height = `${person.height}px`;
    rectangle.width = `${person.mass}px`;

    if (person.gender === 'female') {
        rectangle.borderRadius = '10px';
    } else {
        rectangle.borderRadius = '0px';
    }
};

//скрытие блока с контентом
const switchStatus = (status) => {
    message.innerHTML = status ? 'персонаж не найден' : '';
    document.querySelector("#content").style.display = status ? 'none' : 'flex';
};

