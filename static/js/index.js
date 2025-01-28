let chat = document.querySelector('#chat');
let input = document.querySelector('#input');
let botaoEnviar = document.querySelector('#botao-enviar');

// Função Enviar Mensagem
async function enviarMensagem() {
    // Verifica valores vazios nas entrada
    if(input.value == "" || input.value == null) return;
    let mensagem = input.value;
    input.value = "";

    // Cria balão de mensagem do usuário
    let novaBolha = criaBolhaUsuario();
    novaBolha.innerHTML = mensagem;
    chat.appendChild(novaBolha);

    // Cria balão de mensagem do chatbot
    let novaBolhaBot = criaBolhaBot();
    chat.appendChild(novaBolhaBot);
    vaiParaFinalDoChat();
    // Define o conteúdo como "Analisando...", até receber a resposta
    novaBolhaBot.innerHTML = "Analisando ..."
    
    // Envia requisição com a mensagem para a API do ChatBot
    const resposta = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        // Transforma a mensagem JSON em texto (String)
        body: JSON.stringify({'msg':mensagem}),
    });
    // Substitui o conteúdo do balão do chatbot pela mensagem de resposta
    const textoDaResposta = await resposta.text();
    console.log(textoDaResposta);
    novaBolhaBot.innerHTML = textoDaResposta.replace(/\n/g, '<br>');
    vaiParaFinalDoChat();
}

function criaBolhaUsuario() {
    let bolha = document.createElement('p');
    bolha.classList = 'chat__bolha chat__bolha--usuario';
    return bolha;
}

function criaBolhaBot() {
    let bolha = document.createElement('p');
    bolha.classList = 'chat__bolha chat__bolha--bot';
    return bolha;
}

function vaiParaFinalDoChat() {
    //  
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