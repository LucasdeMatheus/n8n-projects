# 🤖 Bot Afiliado Mercado Livre — Evolution API + n8n

Bot automático de **afiliados do Mercado Livre** que monitora mensagens em **grupos do WhatsApp**, substitui links comuns por **links afiliados** e **reenvia a promoção no mesmo grupo** (ambiente de teste).

> ⚠️ **Suporte exclusivo ao Mercado Livre**. Links de outras plataformas são ignorados.

---

## 🧠 Visão Geral da Arquitetura

```
WhatsApp (grupos)
        ↓
Evolution API (Webhook Global)
        ↓
n8n (Workflow)
        ↓
Resolve link ML → Gera link afiliado
        ↓
Extrai imagem do produto
        ↓
Reenvia imagem + texto no mesmo grupo
```

---

## 🔧 Tecnologias Utilizadas

* **Evolution API** — Gateway WhatsApp (Baileys)
* **n8n (Self-hosted)** — Orquestração do fluxo
* **API Afiliados Mercado Livre (custom)**
* **Ngrok** — Exposição local para Webhooks

---

## ✅ Funcionalidades

* 📩 Recebe mensagens de **outros grupos**
* 🖼️ Suporte a mensagens com **imagem + legenda**
* 🔗 Detecta link do Mercado Livre na legenda
* 🔁 Converte para **link afiliado**
* 🖼️ Extrai imagem do produto automaticamente
* 📤 Reenvia **imagem + texto atualizado** no mesmo grupo

---

## ⚙️ Variáveis IMPORTANTES no `.env`

Essas variáveis são **obrigatórias** para o funcionamento correto do bot:

### 🔑 WhatsApp Web Version (CRÍTICO)

```env
CONFIG_SESSION_PHONE_VERSION=2.3000.1032139176
```

* Define a **versão exata do WhatsApp Web** usada pelo Baileys
* Evita erros de conexão, QR inválido ou bans
* Deve ser compatível com:

  ```
  https://web.whatsapp.com/check-update?version=0&platform=web
  ```

---

### 🌐 Webhook Global (OBRIGATÓRIO)

```env
WEBHOOK_GLOBAL_ENABLED=true
```

* Permite que **todas as instâncias** enviem eventos para um único webhook
* Essencial para integração com **n8n**
* Sem isso, o workflow **não recebe mensagens**

---

## 🔔 Eventos de Webhook Utilizados

Certifique-se que estes eventos estão habilitados:

```env
WEBHOOK_EVENTS_MESSAGES_UPSERT=true
WEBHOOK_EVENTS_SEND_MESSAGE=true
WEBHOOK_EVENTS_QRCODE_UPDATED=true
```

---

## 🔄 Funcionamento do Workflow (n8n)

### 1️⃣ Webhook (Entrada)

* Endpoint: `/webhook/evolution`
* Recebe eventos `messages.upsert`
* Filtra:

  * ❌ Mensagens enviadas pelo próprio bot
  * ✅ Apenas grupos (`@g.us`)

---

### 2️⃣ Extração do Link

* Analisa a **legenda da imagem**
* Regex detecta link do Mercado Livre

---

### 3️⃣ Resolução do Produto

* Endpoint:

  ```
  POST /api/v1/resolve-link
  ```
* Retorna URL final do produto

---

### 4️⃣ Geração do Link Afiliado

* Endpoint:

  ```
  POST /api/v1/affiliate-link
  ```
* Parâmetros:

  * `affiliate_id`
  * `product_url`

---

### 5️⃣ Substituição da Mensagem

* Mantém o texto original
* Substitui apenas o link pelo **link afiliado**

---

### 6️⃣ Extração da Imagem

* Faz request HTML no link afiliado
* Extrai:

  * `og:image`
  * fallback para `poly-card__portada`

---

### 7️⃣ Reenvio no Mesmo Grupo

* Endpoint Evolution:

  ```
  POST /message/sendMedia/{instance}
  ```

* Payload:

  ```json
  {
    "number": "ID_DO_GRUPO",
    "mediatype": "image",
    "media": "URL_DA_IMAGEM",
    "caption": "Mensagem com link afiliado"
  }
  ```

---

## 🔐 Autenticação Evolution API

Header obrigatório:

```http
apikey: SUA_API_KEY
```

Definida em:

```env
AUTHENTICATION_API_KEY=...
```

---

## 🧪 Ambiente de Testes

* O bot **reenvia no mesmo grupo** apenas para testes
* Ideal usar:

  * Grupo sandbox
  * Instância dedicada

---

## ⚠️ Observações Importantes

* ❌ Não use em produção sem consentimento dos grupos
* ⚠️ Spam pode gerar **banimento da conta WhatsApp**
* Mercado Livre pode mudar HTML → ajuste regex se necessário

---

## 🚀 Próximos Passos (Ideias)

* ✅ Filtro por palavras-chave ("promo", "oferta")
* ⏱️ Cooldown por grupo
* 📊 Tracking de cliques
* 💰 Relatório de conversões
* 🤖 IA para reescrever copy

---

## 📄 Licença

Projeto experimental / educacional.
Uso por sua conta e risco.

---

Feito com ☕ + ódio de link sem afiliado 😄
