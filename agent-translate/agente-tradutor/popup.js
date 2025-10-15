const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/traduzir";

document.getElementById("translateBtn").addEventListener("click", async () => {
  const input = document.getElementById("inputText").value;
  const targetLang = document.getElementById("langSelect").value;
  if (!input) return alert("Cole ou selecione um texto primeiro!");

  console.log("[INFO] Texto de entrada:", input);
  console.log("[INFO] Idioma alvo:", targetLang);

  document.getElementById("output").innerText = "Traduzindo...";

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatInput: input,
        targetLang: targetLang
      })
    });

    console.log("[INFO] Status da resposta:", response.status);

    const dataRaw = await response.json();
    console.log("[INFO] Resposta bruta do webhook:", dataRaw);
    console.log("[DEBUG] Tipo de dataRaw:", typeof dataRaw);

    // Garante que seja sempre um array (de itens do webhook)
    const data = Array.isArray(dataRaw) ? dataRaw : [dataRaw];
    console.log("[INFO] Resposta processada como array:", data);
    console.log("[DEBUG] Número de itens:", data.length);

    // Agora cada item contém a chave "translations" que é um array
    let allTranslations = [];
    data.forEach((item, index) => {
      console.log(`[DEBUG] Item ${index}:`, item);
      if (Array.isArray(item.translations)) {
        allTranslations = allTranslations.concat(item.translations);
      }
    });

    console.log("[DEBUG] Total de traduções:", allTranslations.length);

    // Monta o HTML para cada tradução
    const html = allTranslations.map((t, index) => `
      <div class="output-block">
        <div class="output-section">
          <b>Expressão ${index + 1} - Tradução Literal:</b><br>${t.literal || "—"}
        </div>
        <div class="output-section">
          <b>Tradução Natural:</b><br>${t.natural || "—"}
        </div>
        <div class="output-section">
          <b>Explicação:</b><br>${t.explanation || "—"}
        </div>
      </div>
      <hr>
    `).join("");

    document.getElementById("output").innerHTML = html;
    console.log("[INFO] Traduções exibidas com sucesso.");

  } catch (err) {
    document.getElementById("output").innerText = "Erro: " + err.message;
    console.error("[ERROR] Erro durante tradução:", err);
  }
});

// Preenche automaticamente com texto selecionado do Chrome storage
chrome.storage.local.get(["selectedText"], (result) => {
  if (result.selectedText) {
    console.log("[INFO] Texto selecionado encontrado no storage:", result.selectedText);
    document.getElementById("inputText").value = result.selectedText;
  } else {
    console.log("[INFO] Nenhum texto selecionado encontrado no storage.");
  }
});
