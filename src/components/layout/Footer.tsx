import { Globe2, Mail, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const socialLinks = [
  { href: "https://instagram.com", label: "Instagram", icon: Globe2 },
  { href: "https://x.com", label: "X", icon: Globe2 },
  { href: "https://linkedin.com", label: "LinkedIn", icon: Globe2 },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-900">Biblioteca Aurora</p>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            Empréstimos, leitura e descoberta em uma experiência simples, rápida e feita para o dia a dia.
          </p>
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Contato</p>
          <a href="mailto:biblioteca@exemplo.com" className="flex items-center gap-2 hover:text-slate-950">
            <Mail className="h-4 w-4" />
            suporte@biblioteca.com
          </a>
          <a href="tel:+550000000000" className="flex items-center gap-2 hover:text-slate-950">
            <Phone className="h-4 w-4" />
            (00) 0000-0000
          </a>
          <a href="https://wa.me/550000000000" className="flex items-center gap-2 hover:text-slate-950">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>

        <div className="space-y-3 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Redes sociais</p>
          <div className="flex flex-wrap gap-2">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </a>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link to="/about" className="hover:text-slate-950">
              Quem Somos
            </Link>
            <Link to="/contact" className="hover:text-slate-950">
              Contato
            </Link>
            <Link to="/loans" className="hover:text-slate-950">
              Empréstimos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
