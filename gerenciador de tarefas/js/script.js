let tarefas = [];

const formTarefa = document.getElementById('form-tarefa');
const taskList = document.getElementById('lista-tarefas');

formTarefa.addEventListener('submit', function(event) {
    event.preventDefault();

    const novaTarefa = {
        texto: document.getElementById('tarefa').value.trim(),
        categoria: document.getElementById('categoria').value,
        data: document.getElementById('data').value,
        prioridade: document.getElementById('prioridade').value,
    };
    
    if (!novaTarefa.texto) return;

    
    tarefas.push(novaTarefa);
    console.log(tarefas);

    
    const cardTarefa = document.createElement('div');
    cardTarefa.classList.add('janela-tarefa'); 
    
    
    const offsetX = 50 + (tarefas.length * 20);
    const offsetY = 200 + (tarefas.length * 20);
    cardTarefa.style.left = offsetX + 'px';
    cardTarefa.style.top = offsetY + 'px';

    cardTarefa.innerHTML = `
        <div class="card-header task-header">
            <strong>${novaTarefa.texto}</strong>
        </div>
        <div class="card-body">
            <p><strong>Categoria:</strong> ${novaTarefa.categoria}</p>
            <p><strong>Data:</strong> ${novaTarefa.data}</p>
            <p><strong>Prioridade:</strong> ${novaTarefa.prioridade}</p>
            <div>
                <button class="btn-concluir-card">Concluir</button>
            </div>
        </div>
    `;

   
    cardTarefa.querySelector('.btn-concluir-card').addEventListener('click', function() {
        cardTarefa.remove();
    });

    
    const semTarefas = document.getElementById('sem-tarefas');
    if (semTarefas) {
        semTarefas.remove();
    }

   
    document.body.appendChild(cardTarefa);


    tornarArrastavel(cardTarefa, cardTarefa.querySelector('.task-header'));

    
    formTarefa.reset();
    formTarefa.classList.add('oculto');
});

const novatarefa = document.getElementById('btn-nova-tarefa');

novatarefa.addEventListener('click', function() { 
    formTarefa.classList.toggle('oculto');
});

//
const modalHeader = document.querySelector('#modal-header') || formTarefa.querySelector('.card-header');
const modal = document.getElementById('form-tarefa');
const header = document.getElementById('modal-header');

let isDragging = false;
let startX, startY;

header.addEventListener('mousedown', function(e) {
    isDragging = true;
    startX = e.clientX - modal.offsetLeft;
    startY = e.clientY - modal.offsetTop;
    modal.style.transform = 'none';
});

document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;

    let x = e.clientX - startX;
    let y = e.clientY - startY;

    modal.style.left = x + 'px';
    modal.style.top = y + 'px';
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});


function tornarArrastavel(elemento, elementoAlvoDrag) {
    let draggingCard = false;
    let startXCard, startYCard;

    elementoAlvoDrag.addEventListener('mousedown', function(e) {
        draggingCard = true;
        startXCard = e.clientX - elemento.offsetLeft;
        startYCard = e.clientY - elemento.offsetTop;
        elemento.style.transform = 'none';
        elemento.style.zIndex = 1000 + tarefas.length;
    });

    document.addEventListener('mousemove', function(e) {
        if (!draggingCard) return;

        let x = e.clientX - startXCard;
        let y = e.clientY - startYCard;

        elemento.style.left = x + 'px';
        elemento.style.top = y + 'px';
    });

    document.addEventListener('mouseup', function() {
        draggingCard = false;
    });
}