# Importação de Módulos e Bibliotecas
from flask import Flask,render_template, request, Response #Módulos Flask
import google.generativeai as genai #Módulo de IA generativa do Google
from dotenv import load_dotenv #
import os #Módulo para acesso à variáveis de ambiente e interação com o SO
from time import sleep #Gerenciar pausas de tempo

# Carrega variáveis de ambiente do arquivo .env -> Carrega chave da API
load_dotenv()

# Obtenção da chave API (acessa o valor da variável de ambiente GEMINI_API_KEY)
CHAVE_API_GOOGLE = os.getenv("GEMINI_API_KEY")
# Definição do Modelo de IA
MODELO_ESCOLHIDO = "gemini-1.5-flash"
# Configuração da chave da API para o módulo genai do Google
genai.configure(api_key=CHAVE_API_GOOGLE)

# Cria instância/aplicação do Flask
app = Flask(__name__)
# Chave secreta para proteger sessões e cookies
app.secret_key = 'alura'

# Método bot (recebe prompt como parâmetro)
def bot(prompt):
    # Gerenciar tentativas
    maximo_tentativas = 1
    repeticao = 0 
    
    # Loop
    while True:
        # 
        try: 
            # Define prompt do sistema
            prompt_do_sistema = f"""
            Você é um chatbot de atendimento a clientes de um e-commerce. 
            Você não deve responder perguntas que não sejam dados do ecommerce informado!
            """

            # Define configurações do modelo
            configuracao_modelo = {
                "temperature" : 0.1,
                "max_output_tokens" : 8192
            }

            # 
            # Define três dos seis parâmetros
            llm = genai.GenerativeModel(
                model_name=MODELO_ESCOLHIDO,
                system_instruction=prompt_do_sistema,
                generation_config=configuracao_modelo
            )

            # Gera e armazena a resposta do modelo para o prompt
            resposta = llm.generate_content(prompt)
            # 
            return resposta.text
        
        # 
        except Exception as erro:
            repeticao += 1
            # Se ultrapassar o número máximo de tentativas
            if repeticao >= maximo_tentativas:
                return "Erro no Gemini: %s" % erro
            
            # 
            sleep(50)

# Rota de chat com método de requisição POST
@app.route("/chat", methods=["POST"])
# Método chamado ao acessar a rota de chat
def chat():
    # Variável para a mensagem do usupario
    prompt = request.json["msg"]
    # Variável para a resposta da IA (retornada pelo método bot)
    resposta = bot(prompt)


# Rota para caminho raíz "/"
@app.route("/")
def home():
    # Renderiza a página index.html usando template do Flask
    return render_template("index.html")

# 
if __name__ == "__main__":
    app.run(debug = True)
