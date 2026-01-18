# 🧑‍🏫 Lousa – Fluxo do Bot de Figurinha (Evolution + n8n)

## 1️⃣ Entrada

**Webhook (Evolution API)**

* Evento: `messages.upsert`
* Recebe mensagem do WhatsApp
* Caso esperado: **imageMessage**

---

## 2️⃣ Dados importantes recebidos

* `data.key.remoteJid` → número do usuário
* `data.key.id` → id da mensagem (opcional)
* `data.message.imageMessage.url` → url da imagem
* `data.message.imageMessage.mimetype` → tipo da imagem
* `data.message.base64` → imagem em base64 (quando disponível)

---

## 3️⃣ Resposta imediata

**HTTP Request – sendText**

* Endpoint: `/message/sendText/{instance}`
* Objetivo: confirmar criação da figurinha

**Exemplo de mensagem:**

> "yo yo yo yo, figurinha feita com sucessooooooo"

---

## 4️⃣ Criação da figurinha

**HTTP Request – sendSticker**

* Endpoint: `/message/sendSticker/{instance}`
* Usa a imagem recebida
* Envia figurinha para o mesmo número

---

## 5️⃣ Fluxo resumido (visual)

```
WhatsApp
   ↓
Evolution API
   ↓
Webhook (n8n)
   ↓
Mensagem de confirmação (sendText)
   ↓
Figurinha (sendSticker)
```

---

## 6️⃣ Limitações (intencional)

* ❌ Não valida tipo de mensagem
* ❌ Não usa comandos
* ❌ Não trata erros
* ❌ Não faz edição da imagem
* ❌ Não ignora mensagens próprias

---

## 7️⃣ Ideias de evolução

* IF node para validar `imageMessage`
* Comando `/fig`
* Resize / crop de imagem
* Sticker animado
* Ignorar `fromMe = true`
* Logs e tratamento de erro

---

## 🎯 Objetivo

Bot **simples, didático e funcional**, ideal como base para automações mais avançadas.
