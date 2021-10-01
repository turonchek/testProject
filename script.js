const controller = async (url, method, obj) => {
    let options = {
        method: method,
        headers: {
            "content-type": "application/json"
        }
    }

    if(obj) 
        options.body = JSON.stringify(obj)

    let request = await fetch(url, options),
        response = await request.json()

    return response
}

const URL = `https://61498bf2035b3600175ba32f.mockapi.io/heroes`,
heroesForm = document.querySelector(`#heroesForm`),
heroesTable = document.querySelector(`#heroesTable`);

heroesForm.addEventListener(`submit`, e => {
    e.preventDefault()

    let heroName = heroesForm.querySelector(`input[data-name="heroName"]`),
        heroComics = heroesForm.querySelector(`select[data-name="heroComics"]`);

    data = {
        name: heroName.value,
        comics: heroComics.value,
        favourite: false,
    }

    controller(URL, `GET`)
        .then(
            dataCheck => {
                let arr = []
                dataCheck.forEach(item => {
                arr.push(item.name)
                })
                arr.includes(data.name) ? alert(`We already have this hero in the table. Enter another one.`) : controller(URL, `POST`, data).then(data => renderHero(data))
            }
        )
})

const delHero = e => {
    let element = e.target,
        del = element.closest(`tr`);

    controller(`${URL}/${element.dataset.id}`, `DELETE`)
        .then(
            () => del.remove()
        )
}

const favHero = e => {
    let element = e.target,
        favourite = element.checked;
    controller(`${URL}/${element.dataset.id}`, `PUT`, {favourite: favourite})
}

const renderBody = () => {
    controller(URL, `GET`)
        .then(
            data => data.forEach(item => {
                renderHero(item)
            })
        )
}

const renderHero = data => {
    let tr = document.createElement(`tr`),
        tdLabel = document.createElement(`td`),
        label = document.createElement(`label`),
        input = document.createElement(`input`),
        deleteBtnTd = document.createElement(`td`),
        deleteBtn = document.createElement(`button`);

        label.className = `heroFavouriteInput`;
        label.innerText = `Favourite:`;

        input.type = `checkbox`;
        input.checked = data.favourite ? `checked` : ``;
        input.dataset.id = data.id;
        input.addEventListener(`change`, favHero);

        deleteBtn.innerHTML = `Delete`;
        deleteBtn.dataset.id = data.id;
        deleteBtn.addEventListener(`click`, delHero);

    tr.innerHTML = `<td>${data.name}</td>
                    <td>${data.comics}</td>`;
    tr.append(tdLabel);
    tdLabel.append(label);
    label.append(input);
    tr.append(deleteBtnTd);
    deleteBtnTd.append(deleteBtn);
    heroesTable.querySelector(`tbody`).append(tr);
}

renderBody()