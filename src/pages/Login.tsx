import { useEffect, useState } from "react";
import { Loader2, LogIn, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormValues } from "@/lib/validations";

export default function Login() {
  const { signIn, user, loading, demoMode } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (user && !demoMode && !loading) navigate("/", { replace: true });
  }, [demoMode, loading, navigate, user]);

  async function onSubmit(values: LoginFormValues) {
    setSubmitting(true);
    setMessage(null);
    const result = await signIn(values.email, values.password);
    setSubmitting(false);
    if (result.error) {
      setMessage(result.error);
      return;
    }
    navigate("/", { replace: true });
  }

  return (
    <AuthShell
      title="Entre para gerenciar empréstimos, consultar prazos e navegar pelo acervo."
      subtitle="Use sua conta Supabase para acessar o catálogo protegido, acompanhar seus empréstimos e solicitar novos títulos."
    >
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {demoMode ? (
          <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Demo mode ativo. Configure as variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para autenticação real.
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

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input id="password" type="password" placeholder="Sua senha" className="pl-11" {...form.register("password")} />
          </div>
          {form.formState.errors.password ? <p className="text-sm text-rose-600">{form.formState.errors.password.message}</p> : null}
        </div>

        {message ? <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</p> : null}

        <Button type="submit" className="w-full rounded-2xl" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          Entrar
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <Link to="/register" className="font-medium text-slate-900 hover:underline">
            Criar conta
          </Link>
          <Link to="/forgot-password" className="font-medium text-slate-900 hover:underline">
            Esqueci minha senha
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
