import { useEffect, useState } from "react";
import { Loader2, UserPlus, Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterFormValues } from "@/lib/validations";

export default function Register() {
  const { signUp, user, loading, demoMode } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (user && !demoMode && !loading) navigate("/", { replace: true });
  }, [demoMode, loading, navigate, user]);

  async function onSubmit(values: RegisterFormValues) {
    setSubmitting(true);
    setMessage(null);
    const result = await signUp({ fullName: values.fullName, email: values.email, password: values.password });
    setSubmitting(false);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    if (result.needsEmailConfirmation) {
      setMessage("Conta criada. Verifique seu email para confirmar o acesso.");
      window.setTimeout(() => navigate("/login", { replace: true }), 1800);
      return;
    }

    navigate("/", { replace: true });
  }

  return (
    <AuthShell
      title="Crie sua conta e acompanhe empréstimos, prazos e favoritos com segurança."
      subtitle="O cadastro usa Supabase Auth e salva o perfil automaticamente na tabela profiles com RLS ativo."
    >
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        {demoMode ? (
          <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Demo mode ativo. A criação real de contas depende do backend Supabase configurado.
          </p>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="fullName">Nome completo</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input id="fullName" placeholder="Seu nome" className="pl-11" {...form.register("fullName")} />
          </div>
          {form.formState.errors.fullName ? <p className="text-sm text-rose-600">{form.formState.errors.fullName.message}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input id="email" type="email" placeholder="voce@exemplo.com" className="pl-11" {...form.register("email")} />
          </div>
          {form.formState.errors.email ? <p className="text-sm text-rose-600">{form.formState.errors.email.message}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input id="password" type="password" placeholder="Senha" className="pl-11" {...form.register("password")} />
            </div>
            {form.formState.errors.password ? <p className="text-sm text-rose-600">{form.formState.errors.password.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input id="confirmPassword" type="password" placeholder="Repita a senha" className="pl-11" {...form.register("confirmPassword")} />
            </div>
            {form.formState.errors.confirmPassword ? <p className="text-sm text-rose-600">{form.formState.errors.confirmPassword.message}</p> : null}
          </div>
        </div>

        {message ? <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</p> : null}

        <Button type="submit" className="w-full rounded-2xl" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Criar conta
        </Button>

        <div className="text-sm text-slate-600">
          Já tem cadastro? <Link to="/login" className="font-medium text-slate-900 hover:underline">Entrar</Link>
        </div>
      </form>
    </AuthShell>
  );
}
