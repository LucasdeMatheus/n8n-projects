const N8N_WEBHOOK_URL = "http://localhost:5678/webhook/traduzir";

document.getElementById("translateBtn").addEventListener("click", async () => {
  const input = document.getElementById("inputText").value;
  const targetLang = document.getElementById("langSelect").value; // idioma selecionado
  if (!input) return alert("Cole ou selecione um texto primeiro!");

  document.getElementById("output").innerText = "Traduzindo...";

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatInput: input,
        targetLang: targetLang // adiciona o idioma no body
      })
    });

    const data = await response.json();

    document.getElementById("output").innerHTML = `
      <div class="output-section">
        <b>Tradução Literal:</b><br>${data.literal || "—"}
      </div>
      <div class="output-section">
        <b>Tradução Natural:</b><br>${data.natural || "—"}
      </div>
      <div class="output-section">
        <b>Explicação:</b><br>${data.explanation || "—"}
      </div>
    `;
  } catch (err) {
    document.getElementById("output").innerText = "Erro: " + err.message;
  }
});

// Preenche automaticamente com texto selecionado
chrome.storage.local.get(["selectedText"], (result) => {
  if (result.selectedText) {
    document.getElementById("inputText").value = result.selectedText;
  }
});
