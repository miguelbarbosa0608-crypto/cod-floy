import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  whatsapp: z.string().trim().regex(/^\+?[\d\s()\-]{10,20}$/),
  email: z.string().trim().email().max(200),
  company: z.string().trim().min(2).max(160),
  website: z.string().max(200).optional(),
});

export const submitContact = createServerFn({ method: 'POST' })
  .inputValidator((input) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website) return { success: true };
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { error } = await supabaseAdmin.from('contact_leads').insert({
      name: data.name,
      whatsapp: data.whatsapp,
      email: data.email,
      company: data.company,
    });
    if (error) {
      console.error('Contact submission failed', error);
      throw new Error('Não foi possível enviar sua solicitação. Tente novamente.');
    }
    return { success: true };
  });
