# Documentação + Exemplos de JSON para Transações

## 📌 Escopo do Bot no WhatsApp

* Recebe mensagens e imagens do usuário.
* Extrai e instancia os seguintes campos principais:

  * **id** (gerado automaticamente)
  * **valor\_total**
  * **tipo** (ex.: DINHEIRO, PIX, CARTAO)
  * **data** (data e hora do registro)
  * **user\_id** (usuário relacionado)
  * **saldoTipo** (entrada ou saída)

## 📌 Escopo do App

* Permite registrar e editar todas as transações.
* Campo opcional para upload de imagem (com OCR).
* Funcionalidades extra:

  * **Transações comuns** (entrada/saída simples).
  * **Registrar dívidas** com dois subtipos:

    * **RECORRENTE** → assinaturas ou dívidas fixas mensais.

      * Campos adicionais obrigatórios: `data_pagamento` (dia da cobrança recorrente).
    * **DIVIDA** → dívidas de terceiros, empréstimos informais ou crédito parcelado.

      * Campos adicionais obrigatórios: `data_pagamento`.
      * Para **crédito parcelado**:

        * `valor_parcela` → valor de cada parcela.
        * `quantidade_parcelas` → número total de parcelas.
        * `parcela` → índice da parcela atual.
        * tem que gerar transações de acordo com o numero total de parcelas.

---

# Exemplos de JSON

## 🔹 Transação Comum (entrada ou saída manual)

```json
{
  "id": 101,
  "valor_total": 250.00,
  "tipo": "DINHEIRO",
  "data": "2025-09-22 10:30:00",
  "user_id": 4,
  "saldoTipo": "entrada"
}
```

---

## 🔹 Transação Recorrente (assinatura)

```json
{
  "id": 102,
  "valor_total": 49.90,
  "tipo": "RECORRENTE",
  "data": "2025-09-22 12:00:00",
  "user_id": 4,
  "saldoTipo": "saida",
  "data_pagamento": "2025-09-25"
}
```

---

## 🔹 Dívida Simples (empréstimo informal)

```json
{
  "id": 103,
  "valor_total": 500.00,
  "tipo": "DIVIDA",
  "data": "2025-09-22 13:00:00",
  "user_id": 4,
  "saldoTipo": "saida",
  "data_pagamento": "2025-10-10"
}
```

---

## 🔹 Crédito Parcelado

```json
{
  "id": 104,
  "valor_total": 1200.00,
  "tipo": "DIVIDA",
  "data": "2025-09-22 14:00:00",
  "user_id": 4,
  "saldoTipo": "saida",
  "valor_parcela": 200.00,
  "quantidade_parcelas": 6,
  "parcela": 1,
  "data_pagamento": "2025-10-05"
}
```

---

## 🔹 Transação com Imagem (OCR)

```json
{
  "id": 105,
  "valor_total": 75.50,
  "tipo": "DINHEIRO",
  "data": "2025-09-22 15:00:00",
  "user_id": 4,
  "saldoTipo": "entrada"
}
```

### Json completo
```json
{
    "id": auto,
    "context": text,
    "valor_total": number,
    "tipo": DIVIDA | RECORRENTE | CREDITO | DINHEIRO | DEBITO | PIX,
    "data":YYYY/MM/DD HH:MM:SS,
    "user_id": id,
    "saldoTipo": ENTRADA | SAIDA,
    "valor_parcela": number,
    "quantidade_parcelas": number,
    "data_pagamento": YYYY/MM/DD HH:MM:SS,
    "parcela": number,
    "titulo": text
  }
```
