// Variáveis Globais
let pixInterval; 
let ingressoSelecionado = "";

const btnIngressos = document.getElementById("btnIngressos");
const modalEscolha = document.getElementById("modalEscolha");
const modalDados = document.getElementById("modalDados");
const modalPagamento = document.getElementById("modalPagamento");
const modalAgradecimento = document.getElementById("modalAgradecimento");
const modalIngressoPronto = document.getElementById("modalIngressoPronto"); 
const btnProsseguir = document.getElementById("btnProsseguir");
const formDados = document.getElementById("formDados"); 
const closeButtons = document.querySelectorAll(".close-btn"); 
const btnConfirmaPagamento = document.getElementById("btnConfirmaPagamento");
const previewIngresso = document.getElementById("previewIngresso");
const lineupSection = document.getElementById("lineup-section"); 
const linkRelatorio = document.getElementById("linkRelatorio");


// NOVIDADE: Função que gera o HTML da página do ingresso com animação
function gerarHtmlIngresso(imagemPath) {
    const dadosCompra = JSON.parse(localStorage.getItem('ultimaCompra'));
    if (!dadosCompra) return "";
    
    const nomeComprador = dadosCompra.nome.toUpperCase();
    const tipoIngresso = dadosCompra.ingresso.toUpperCase();
    
    // Código HTML completo com estilos e a imagem do ingresso
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Seu Ingresso Nessupallooza!</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background-color: #000;
                    font-family: Arial, sans-serif;
                    overflow: auto; /* Garante que o scroll funcione se a tela for pequena */
                }
                .ticket-container {
                    padding: 20px;
                    text-align: center;
                    max-width: 90%;
                }
                img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 10px;
                    box-shadow: 0 0 20px rgba(255, 75, 43, 0.6);
                    margin-top: 30px;
                }
                .success-banner {
                    color: #000;
                    background: #ffea00; /* Amarelo Neon */
                    padding: 15px 30px;
                    border-radius: 50px;
                    font-size: 1.5em;
                    font-weight: bold;
                    margin-bottom: 20px;
                    box-shadow: 0 0 25px rgba(255, 234, 0, 0.8);
                    animation: popIn 0.8s ease-out;
                }
                .instruction {
                    color: #fff;
                    background: linear-gradient(90deg, #ff416c, #ff4b2b);
                    padding: 10px;
                    border-radius: 8px;
                    margin-top: 20px;
                    font-size: 1.1em;
                    animation: pulse 1.5s infinite;
                }
                @keyframes popIn {
                    0% { transform: scale(0.5); opacity: 0; }
                    80% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                /* Rodapé simples para instrução de download */
                footer {
                    color: #999;
                    font-size: 0.9em;
                    margin-top: 40px;
                    padding-bottom: 20px;
                }
            </style>
        </head>
        <body>
            <div class="ticket-container">
                <div class="success-banner">
                    🎉 INGRESSO ${tipoIngresso} DE ${nomeComprador}! 🎉
                </div>
                <img src="${imagemPath}" alt="Seu Ingresso do Festival">
                <p class="instruction">Toque e segure a imagem ou use as opções do seu navegador para SALVAR o seu ingresso.</p>
            </div>
            <footer>
                <p>Obrigado por garantir sua presença no Nessupallooza 2025!</p>
            </footer>
        </body>
        </html>
    `;
    return htmlContent;
}


// NOVIDADE: Função que fecha o modal e exibe o Line-up
function verLineupCompleto() {
    modalIngressoPronto.style.display = "none";
    
    // EXIBIR O LINE-UP NA PÁGINA PRINCIPAL
    lineupSection.style.display = "block"; 
    // Rola para a seção do line-up
    lineupSection.scrollIntoView({ behavior: 'smooth' }); 
}


// FUNÇÃO PARA EXPORTAR RELATÓRIO JSON (Apenas para a anfitriã)
function exportarRelatorio() {
    const compradoresString = localStorage.getItem('listaCompradores');
    let listaCompradores = [];
    if (compradoresString) {
        listaCompradores = JSON.parse(compradoresString);
    }

    if (listaCompradores.length === 0) {
        alert("Nenhuma compra registrada neste navegador ainda. A anfitriã precisa simular as vendas no próprio navegador para que o relatório funcione.");
        return;
    }

    const nomeArquivo = `relatorio_nessupallooza_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.json`;
    const jsonContent = JSON.stringify(listaCompradores, null, 2); 

    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`Relatório de ${listaCompradores.length} compradores baixado como ${nomeArquivo}.`);
}


// FUNÇÃO PARA FECHAR MODAIS
const fecharModais = () => {
    modalEscolha.style.display = "none";
    modalDados.style.display = "none";
    modalPagamento.style.display = "none";
    modalAgradecimento.style.display = "none";
    modalIngressoPronto.style.display = "none";
    
    if (pixInterval) {
        clearInterval(pixInterval);
    }
};

// Abrir modal escolha
btnIngressos.onclick = () => {
    modalEscolha.style.display = "flex";
    
    // Pré-selecionar a opção de 1 Dia
    const primeiroIngresso = document.querySelector("input[name='ingresso'][value='1 Dia']");
    if (primeiroIngresso && !document.querySelector("input[name='ingresso']:checked")) {
        primeiroIngresso.checked = true;
    }
};

// Fechar modais ao clicar no botão 'X' ou fora
closeButtons.forEach(c => {
    c.onclick = fecharModais;
});

window.onclick = (event) => {
    if (event.target.classList.contains('modal')) {
        fecharModais();
    }
};

// Prosseguir escolha
btnProsseguir.onclick = () => {
    const ingresso = document.querySelector("input[name='ingresso']:checked");
    if (!ingresso) {
        alert("Selecione um ingresso!");
        return;
    }
    ingressoSelecionado = ingresso.value;
    modalEscolha.style.display = "none";
    modalDados.style.display = "flex";
};

// Finalizar compra (usando o evento de submit do FORM)
formDados.addEventListener('submit', (event) => {
    event.preventDefault(); 
    
    const nome = document.getElementById("nome").value.trim();
    const telefone = document.getElementById("telefone").value.trim();

    if (!nome || !telefone) {
        alert("Preencha todos os dados!");
        return;
    }

    // Validação de telefone
    const regexTelefone = /^\(?\d{2}\)?[\s-]?9?\d{4}-?\d{4}$/;
    if (!regexTelefone.test(telefone)) {
        alert("Por favor, insira um telefone válido, incluindo o DDD.");
        return;
    }
    
    // Mapeamento do valor do ingresso
    let valorIngresso;
    if (ingressoSelecionado === "1 Dia") valorIngresso = "R$ 35,00";
    else if (ingressoSelecionado === "2 Dias") valorIngresso = "R$ 60,00";
    else if (ingressoSelecionado === "3 Dias") valorIngresso = "R$ 80,00";
    else valorIngresso = "Valor não definido";
    
    
    // 1. Armazenar os dados da compra no armazenamento local (Para o Relatório da Anfitriã)
    const dadosCompra = { 
        nome, 
        telefone, 
        ingresso: ingressoSelecionado, 
        valor: valorIngresso, 
        status: 'Aguardando PIX', 
        data: new Date().toLocaleDateString('pt-BR'),
        hora: new Date().toLocaleTimeString('pt-BR')
    };

    let listaCompradores = JSON.parse(localStorage.getItem('listaCompradores') || '[]');
    listaCompradores.push(dadosCompra);
    localStorage.setItem('listaCompradores', JSON.stringify(listaCompradores));
    localStorage.setItem('ultimaCompra', JSON.stringify(dadosCompra));

    // 2. Abrir o modal de agradecimento
    modalDados.style.display = "none";
    modalAgradecimento.style.display = "flex";
    
    // 3. Enviar msg para WhatsApp da anfitriã
    let msg = `🎉 Nova reserva de Ingresso Nessupallooza 2025!
    
👤 Nome: ${nome}
📱 Telefone: ${telefone}
🎟 Ingresso: ${ingressoSelecionado}
💰 Valor: ${valorIngresso}

*Aguardando Anciosamente para fazer meu pagamento!!!.*`;

    let telefoneHost = "5511947310530"; 
    let url = `https://wa.me/${telefoneHost}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
});


// Lógica ao clicar no botão 'Eu já fiz o pagamento'
btnConfirmaPagamento.onclick = () => {
    const dadosCompra = JSON.parse(localStorage.getItem('ultimaCompra'));
    if (!dadosCompra) return; 

    const area = document.getElementById("areaConfirmação");
    
    // 1. Gera o HTML da página animada com o ingresso dentro
    const imagemPath = previewIngresso.src; 
    const htmlIngresso = gerarHtmlIngresso(imagemPath);

    // Abre o HTML em uma nova aba
    const novaAba = window.open("", "_blank");
    novaAba.document.write(htmlIngresso);
    novaAba.document.close();
    
    // 2. Mudar a área de confirmação
    area.innerHTML = `
        <h3>✅ Confirmação Recebida!</h3>
        <p>Seu ingresso foi aberto em uma nova aba. Clique abaixo para ver o Line-up!</p>
        <button id="btnContinuarParaLineup">CONTINUAR</button>
    `;
    
    // 3. Atribuir a função de CONTINUAR (que abre o novo modal)
    document.getElementById("btnContinuarParaLineup").onclick = () => {
        modalAgradecimento.style.display = "none";
        modalIngressoPronto.style.display = "flex";

        // Adiciona a função de VER LINEUP ao botão do novo modal
        document.getElementById("btnVerLineup").onclick = verLineupCompleto;
    };
};

// Conectar a função de exportação ao link de relatório (Rodapé)
if (linkRelatorio) {
    linkRelatorio.onclick = (e) => {
        e.preventDefault(); 
        exportarRelatorio();
    };
}