let tarefas = [];

function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();

    if (text === '' ) return;

    tarefas.push({ texto: text, concluida: false});
    const indice = tarefas.length - 1;

    const li = document.createElement('li');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', function() {
        tarefas[indice].concluida = checkbox.checked;
        updateCounters();
        salvar();
    });

    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(text));

    const botaoDelete = document.createElement('button');
    botaoDelete.textContent = '🗑️';
    botaoDelete.addEventListener('click', function() {
        tarefas.splice(indice,1);
        li.remove();
        updateCounters();
        salvar();
    })
    li.appendChild(botaoDelete);

    document.getElementById('task-list').appendChild(li);

    input.value = "";
    updateCounters();
    salvar();
}

function updateCounters() {
    const tasks = document.querySelectorAll('#task-list li');
    const concluidas = document.querySelectorAll('#task-list input:checked');

    document.getElementById('total').textContent = tasks.length;
    document.getElementById('pendentes').textContent = tasks.length - concluidas.length;
    document.getElementById('concluidas').textContent = concluidas.length;

}

function salvar() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function ativarDrag() {
    Sortable.create(document.getElementById('task-list'), {
        animation: 150,
        onEnd: function() {
            salvar();
        }
    });
}

function carregar() { 
    const dados = localStorage.getItem('tarefas');
    if (dados === null) return;

    tarefas = JSON.parse(dados);
    tarefas.forEach(function(tarefa) { 
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = tarefa.concluida;
        checkbox.addEventListener('change', function() {
            tarefa.concluida = checkbox.checked;
            updateCounters();
            salvar();
            carregar();
            ativarDrag();
        })

        const botaoDelete = document.createElement('button');
        botaoDelete.textContent = '🗑️';
        botaoDelete.addEventListener('click', function() {
            const i = tarefas.indexOf(tarefa);
            tarefas.splice(i, 1);
            li.remove();
            updateCounters();
            salvar();
        })
        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(tarefa.texto));
        li.appendChild(botaoDelete);

        document.getElementById('task-list').appendChild(li);
    })

    updateCounters();

}

carregar();
ativarDrag();