const errorFill = document.getElementById('error-fill');
let validate = true;

axios.defaults.baseURL = 'http://localhost:8080';

function logout() {
    localStorage.setItem('userList', '');
    window.location.href = '/index.html';
}

async function addNote(event) {
    event.preventDefault();
    
    const user = await axios.get(`/users/${userLS}`);
    const noteInput = document.getElementById('note-input');
    const newItem = {
        note: noteInput.value,
        user_id: user.data.id
    }

    await axios.post(`/notes/${user.data.id}`, newItem)
    .then(response => {
        noteInput.value = '';
        errorFill.innerHTML = '';
        response.data;
        showNotes();
    })
    .catch(error => {
        errorFill.style.display = 'block';
        errorFill.style.color = 'rgb(216, 38, 38)';
        errorFill.innerHTML = error.response.data.message;
    })

    showNotes();
}

async function editNote(id) {
    const user = await axios.get(`/users/${userLS}`);
    const edit = prompt('Edite a nota:');
    const newNote = {
        note: edit,
        user_id: user.data.id
    }
    
    if(!edit) {
        return;
    }
    
    if(edit.length > 40) {
        return alert('O campo ultrapassou o número máximo de caracteres.');
    }

    await axios.put(`/notes/${user.data.id}/${id}`, newNote);

    showNotes();
}

async function deleteNote(id) {
    const user = await axios.get(`/users/${userLS}`);
    await axios.delete(`/notes/${user.data.id}/${id}`);

    showNotes();
}

async function showNotes() {
    const table = document.getElementById('scroll-box');
    const userLS = localStorage.getItem('userList');
    const user = await axios.get(`/users/${userLS}`);

    await axios.get(`/notes/${user.data.id}`)
    .then(response => {
        table.innerHTML = '';
        const errands = response.data;
        errands.sort(function(a, b) {
            return (a.id - b.id)
        });
        errands.map(item => {
            table.innerHTML += 
            `
            <div class="note note-margin-top note-margin-bottom">
                <p>${item.note}</p>
                <div class="note-button-container margin-bottom">
                    <button class="note-button unselect" id="edit-button" draggable="false" onclick="editNote(${item.id})">Editar</button>
                    <button class="note-button unselect" draggable="false" onclick="deleteNote(${item.id})">Deletar</button>
                </div>
            </div>
            `
            });
        })
        .catch(error => {
            console.log(error);
        });
}

showNotes();