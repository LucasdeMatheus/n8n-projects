# 🌍 Agente Tradutor — Extensão + n8n Webhook

Uma extensão de tradução inteligente integrada ao **n8n**, que traduz qualquer texto selecionado na web de forma **literal**, **natural** e ainda **explica** o significado de expressões e contextos culturais.

Ideal para estudantes, tradutores e curiosos que querem entender **como e por que** uma frase é traduzida de determinada forma.

---

## ⚙️ Como Funciona

O **Agente Tradutor** combina duas partes:

1. **Um workflow no n8n**, que processa o texto via IA (usando um nó “AI Agent” ou “OpenAI”) e retorna:

   * Tradução literal
   * Tradução natural
   * Explicação cultural / linguística

2. **Uma extensão do Chrome(/**[agente-tradutor)](https://github.com/LucasdeMatheus/n8n-projects/tree/main/agent-translate/agente-tradutor "agente-tradutor"), que:

   * Captura o texto selecionado em qualquer página
   * Envia esse texto para o webhook do n8n
   * Exibe o resultado traduzido diretamente em um popup bonito e responsivo

---

## 🧠 Estrutura do Workflow (n8n)

O fluxo principal no n8n deve conter um **Webhook** configurado para receber as requisições da extensão.

### 🪣 Exemplo de Estrutura

1. **Webhook Node**

   * URL: `http://localhost:5678/webhook/traduzir`
   * Método: `POST`
   * Body esperado:

     ```json
     {
       "chatInput": "texto a ser traduzido",
       "targetLang": "pt"
     }
     ```

2. **AI Agent / OpenAI Node**

   * Recebe `chatInput` e `targetLang` do webhook.
   * Prompt configurado com as instruções:

     ```text
     Você é um agente de tradução literal e explicativa.
     Seu papel é traduzir o conteúdo para o idioma informado, fornecendo:
     - Tradução literal
     - Tradução natural
     - Explicação cultural e linguística breve

     Idiomas suportados: pt, us, fr, es  
     A explicação deve ser em português.

     Entrada: {{ $json["body"]["chatInput"] }}
     Idioma: {{ $item("0").$node["Webhook"].json["body"]["targetLang"] }}
     ```

3. **HTTP Response Node**

   * Retorna JSON no formato:

     ```json
     {
       "literal": "Tradução palavra por palavra",
       "natural": "Tradução fluida e natural",
       "explanation": "Explicação em português"
     }
     ```

---

## 💻 Instalação da Extensão Chrome

### 1️⃣ Baixar o projeto

Salve os arquivos da extensão em uma pasta, por exemplo:

```
~/Desktop/agente-tradutor/
```

Estrutura esperada:

```
agente-tradutor/
├── manifest.json
├── popup.html
├── popup.js
├── popup.css
└── icon.png
```

---

### 2️⃣ Instalar no Chrome

1. Abra `chrome://extensions/`
2. Ative o **Modo do desenvolvedor** (no canto superior direito)
3. Clique em **“Carregar sem compactar”**
4. Selecione a pasta `agente-tradutor`

O ícone do tradutor aparecerá na barra de extensões.
(Opcional: fixe o ícone para fácil acesso 🔌)

---

### 3️⃣ Configurar a URL do n8n

No arquivo `popup.js`, edite esta linha:

```js
const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/traduzir";
```

Se estiver hospedando o n8n em outro local, altere para o domínio correspondente.

---

## 📱 Uso da Extensão

1. **Selecione um texto** em qualquer página
2. Clique no ícone da extensão
3. O texto selecionado já aparecerá no campo
4. Escolha o idioma alvo (br  PT, 🇺🇸 EN, 🇪🇸 ES, 🇫🇷 FR)
5. Clique em **Traduzir**

A tradução aparecerá instantaneamente em três blocos:

* **Tradução Literal** 🧩
* **Tradução Natural** 💬
* **Explicação** 💘

---

## 🤖 Exemplo de Uso

**Entrada:**

> “It’s raining cats and dogs!”

**Idioma:** `pt`

**Saída:**

```text
Tradução Literal: Está chovendo gatos e cães!
Tradução Natural: Está chovendo muito!
Explicação: Expressão idiomática inglesa usada para indicar uma chuva muito forte.
```

---

## 🚀 Requisitos

* Node.js + n8n rodando localmente ou em servidor
* Navegador Google Chrome ou Chromium
* Chave de API configurada no n8n (caso use OpenAI)

---

## 🧩 Licença

Código aberto e livre para uso pessoal ou educacional.
Créditos opcionais ao criador original ajudam na divulgação do projeto 🌎

---
