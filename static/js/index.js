let chat = document.querySelector('#chat'); //seção de chat
let input = document.querySelector('#input'); //caixa de entrada
let botaoEnviar = document.querySelector('#botao-enviar'); //botão de envio

// Função Enviar Mensagem (disparada ao clicar no botão de envio, ou com enter)
async function enviarMensagem() {
    // Verifica se a entrada está vazia
    if(input.value == "" || input.value == null) return; //Se sim retorna/sai da função

    // Se não (se houver conteúdo na entrada)

    // Armazena o valor da entrada do usuário 
    let mensagem = input.value;
    // Limpa a entrada
    input.value = "";

    // Cria novo balão de mensagem do usuário (à direita)
    let novaBolha = criaBolhaUsuario();
    // Preenche o balão com a mensagem do usuário
    novaBolha.innerHTML = mensagem;
    // Acrescenta o elemento novaBolha na página, no final do chat (após mensagens já existentes)
    chat.appendChild(novaBolha);

    // Cria novo balão de mensagem do chatbot (à esquerda)
    let novaBolhaBot = criaBolhaBot();
    // Adiciona novaBolhaBot no final da seção chat
    chat.appendChild(novaBolhaBot);
    // Desce o chat
    vaiParaFinalDoChat();
    // Define o conteúdo como "Analisando...", até receber a resposta
    novaBolhaBot.innerHTML = "Analisando ..."
    
    // Envia requisição com a mensagem para a API do ChatBot (endpoint /chat)
    const resposta = await fetch("http://127.0.0.1:5000/chat", {
        // Método de requisição
        method: "POST",
        // Especifica tipo de dado enviado -> json
        headers: {
        "Content-Type": "application/json",
        },
        // Monta uma string no formato JSON  (chave -> msg,  valor -> mensagem (do usuário)) e a carrega no corpo da requisição
        body: JSON.stringify({'msg':mensagem}),
    });
    // Armazena o texto da resposta à requisição (resposta do bot)
    const textoDaResposta = await resposta.text();
    console.log(textoDaResposta);
    // Substitui o conteúdo do balão do chatbot pela resposta
    novaBolhaBot.innerHTML = textoDaResposta.replace(/\n/g, '<br>');
    // Desce para o fim do chat
    vaiParaFinalDoChat();
}

// Função Criar Bolha Usuário 
function criaBolhaUsuario() {
    // Cria um parágrafo na página e o capta na variável "bolha"
    let bolha = document.createElement('p');
    // Adiciona classes específicas para o balão do usuário
    bolha.classList = 'chat__bolha chat__bolha--usuario';
    // Retorna o elemento criado
    return bolha;
}

// Função Criar Bolha Bot
function criaBolhaBot() {
    // Cria um parágrafo na página e o capta na variável "bolha"
    let bolha = document.createElement('p');
    // Adiciona classes específicas para o balão do bot
    bolha.classList = 'chat__bolha chat__bolha--bot';
    // Retorna o elemento criado
    return bolha;
}

// Função vaiParaFinalDoChat
function vaiParaFinalDoChat() {
    // Rola a seção de chat para baixo
    chat.scrollTop = chat.scrollHeight;
}

// Envia a mensagem ao clicar no botão de envio
botaoEnviar.addEventListener('click', enviarMensagem);
input.addEventListener("keyup", function(event) {
    event.preventDefault();
    // "Ativa" o "click" do botão de envio caso seja pressionado "Enter" - Envia a mensagem
    if (event.keyCode === 13) {
        botaoEnviar.click();
    }
});