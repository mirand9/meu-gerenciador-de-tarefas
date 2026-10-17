const CHAVE = 'gerenciador-tarefas';
const CHAVE_CFG = 'gerenciador-config';
const $ = (s) => document.querySelector(s);
const NOMES = { alta: 'Alta', media: 'Média', baixa: 'Baixa', trabalho: 'Trabalho', pessoal: 'Pessoal' };

function carregar(chave, padrao) {
    try { return JSON.parse(localStorage.getItem(chave)) ?? padrao; } catch { return padrao; }
}
function salvar() {
    try {
        localStorage.setItem(CHAVE, JSON.stringify(tarefas));
        localStorage.setItem(CHAVE_CFG, JSON.stringify(cfg));
    } catch {  }
}

let tarefas = carregar(CHAVE, []);
let cfg = carregar(CHAVE_CFG, { tema: 'claro' });
let mes = new Date(); mes.setDate(1);
let diaSel = null;

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const hoje = () => iso(new Date());
const formatar = (s) => s.split('-').reverse().join('/');


const ABAS = { 'tarefas-btn': 'view-tarefas', 'calendario-btn': 'view-calendario', 'indicadores-btn': 'view-indicadores', 'config-btn': 'view-config' };

function mostrarAba(idBtn) {
    document.querySelectorAll('.view').forEach((v) => (v.hidden = v.id !== ABAS[idBtn]));
    Object.keys(ABAS).forEach((id) => {
        const b = $('#' + id);
        if (id === idBtn) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
}
Object.keys(ABAS).forEach((id) => $('#' + id).addEventListener('click', () => mostrarAba(id)));

$('#filtros-btn').addEventListener('click', (e) => {
    const painel = $('#filtros');
    painel.hidden = !painel.hidden;
    e.currentTarget.setAttribute('aria-expanded', String(!painel.hidden));
});


function criarItem(t) {
    const li = document.createElement('li');
    li.className = 'item' + (t.concluida ? ' feita' : '');
    li.dataset.id = t.id;
    li.dataset.prioridade = t.prioridade;

    const chk = document.createElement('input');
    chk.type = 'checkbox'; chk.checked = t.concluida;
    chk.setAttribute('aria-label', 'Concluir tarefa');

    const info = document.createElement('div');
    info.className = 'info';
    const texto = document.createElement('span');
    texto.className = 'texto'; texto.textContent = t.texto;
    const meta = document.createElement('small');
    meta.textContent = `${NOMES[t.categoria]} · Prioridade ${NOMES[t.prioridade]} · ${formatar(t.data)}`;
    if (!t.concluida && t.data < hoje()) {
        const atraso = document.createElement('span');
        atraso.className = 'atrasada'; atraso.textContent = ' · Atrasada';
        meta.append(atraso);
    }
    info.append(texto, meta);

    const del = document.createElement('button');
    del.type = 'button'; del.className = 'remover'; del.textContent = '×';
    del.setAttribute('aria-label', 'Remover tarefa');

    li.append(chk, info, del);
    return li;
}

function preencher(lista, itens, vazio) {
    lista.replaceChildren();
    if (!itens.length) {
        const li = document.createElement('li');
        li.className = 'vazio'; li.textContent = vazio;
        lista.append(li);
        return;
    }
    itens.forEach((t) => lista.append(criarItem(t)));
}

function aoInteragir(e) {
    const li = e.target.closest('.item');
    if (!li) return;
    const t = tarefas.find((x) => String(x.id) === li.dataset.id);
    if (!t) return;
    if (e.type === 'change' && e.target.type === 'checkbox') t.concluida = e.target.checked;
    else if (e.type === 'click' && e.target.closest('.remover')) tarefas = tarefas.filter((x) => x !== t);
    else return;
    salvar(); render();
}
['#lista-tarefas', '#lista-tarefas-concluidas', '#cal-tarefas'].forEach((s) => {
    $(s).addEventListener('change', aoInteragir);
    $(s).addEventListener('click', aoInteragir);
});


function renderLista() {
    const cat = $('#filtro-categoria').value;
    const pri = $('#filtro-prioridade').value;
    const f = tarefas
        .filter((t) => (!cat || t.categoria === cat) && (!pri || t.prioridade === pri))
        .sort((a, b) => a.data.localeCompare(b.data));
    preencher($('#lista-tarefas'), f.filter((t) => !t.concluida), 'Nenhuma tarefa adicionada.');
    preencher($('#lista-tarefas-concluidas'), f.filter((t) => t.concluida), 'Nenhuma tarefa concluída.');
}

function renderCalendario() {
    $('#cal-titulo').textContent = mes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const grade = $('#cal-grade');
    grade.replaceChildren();
    ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].forEach((l) => {
        const s = document.createElement('span');
        s.className = 'semana'; s.textContent = l;
        grade.append(s);
    });
    for (let i = 0; i < mes.getDay(); i++) grade.append(document.createElement('span'));

    const total = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= total; d++) {
        const data = iso(new Date(mes.getFullYear(), mes.getMonth(), d));
        const b = document.createElement('button');
        b.type = 'button'; b.textContent = d; b.dataset.data = data;
        b.className = 'dia' + (data === hoje() ? ' hoje' : '') + (data === diaSel ? ' sel' : '')
            + (tarefas.some((t) => t.data === data) ? ' tem' : '');
        grade.append(b);
    }

    $('#cal-dia-titulo').textContent = diaSel ? `Tarefas de ${formatar(diaSel)}` : 'Selecione um dia';
    preencher($('#cal-tarefas'), diaSel ? tarefas.filter((t) => t.data === diaSel) : [],
        diaSel ? 'Nenhuma tarefa neste dia.' : 'Clique em um dia para ver as tarefas.');
}

function barras(el, chaves, campo) {
    el.replaceChildren();
    chaves.forEach((k) => {
        const n = tarefas.filter((t) => t[campo] === k).length;
        const linha = document.createElement('div');
        linha.className = 'barra-linha';
        const nome = document.createElement('span'); nome.textContent = NOMES[k];
        const barra = document.createElement('div'); barra.className = 'barra';
        const preench = document.createElement('span');
        preench.style.width = tarefas.length ? `${(n / tarefas.length) * 100}%` : '0';
        barra.append(preench);
        const qtd = document.createElement('span'); qtd.textContent = n;
        linha.append(nome, barra, qtd);
        el.append(linha);
    });
}

function renderIndicadores() {
    const feitas = tarefas.filter((t) => t.concluida).length;
    const atrasadas = tarefas.filter((t) => !t.concluida && t.data < hoje()).length;
    const pct = tarefas.length ? Math.round((feitas / tarefas.length) * 100) : 0;
    const dados = [
        [tarefas.length, 'Total'], [tarefas.length - feitas, 'Pendentes'],
        [feitas, 'Concluídas'], [atrasadas, 'Atrasadas'], [pct + '%', 'Taxa de conclusão'],
    ];
    const el = $('#indicadores');
    el.replaceChildren();
    dados.forEach(([v, r]) => {
        const c = document.createElement('div'); c.className = 'cartao';
        const s = document.createElement('strong'); s.textContent = v;
        const l = document.createElement('span'); l.textContent = r;
        c.append(s, l); el.append(c);
    });
    barras($('#barras-prioridade'), ['alta', 'media', 'baixa'], 'prioridade');
    barras($('#barras-categoria'), ['trabalho', 'pessoal'], 'categoria');
}

function render() { renderLista(); renderCalendario(); renderIndicadores(); }


$('#mes-anterior').addEventListener('click', () => { mes.setMonth(mes.getMonth() - 1); renderCalendario(); });
$('#mes-seguinte').addEventListener('click', () => { mes.setMonth(mes.getMonth() + 1); renderCalendario(); });
$('#cal-grade').addEventListener('click', (e) => {
    const b = e.target.closest('.dia');
    if (b) { diaSel = b.dataset.data; renderCalendario(); }
});


$('#filtro-categoria').addEventListener('change', renderLista);
$('#filtro-prioridade').addEventListener('change', renderLista);


const dialogo = $('#dialogo-tarefa');
$('#btn-nova-tarefa').addEventListener('click', () => {
    $('#form-tarefa').reset();
    $('#data').value = diaSel || hoje();
    dialogo.showModal();
    $('#tarefa').focus();
});
$('#btn-fechar-form').addEventListener('click', () => dialogo.close());
dialogo.addEventListener('click', (e) => { if (e.target === dialogo) dialogo.close(); });

$('#form-tarefa').addEventListener('submit', () => {
    tarefas.push({
        id: Date.now(),
        texto: $('#tarefa').value.trim(),
        categoria: $('#categoria').value,
        data: $('#data').value,
        prioridade: $('#prioridade').value,
        concluida: false,
    });
    salvar(); render();
});


function aplicarTema() {
    document.documentElement.dataset.tema = cfg.tema;
    $('#cfg-tema').value = cfg.tema;
}
$('#cfg-tema').addEventListener('change', (e) => { cfg.tema = e.target.value; aplicarTema(); salvar(); });
$('#limpar-concluidas').addEventListener('click', () => {
    tarefas = tarefas.filter((t) => !t.concluida); salvar(); render();
});
$('#limpar-tudo').addEventListener('click', () => {
    if (confirm('Apagar todas as tarefas? Essa ação não pode ser desfeita.')) {
        tarefas = []; salvar(); render();
    }
});

aplicarTema();
render();
