let tarefas = [];

const formTarefa = document.getElementById('form-tarefa');
const taskList = document.getElementById('lista-tarefas');


let secaoConcluidas = document.getElementById('secao-concluidas');
if (!secaoConcluidas) {
    secaoConcluidas = document.createElement('section');
    secaoConcluidas.id = 'secao-concluidas';
    secaoConcluidas.innerHTML = `
        <h2>Tarefas Concluídas</h2>
        <div id="container-concluidas" style="position: relative; min-height: 100px; border: 2px dashed #ccc; padding: 10px; margin-top: 10px;">
            <p id="sem-tarefas-concluidas">Nenhuma tarefa concluída.</p>
        </div>
    `;
    document.body.appendChild(secaoConcluidas);
}
const containerConcluidas = document.getElementById('container-concluidas');

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
    localStorage.setItem('tarefas', JSON.stringify(tarefas));

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

    const btnConcluir = cardTarefa.querySelector('.btn-concluir-card');
    const semTarefasConcluidas = document.getElementById('sem-tarefas-concluidas');

   
    btnConcluir.addEventListener('click', function() {
        cardTarefa.classList.toggle('tarefa-concluida');
        
        if (cardTarefa.classList.contains('tarefa-concluida')) {
            btnConcluir.textContent = "Reabrir";
            
            containerConcluidas.appendChild(cardTarefa);
            
            cardTarefa.style.position = 'relative';
            cardTarefa.style.left = 'auto';
            cardTarefa.style.top = 'auto';
            if (semTarefasConcluidas) semTarefasConcluidas.style.display = 'none';
        } else {
            btnConcluir.textContent = "Concluir";
            
            document.body.appendChild(cardTarefa);
            cardTarefa.style.position = 'absolute';
            cardTarefa.style.left = offsetX + 'px';
            cardTarefa.style.top = offsetY + 'px';
            
            
            if (containerConcluidas.querySelectorAll('.janela-tarefa').length === 0) {
                if (semTarefasConcluidas) semTarefasConcluidas.style.display = 'block';
            }
        }
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