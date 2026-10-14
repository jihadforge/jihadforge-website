import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export default function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
        </div>

        <div className="rounded-lg bg-neutral-100 p-3">
          {icon}
        </div>
      </div>
    </div>
  );
}