import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Digite um email válido."),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(3, "Informe seu nome completo."),
    email: z.string().email("Digite um email válido."),
    password: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
    confirmPassword: z.string().min(6, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas precisam ser iguais.",
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Digite um email válido."),
});

export const contactSchema = z.object({
  name: z.string().min(3, "Informe seu nome."),
  email: z.string().email("Digite um email válido."),
  message: z.string().min(10, "Sua mensagem deve ter ao menos 10 caracteres."),
});

export const loanRequestSchema = z.object({
  bookId: z.string().min(1, "Selecione um livro."),
  dueDate: z
    .string()
    .min(1, "Selecione o prazo.")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Informe uma data válida.")
    .refine((value) => new Date(value) > new Date(), "O prazo deve ser futuro."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
export type LoanRequestFormValues = z.infer<typeof loanRequestSchema>;
