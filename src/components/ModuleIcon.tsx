import { BookOpen, Calculator, PenLine, type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  BookOpen,
  PenLine,
  Calculator,
};

export function ModuleIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? BookOpen;
  return <Icon className={className} />;
}
