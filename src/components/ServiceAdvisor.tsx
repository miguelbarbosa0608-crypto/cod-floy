import { useState, type FormEvent } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { ArrowRight, CheckCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { recommendServices, type Recomendacao } from '@/lib/recommend.functions';

// Consultor inteligente: o visitante descreve o negócio e recebe serviços e próximos passos.
export default function ServiceAdvisor() {
  const recommend = useServerFn(recommendServices);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Recomendacao | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true); setError(''); setResult(null);
    try {
      const r = await recommend({ data: { negocio: String(f.get('negocio') ?? ''), desafios: String(f.get('desafios') ?? '') } });
      if (r.ok) setResult(r.result); else setError(r.error);
    } catch {
      setError('Descreva com um pouco mais de detalhes (mínimo de 10 caracteres em cada campo).');
    } finally { setLoading(false); }
  }

  const field = 'form-field mt-2 block w-full px-4 py-3 text-sm font-normal placeholder:text-muted-foreground/55';
  return (
    <div className="feature-card mx-auto max-w-3xl p-6 sm:p-10">
      <form onSubmit={onSubmit} className="grid gap-5">
        <label className="block text-sm font-semibold text-foreground">Sobre o seu negócio
          <textarea name="negocio" required minLength={10} maxLength={1500} rows={3} className={field} placeholder="Ex.: Clínica odontológica em Goiânia, atendemos famílias e queremos mais pacientes de implante." />
        </label>
        <label className="block text-sm font-semibold text-foreground">Seus desafios de marketing
          <textarea name="desafios" required minLength={10} maxLength={1500} rows={3} className={field} placeholder="Ex.: Postamos no Instagram mas não vêm clientes; não temos site e perdemos contatos no WhatsApp." />
        </label>
        <Button type="submit" disabled={loading} className="btn-primary primary-glow h-13 w-full rounded-xl text-sm font-bold sm:text-base">
          {loading ? 'Analisando seu negócio...' : 'Receber Recomendação'} <Sparkles size={17} />
        </Button>
        {error && <p role="alert" className="text-sm text-primary">{error}</p>}
      </form>

      {result && (
        <div className="mt-8 space-y-6 border-t border-border pt-8" aria-live="polite">
          <p className="text-base leading-7 text-silver">{result.resumo}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.servicos.map((s) => (
              <div key={s.nome} className="rounded-xl border border-border bg-background/40 p-5">
                <h3 className="font-bold text-primary">{s.nome}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.motivo}</p>
              </div>
            ))}
          </div>
          <div>
            <h3 className="mb-3 font-bold text-foreground">Próximos passos</h3>
            <ol className="space-y-2">
              {result.proximos_passos.map((p, i) => (
                <li key={i} className="flex gap-3 text-sm leading-6 text-muted-foreground"><CheckCheck size={18} className="mt-0.5 shrink-0 text-primary" />{p}</li>
              ))}
            </ol>
          </div>
          <Button asChild className="btn-primary h-12 w-full rounded-xl font-bold"><a href="#contato">Solicitar Diagnóstico Gratuito <ArrowRight size={17} /></a></Button>
          <p className="text-center text-xs text-muted-foreground">Recomendação gerada por inteligência artificial — nossa equipe confirma tudo no diagnóstico.</p>
        </div>
      )}
    </div>
  );
}
