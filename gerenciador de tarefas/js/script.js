let tarefas = [];

const formTarefa = document.getElementById('form-tarefa');
const taskList = document.getElementById('lista-tarefas')

formTarefa.addEventListener('submit', function(event) {
    event.preventDefault();

const novaTarefa = {
    texto: document.getElementById('tarefa').value.trim(),
    categoria: document.getElementById('categoria').value,
    data: document.getElementById('data').value,
    prioridade: document.getElementById('prioridade').value,
}

 });

 if (!novaTarefa.texto) return;
 tarefas.push (novaTarefa);



 console.log(tarefas);