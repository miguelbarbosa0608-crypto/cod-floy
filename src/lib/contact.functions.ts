// Gravação OPCIONAL do contato no Supabase (tabela contact_leads), feita no servidor.
// O destino principal dos contatos é o Netlify Forms (src/lib/netlifyForms.ts).
// Só grava se SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY existirem no ambiente; sem elas,
// devolve { salvo: false } sem erro, e o envio segue normalmente pelo Netlify Forms.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\+?[\d\s()\-]{10,20}$/),
  email: z.string().trim().email().max(200),
  company: z.string().trim().min(2).max(160),
  website: z.string().max(200).optional(),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input) => contactSchema.parse(input))
  .handler(async ({ data }): Promise<{ salvo: boolean }> => {
    if (data.website) return { salvo: false }; // robô (honeypot preenchido)
    if (!process.env["SUPABASE_URL"] || !process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
      return { salvo: false }; // Supabase não configurado: o Netlify Forms recebe o contato
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_leads").insert({
      name: data.name,
      whatsapp: data.whatsapp,
      email: data.email,
      company: data.company,
    });
    if (error) {
      console.error("Contact submission failed", error);
      throw new Error("Não foi possível enviar sua solicitação. Tente novamente.");
    }
    return { salvo: true };
  });
