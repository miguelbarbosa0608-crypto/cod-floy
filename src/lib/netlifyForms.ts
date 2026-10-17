// Envio do formulário de contato para o Netlify Forms.
// Os contatos ficam em Netlify > projeto > Forms > "contato", e a Netlify pode mandar cada envio
// por e-mail (Forms > Submission notifications). O campo "email" vira o Reply-to do aviso,
// então dá para responder direto ao cliente.
// O formulário de detecção fica em public/__forms.html (os nomes dos campos precisam bater).

export const NOME_FORMULARIO = "contato";
// Caminho estático: num site com SSR, enviar para "/" cairia na função de servidor, não no Forms.
export const CAMINHO_FORMULARIO = "/__forms.html";
// Assunto do e-mail de aviso (%{submissionId} é trocado pela Netlify pelo número do envio).
export const ASSUNTO_EMAIL = "Novo contato pelo site Code Flow (%{submissionId})";

export type DadosContato = {
  name: string;
  whatsapp: string;
  email: string;
  company: string;
  website: string; // armadilha anti-robô (honeypot): pessoas não preenchem
};

/** Envia para o Netlify Forms. Devolve true se a Netlify aceitou o envio. */
export async function enviarParaNetlifyForms(dados: DadosContato): Promise<boolean> {
  const corpo = new URLSearchParams({
    "form-name": NOME_FORMULARIO,
    subject: ASSUNTO_EMAIL,
    ...dados,
  });
  const resposta = await fetch(CAMINHO_FORMULARIO, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: corpo.toString(),
  });
  return resposta.ok;
}
