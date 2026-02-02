<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Bragante Agro</title>
    
    <meta name="theme-color" content="#0a3d1d">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    
    <link rel="apple-touch-icon" href="logo.png">
    <link rel="icon" type="image/png" href="logo.png">
    <link rel="manifest" href="manifest.json">

    <script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-database-compat.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"></script> 

    <style>
        :root {
            --verde-escuro: #0a3d1d;
            --verde-claro: #2e7d32;
            --vermelho-alerta: #c62828;
            --cinza-pendente: #94a3b8;
            --neutro-bg: #f1f5f9;
            --neutro-borda: #cbd5e1;
            --texto-principal: #1e293b;
        }
        body { font-family: 'Inter', sans-serif; background-color: var(--neutro-bg); margin: 0; padding: 0; color: var(--texto-principal); display: flex; justify-content: center; -webkit-tap-highlight-color: transparent; } 
        .app-container { width: 100%; max-width: 500px; background-color: #f8fafc; min-height: 100vh; padding: 15px; box-sizing: border-box; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 20px; padding-top: 10px; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 900; text-transform: uppercase; }
        .header .bragante { color: var(--verde-escuro); }
        .header .agro { color: var(--verde-claro); }
        .header p { margin: 4px 0; font-size: 9px; color: #64748b; letter-spacing: 1px; font-weight: bold; text-transform: uppercase; }
        .card { background: #ffffff; padding: 16px; border-radius: 10px; border: 1px solid var(--neutro-borda); margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .section-title { font-size: 11px; font-weight: 700; color: var(--verde-escuro); text-transform: uppercase; margin-bottom: 12px; }
        .form-row { display: flex; gap: 10px; margin-bottom: 12px; align-items: flex-end; }
        .col-data { flex: 0 0 125px; }
        .col-cliente { flex: 1; }
        label { display: block; font-size: 10px; font-weight: 600; color: #64748b; margin-bottom: 5px; }
        input, select, textarea { width: 100%; padding: 10px; border-radius: 6px; border: 1px solid var(--neutro-borda); font-size: 14px; outline: none; box-sizing: border-box; background: white; }
        .grid-prod { display: grid; grid-template-columns: 2fr 1fr 1fr 30px; gap: 8px; margin-bottom: 8px; align-items: center; }
        button { cursor: pointer; border-radius: 6px; font-weight: 600; font-size: 11px; text-transform: uppercase; border: none; }
        .btn-main { background: var(--verde-escuro); color: white; padding: 14px; width: 100%; margin-top: 10px; font-size: 13px; }
        .btn-add { background: transparent; color: var(--verde-claro); border: 1px dashed var(--verde-claro); padding: 9px; margin-bottom: 12px; width: 100%; }
        .btn-nav-group { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 5px; margin-bottom: 10px; }
        .btn-nav { background: #64748b; color: white; padding: 12px 5px; font-size: 8.5px; line-height: 1.2; }
        .btn-nav.active { background: var(--verde-escuro); border: 2px solid var(--verde-claro); }
        .btn-report { background: #94a3b8; color: white; padding: 12px; margin-bottom: 20px; width: 100%; }
        .accordion { background: #f1f5f9; color: var(--texto-principal); padding: 10px; width: 100%; text-align: left; border: 1px solid var(--neutro-borda); border-radius: 6px; margin-bottom: 5px; display: flex; justify-content: space-between; }
        .panel { display: none; background: white; padding: 15px; border: 1px solid var(--neutro-borda); border-top: none; border-radius: 0 0 6px 6px; margin-bottom: 15px; }
        .pedido-item { background: white; padding: 14px; border-radius: 10px; margin-bottom: 12px; border: 1px solid var(--neutro-borda); position: relative; border-left-width: 6px; border-left-style: solid; }
        .status-container { margin-top: 10px; display: flex; gap: 10px; }
        .status-tag { font-size: 10px; font-weight: 500; color: #64748b; }
        .status-tag b { font-weight: 600; text-transform: capitalize; }
        .status-finalizado { color: var(--verde-claro) !important; }
        .btn-del { position: absolute; top: 10px; right: 10px; color: #cbd5e1; font-size: 16px; background: none; width: auto; }
        .btn-remove-item { color: var(--vermelho-alerta); background: none; font-size: 18px; padding: 0; font-weight: bold; }
        .total-row { display: flex; justify-content: space-between; border-top: 1px solid #f1f5f9; margin-top: 12px; padding-top: 10px; }
        .total-val { font-weight: 700; color: var(--verde-escuro); font-size: 15px; }
        .actions { display: flex; gap: 6px; margin-top: 12px; }
        .btn-mini { flex: 1; padding: 10px; font-size: 10px; background: #f8fafc; border: 1px solid var(--neutro-borda); color: #475569; }
        .btn-active-delivery { background: #f0fdf4; color: #166534; border-color: #bbf7d0; }
        .btn-active-pay { background: #eff6ff; color: #1e40af; border-color: #bfdbfe; }
        .modal { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:100; align-items:center; justify-content:center; padding: 20px; }
        .modal-content { background:white; padding:20px; border-radius:12px; width:100%; max-width: 300px; text-align: center; }
    </style>
</head>
<body>

    <div class="app-container">
        <div class="header">
            <h1><span class="bragante">BRAGANTE</span> <span class="agro">AGRO</span></h1>
            <p>Estância São Francisco do Balsamo</p>
        </div>

        <div class="card">
            <div class="section-title">NOVO PEDIDO</div>
            <div class="form-row">
                <div class="col-data">
                    <label>Data</label>
                    <input type="date" id="data">
                </div>
                <div class="col-cliente">
                    <label>Cliente</label>
                    <select id="cliente" onchange="verificarNovoCliente(this)">
                        <option value="">Selecione...</option>
                        <option value="NOVO_CLIENTE">+ NOVO CLIENTE...</option>
                    </select>
                </div>
            </div>
            <div id="container-produtos"></div>
            <button class="btn-add" onclick="adicionarLinhaProduto()">+ Adicionar Item</button>
            <label>Observação Geral</label>
            <textarea id="descricao" rows="2" placeholder="Observações..."></textarea>
            <input type="hidden" id="edit-id">
            <button class="btn-main" onclick="salvarPedido()">SALVAR PEDIDO</button>
            <button id="btn-cancelar" onclick="cancelarEdicao()" style="display:none; background:#f1f5f9; color:#64748b; margin-top:8px; width:100%; padding:10px;">CANCELAR EDIÇÃO</button>
        </div>

        <button class="accordion" onclick="toggleAccordion()">🔍 FILTRAR BUSCA <span>▼</span></button>
        <div class="panel" id="filtroPanel">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:10px">
                <div><label>Filtro Cliente</label><select id="filtro-cliente" onchange="listarPedidos()"><option value="">Todos</option></select></div>
                <div><label>Filtro Produto</label><select id="filtro-produto" onchange="listarPedidos()"><option value="">Todos</option></select></div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px">
                <div><label>Início</label><input type="date" id="filtro-inicio" onchange="listarPedidos()"></div>
                <div><label>Fim</label><input type="date" id="filtro-fim" onchange="listarPedidos()"></div>
            </div>
            <button onclick="limparFiltros()" style="margin-top:10px; background:none; color:var(--vermelho-alerta); width:100%; font-size:9px">LIMPAR FILTROS</button>
        </div>

        <div class="btn-nav-group">
            <button id="nav-entregas" class="btn-nav active" onclick="mudarModo('entregas')">ENTREGAS PENDENTES</button>
            <button id="nav-pagamentos" class="btn-nav" onclick="mudarModo('pagamentos')">PAGAMENTOS PENDENTES</button>
            <button id="nav-todos" class="btn-nav" onclick="mudarModo('todos')">TODOS PEDIDOS</button>
        </div>
        
        <button class="btn-report" onclick="gerarPDF()">GERAR RELATÓRIO PDF</button>

        <div class="section-title" id="titulo-lista" style="margin-left:5px">Entregas Pendentes</div>
        <div id="listaPedidos"></div>
    </div>

    <div id="modalPagamento" class="modal">
        <div class="modal-content">
            <div class="section-title">Recebimento</div>
            <button onclick="selecionarForma('Pix')" class="btn-main" style="background:#14b8a6; margin-bottom: 8px;">PIX</button>
            <button onclick="selecionarForma('Dinheiro')" class="btn-main" style="background:#22c55e; margin-bottom: 8px;">DINHEIRO</button>
            <button onclick="selecionarOutros()" class="btn-main" style="background:#64748b; margin-bottom: 8px;">OUTROS</button>
            <button onclick="fecharModal()" style="background:none; color:#94a3b8; width:100%; margin-top:15px">FECHAR</button>
        </div>
    </div>

    <script>
        // ... (A lógica JavaScript permanece idêntica à anterior) ...
        const listaProdutosBase = ["Sorgo em grãos", "Sorgo triturado", "Milho", "Quirela Fina", "Quirela Grossa", "Milheto", "Ração Top Mix", "Ração Mix", "Outros"];
        let contadorProdutos = 0, todosPedidos = [], modoAtual = 'entregas', pedidoEmPagamento = null;

        const firebaseConfig = {
            apiKey: "AIzaSyCiQh8MEy5SlPCkS8psN0EQ59W2PLKXo8s",
            authDomain: "bragante-agro.firebaseapp.com",
            databaseURL: "https://bragante-agro-default-rtdb.firebaseio.com",
            projectId: "bragante-agro",
            storageBucket: "bragante-agro.firebasestorage.app",
            messagingSenderId: "445413217691",
            appId: "1:445413217691:web:e9b37451c2689a007e7d3e"
        };
        firebase.initializeApp(firebaseConfig);
        const db = firebase.database();

        function verificarNovoCliente(s) { if (s.value === "NOVO_CLIENTE") { const n = prompt("Nome do novo cliente:"); if (n && n.trim() !== "") { const o = document.createElement("option"); o.value = n.trim(); o.text = n.trim(); o.selected = true; s.add(o); } else { s.value = ""; } } }
        function adicionarLinhaProduto(p="", q=1, v="") {
            contadorProdutos++;
            const div = document.createElement('div');
            div.className = 'grid-prod'; div.id = `linha-${contadorProdutos}`;
            let oQ = ""; for(let i=1; i<=30; i++) oQ += `<option value="${i}" ${i == q ? 'selected' : ''}>${i}</option>`;
            let oP = `<option value="">Produto...</option>`;
            listaProdutosBase.forEach(item => { oP += `<option value="${item}" ${item === p ? 'selected' : ''}>${item}</option>`; });
            if(p && !listaProdutosBase.includes(p)) oP += `<option value="${p}" selected>${p}</option>`;
            div.innerHTML = `<select id="prod-${contadorProdutos}" onchange="verificarOutros(this)">${oP}</select>
                <select id="qtd-${contadorProdutos}">${oQ}</select>
                <input type="number" id="preco-${contadorProdutos}" value="${v}" step="0.01" placeholder="R$">
                <button class="btn-remove-item" onclick="removerLinha(${contadorProdutos})">×</button>`;
            document.getElementById('container-produtos').appendChild(div);
        }
        function removerLinha(id) { if(document.getElementById(`linha-${id}`)) document.getElementById(`linha-${id}`).remove(); }
        function verificarOutros(s) { if (s.value === "Outros") { const d = prompt("Qual o produto?"); if (d) { const n = document.createElement("option"); n.value = d; n.text = d; n.selected = true; s.add(n); } else { s.value = ""; } } }

        function salvarPedido() {
            const idEdit = document.getElementById('edit-id').value;
            const cliente = document.getElementById('cliente').value;
            const data = document.getElementById('data').value;
            const obs = document.getElementById('descricao').value;
            if(!cliente || !data || cliente === "NOVO_CLIENTE") return alert("Preencha cliente e data");
            let itens = [], total = 0;
            document.querySelectorAll('.grid-prod').forEach(l => {
                const idNum = l.id.split('-')[1];
                const p = document.getElementById(`prod-${idNum}`).value;
                if(p) {
                    const q = parseInt(document.getElementById(`qtd-${idNum}`).value);
                    const v = parseFloat(document.getElementById(`preco-${idNum}`).value) || 0;
                    itens.push({produto: p, qtd: q, preco: v});
                    total += (q * v);
                }
            });
            if(itens.length === 0) return alert("Adicione um item");
            const dados = { data, cliente, itens, total, descricao: obs, timestamp: firebase.database.ServerValue.TIMESTAMP };
            if(idEdit) db.ref('pedidos/'+idEdit).update({...dados, editado: true}).then(() => { cancelarEdicao(); });
            else { const nid = db.ref('pedidos').push().key; db.ref('pedidos/'+nid).set({...dados, id: nid, entrega: 'Pendente', pagamento: 'Pendente', formaPg: ''}).then(() => { cancelarEdicao(); }); }
        }

        db.ref('pedidos').on('value', (snap) => {
            todosPedidos = []; snap.forEach(c => { todosPedidos.push(c.val()); });
            todosPedidos.sort((a,b) => b.timestamp - a.timestamp);
            atualizarListasMenu(); listarPedidos();
        });

        function atualizarListasMenu() {
            const sc = document.getElementById('cliente'), fc = document.getElementById('filtro-cliente'), fp = document.getElementById('filtro-produto'), val = sc.value;
            const cSet = new Set(), pSet = new Set(listaProdutosBase);
            todosPedidos.forEach(p => { if(p.cliente) cSet.add(p.cliente); p.itens.forEach(i => pSet.add(i.produto)); });
            sc.innerHTML = '<option value="">Selecione...</option><option value="NOVO_CLIENTE">+ NOVO CLIENTE...</option>';
            [...cSet].sort().forEach(c => { const o = document.createElement('option'); o.value = c; o.text = c; if(c === val) o.selected = true; sc.add(o); });
            fc.innerHTML = '<option value="">Todos</option>'; [...cSet].sort().forEach(c => { fc.innerHTML += `<option value="${c}">${c}</option>`; });
            fp.innerHTML = '<option value="">Todos</option>'; [...pSet].sort().forEach(p => { if(p !== "Outros") fp.innerHTML += `<option value="${p}">${p}</option>`; });
        }

        function listarPedidos() {
            const lista = document.getElementById('listaPedidos');
            const fC = document.getElementById('filtro-cliente').value, fP = document.getElementById('filtro-produto').value, fI = document.getElementById('filtro-inicio').value, fF = document.getElementById('filtro-fim').value;
            lista.innerHTML = "";
            const filtrados = todosPedidos.filter(p => {
                let pM = modoAtual === 'entregas' ? p.entrega === 'Pendente' : (modoAtual === 'pagamentos' ? p.pagamento === 'Pendente' : true);
                let pC = fC === "" || p.cliente === fC;
                let pP = fP === "" || p.itens.some(i => i.produto === fP);
                let pD = (!fI || p.data >= fI) && (!fF || p.data <= fF);
                return pM && pC && pP && pD;
            });
            filtrados.forEach(p => {
                let cor = p.entrega === 'Entregue' ? (p.pagamento === 'Pago' ? "var(--verde-claro)" : "var(--vermelho-alerta)") : "var(--cinza-pendente)";
                lista.innerHTML += `<div class="pedido-item" style="border-left-color: ${cor}">
                    <button class="btn-del" onclick="excluirPedido('${p.id}')">✕</button>
                    <div style="font-size:10px; color:#94a3b8;">${p.data.split('-').reverse().join('/')}</div>
                    <div style="font-weight:700; font-size:15px; margin:3px 0;">${p.cliente}</div>
                    <div style="font-size:12px; color:#475569;">${p.itens.map(i=>`${i.qtd}x ${i.produto}`).join(', ')}</div>
                    ${p.descricao ? `<div style="font-size:10px; color:var(--verde-claro); font-style:italic;">Obs: ${p.descricao}</div>` : ''}
                    <div class="status-container">
                        <span class="status-tag">Entrega: <b>${p.entrega}</b></span>
                        <span class="status-tag">Pgto: <b>${p.pagamento} ${p.formaPg?`(${p.formaPg})`:''}</b></span>
                    </div>
                    <div class="total-row"><span class="total-val">R$ ${p.total.toFixed(2)}</span></div>
                    <div class="actions">
                        <button class="btn-mini" onclick="prepararEdicao('${p.id}')">EDITAR</button>
                        <button class="btn-mini ${p.entrega==='Entregue'?'btn-active-delivery':''}" onclick="confirmarEntrega('${p.id}')">ENTREGA</button>
                        <button class="btn-mini ${p.pagamento==='Pago'?'btn-active-pay':''}" onclick="gerenciarPgto('${p.id}')">PAGAR</button>
                    </div>
                </div>`;
            });
        }

        function mudarModo(m) { modoAtual = m; document.querySelectorAll('.btn-nav').forEach(b => b.classList.remove('active')); document.getElementById('nav-' + m).classList.add('active'); listarPedidos(); }
        function cancelarEdicao() { document.getElementById('edit-id').value = ""; document.getElementById('cliente').value = ""; document.getElementById('descricao').value = ""; document.getElementById('container-produtos').innerHTML = ""; adicionarLinhaProduto(); document.getElementById('btn-cancelar').style.display = 'none'; }
        function prepararEdicao(id) { const p = todosPedidos.find(x => x.id === id); document.getElementById('edit-id').value = p.id; document.getElementById('cliente').value = p.cliente; document.getElementById('data').value = p.data; document.getElementById('descricao').value = p.descricao || ""; document.getElementById('container-produtos').innerHTML = ""; p.itens.forEach(i => adicionarLinhaProduto(i.produto, i.qtd, i.preco)); document.getElementById('btn-cancelar').style.display = 'block'; window.scrollTo({top:0, behavior:'smooth'}); }
        function excluirPedido(id) { if(confirm("Excluir?")) db.ref('pedidos/'+id).remove(); }
        function confirmarEntrega(id) { const p = todosPedidos.find(x=>x.id===id); if(p.entrega==='Entregue') db.ref('pedidos/'+id).update({entrega:'Pendente'}); else { db.ref('pedidos/'+id).update({entrega:'Entregue'}); if(p.pagamento==='Pendente' && confirm("Pago?")) abrirModal(id); } }
        function gerenciarPgto(id) { const p = todosPedidos.find(x=>x.id===id); if(p.pagamento==='Pago') db.ref('pedidos/'+id).update({pagamento:'Pendente', formaPg:''}); else abrirModal(id); }
        function abrirModal(id) { pedidoEmPagamento = id; document.getElementById('modalPagamento').style.display='flex'; }
        function fecharModal() { document.getElementById('modalPagamento').style.display='none'; }
        function selecionarForma(f) { db.ref('pedidos/'+pedidoEmPagamento).update({pagamento:'Pago', formaPg:f}); fecharModal(); }
        function selecionarOutros() { const d = prompt("Qual?"); if (d) selecionarForma(d); }
        function toggleAccordion() { const p = document.getElementById("filtroPanel"); p.style.display = p.style.display === "block" ? "none" : "block"; }
        function limparFiltros() { document.getElementById('filtro-cliente').value = ""; document.getElementById('filtro-produto').value = ""; listarPedidos(); }
        function gerarPDF() {
            const { jsPDF } = window.jspdf; const doc = new jsPDF(); let t = 0;
            const rows = []; todosPedidos.filter(p => modoAtual==='todos' || (modoAtual==='entregas'?p.entrega==='Pendente':p.pagamento==='Pendente')).forEach(p => { p.itens.forEach(i => { t += (i.qtd*i.preco); rows.push([p.data, p.cliente, `${i.qtd}x ${i.produto}`, (i.qtd*i.preco).toFixed(2)]); }); });
            doc.autoTable({ head: [['Data', 'Cliente', 'Item', 'Sub']], body: rows });
            doc.text(`Total: R$ ${t.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
            doc.save('relatorio.pdf');
        }

        document.getElementById('data').valueAsDate = new Date();
        adicionarLinhaProduto();
    </script>
</body>
</html>const CACHE_NAME = 'bragante-cache-v1';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  'https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.17.1/firebase-database-compat.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});