import { Mail } from "lucide-react";

export default function EmailSupportButton({ email = "support@quntamgen.com" }: { email?: string }) {
  return (
    <a
      href={`mailto:${email}`}
      aria-label="Email our support team"
      className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center justify-center w-14 h-14 rounded-full bg-brand-gradient text-white shadow-glow"
    >
      <span className="absolute inset-0 rounded-full bg-brand-gradient animate-pulseSoft -z-10" aria-hidden="true" />
      <Mail className="w-6 h-6" />
    </a>
  );
}
