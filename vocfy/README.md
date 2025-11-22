# 📌 Visão Geral

O workflow contém **três fluxos principais**, todos baseados em webhooks e processamento via agentes de IA com o Google Gemini e código JavaScript.

1. **Geração de questões educacionais (inglês ↔ português)** — endpoint `/question`.
2. **Tradução literal + natural com explicação** — endpoint `/traduzir`.
3. **Geração de diálogos e envio automático via HTTP POST** — integrado ao endpoint externo `/dialogue`.

Cada fluxo possui:

* Um **Webhook** para entrada.
* Um **Agente IA (LangChain)** com prompt definido.
* Um **modelo Google Gemini**.
* Um **nó Code** para parsear JSON retornado pela IA.
* Um **Respond to Webhook** (ou HTTP POST no caso dos diálogos).


# 1) Fluxo: **Geração de Questões Educacionais**

### **Webhook1 (/question)**

* Método: **POST**
* Recebe `expressao` em `body.expressao`.
* Permite CORS: `*`.

### **AI Agent1**

* Prompt define:

  * IA é um gerador de questões educacionais.
  * Cria 3–5 questões por expressão.
  * Mistura tipos: múltipla escolha e verdadeiro/falso.
  * Saída **deve ser JSON puro**.
  * Estrutura fixa: `{ expression, questions[] }`.
  * Usa expressão recebida via: `{{ $item("0").$node["Webhook1"].json["body"]["expressao"] }}`.

### **Google Gemini Chat Model1**

* Modelo usado pelo agente.

### **Code1**

Função:

1. Pega o output do AI Agent1.
2. Remove `json e `.
3. Faz `JSON.parse()`.
4. Retorna objeto JSON limpo para o webhook.

### **Respond to Webhook1**

* Responde com o JSON produzido em **Code1**.


# 2) Fluxo: **Tradução Literal + Natural + Explicação**

### **Webhook (/traduzir)**

* Método: **POST**.
* Entrada esperada:

  * `chatInput`
  * `targetLang`.

### **AI Agent**

* Prompt define:

  * IA traduz termos.
  * Fornece tradução literal, natural, e explicação.
  * Respeita idioma fornecido: `{{ $item("0").$node["Webhook"].json["body"]["targetLang"] }}`.
  * Saída obrigatória em **JSON array** contendo vários objetos de tradução.

### **Google Gemini Chat Model**

* Modelo utilizado pelo agente.

### **Code**

Função:

1. Lê output do AI Agent.
2. Remove blocos ```json.
3. Faz parse em array.
4. Reestrutura itens no formato:

   ```json
   {
     "translations": [
       {
         "literal": "...",
         "natural": "...",
         "explanation": "...",
         "expression": "..."
       }
     ]
   }
   ```
5. Entrega para o respondToWebhook.

### **Respond to Webhook**

* Responde com `{ translations: [...] }`.


# 3) Fluxo: **Geração de Diálogos + Envio via HTTP POST**

Fluxo mais complexo, envolvendo contexto e prevenção de repetição.

### **Entrada de contextos (Code2)**

* Recebe vários itens.
* Extrai campo `context` de cada item.
* Remove duplicados.
* Retorna `{ contextos: [ ... ] }`.

Isso alimenta o agente que gera diálogos.

### **AI Agent3**

* Prompt define:

  * IA cria diálogos entre "usuário" (answer) e outra pessoa (ask).
  * Inglês cotidiano americano.
  * Gera 2–5 diálogos.
  * Não repetir contextos listados em `{{ $json.contextos }}`.
  * Formato obrigatório enviado ao HTTP:

    ```json
    {
      "language": 0,
      "ask": "...",
      "translationAsk": "...",
      "answer": "...",
      "translationAnswer": "...",
      "explanation": "...",
      "context": "..."
    }
    ```
  * Deve enviar cada diálogo via **POST** usando o nó HTTP Request2.
  * Responder apenas com logs curtos.

### **Google Gemini Chat Model2**

* Modelo usado pelo agente.

### **HTTP Request2**

* Ferramenta de envio.
* POST para: `https://aa2ea83fb7dd.ngrok-free.app/dialogue`.
* Corpo JSON gerado pelo agente.
* Usado dentro do AI Agent3 como tool.

### **HTTP Request (extra)**

* Também faz POST para `/dialogue`.
* Sempre outputa dados.
* Pode ter função de debug ou outro fluxo não finalizado.

# 📌 Conexões (resumo)

* `/question` → AI Agent1 → Gemini → Code1 → Resposta JSON.
* `/traduzir` → AI Agent → Gemini → Code → Resposta JSON.
* `/dialogue` (via AI Agent3) → Gemini → HTTP Request2 (múltiplas chamadas).

rama visual (fluxograma).
* Criar documentação técnica mais detalhada.
