import { useEffect, useState } from "react";
import { Loader2, KeyRound, Mail, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations";

export default function ForgotPassword() {
  const { resetPassword, user, loading, demoMode } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (user && !demoMode && !loading) navigate("/", { replace: true });
  }, [demoMode, loading, navigate, user]);

  async function onSubmit(values: ForgotPasswordFormValues) {
    setSubmitting(true);
    setMessage(null);
    const result = await resetPassword(values.email);
    setSubmitting(false);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    setMessage("Enviamos um link de redefinição para seu email.");
  }

  return (
    <AuthShell
      title="Redefina sua senha e volte ao acervo em poucos passos."
      subtitle="Digite seu email e receba um link seguro de recuperação enviado pelo Supabase Auth."
    >
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {demoMode ? (
          <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Demo mode ativo. A recuperação real de senha exige Supabase configurado.
          </p>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input id="email" type="email" placeholder="voce@exemplo.com" className="pl-11" {...form.register("email")} />
          </div>
          {form.formState.errors.email ? <p className="text-sm text-rose-600">{form.formState.errors.email.message}</p> : null}
        </div>

        {message ? <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</p> : null}

        <Button type="submit" className="w-full rounded-2xl" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          Enviar link
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <Link to="/login" className="font-medium text-slate-900 hover:underline">
            Voltar para login
          </Link>
          <Link to="/register" className="inline-flex items-center gap-1 font-medium text-slate-900 hover:underline">
            Criar conta <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
