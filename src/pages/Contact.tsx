import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Clock3, Loader2, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactFormValues } from "@/lib/validations";

export default function Contact() {
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  async function onSubmit(values: ContactFormValues) {
    setSubmitting(true);
    setMessage(null);

    await new Promise((resolve) => window.setTimeout(resolve, 800));
    setMessage(`Mensagem enviada. Obrigado, ${values.name.split(" ")[0] || "leitor"}. Responderemos em breve.`);
    form.reset();
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <section className="space-y-4">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-400">Contato</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Fale com a equipe da biblioteca.</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600">
            Envie dúvidas, sugestões ou pedidos de apoio para empréstimos, reservas e acessibilidade.
          </p>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-4 text-sm text-slate-600">
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                  Rua das Letras, 120, Centro, Cidade - UF
                </p>
                <p className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 text-slate-400" />
                  Segunda a sexta, 08h às 18h
                </p>
                <a href="mailto:suporte@biblioteca.com" className="flex items-start gap-3 hover:text-slate-950">
                  <Mail className="mt-0.5 h-4 w-4 text-slate-400" />
                  suporte@biblioteca.com
                </a>
                <a href="tel:+550000000000" className="flex items-start gap-3 hover:text-slate-950">
                  <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
                  (00) 0000-0000
                </a>
                <a href="https://wa.me/550000000000" className="flex items-start gap-3 hover:text-slate-950">
                  <MessageCircle className="mt-0.5 h-4 w-4 text-slate-400" />
                  WhatsApp da biblioteca
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-100 px-6 py-4 text-sm font-medium text-slate-700">Mapa</div>
              <div className="flex min-h-64 items-center justify-center bg-[linear-gradient(135deg,rgba(15,23,42,0.04),rgba(15,23,42,0.1))] p-6">
                <div className="text-center text-slate-500">
                  <MapPin className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-3 text-sm font-medium text-slate-700">Localização da Biblioteca Aurora</p>
                  <p className="mt-1 text-sm">Substitua este bloco por um mapa estático no deploy final, se desejar.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-950">Mensagem rápida</h2>
            <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Seu nome" {...form.register("name")} />
                {form.formState.errors.name ? <p className="text-sm text-rose-600">{form.formState.errors.name.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="voce@exemplo.com" {...form.register("email")} />
                {form.formState.errors.email ? <p className="text-sm text-rose-600">{form.formState.errors.email.message}</p> : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Textarea id="message" placeholder="Como podemos ajudar?" {...form.register("message")} />
                {form.formState.errors.message ? <p className="text-sm text-rose-600">{form.formState.errors.message.message}</p> : null}
              </div>

              {message ? <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</p> : null}

              <Button type="submit" className="w-full rounded-2xl" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Enviar mensagem
              </Button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
