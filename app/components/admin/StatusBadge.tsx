interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    draft: "bg-yellow-100 text-yellow-700",
    archived: "bg-red-100 text-red-700",
    paid: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-purple-100 text-purple-700",
  };

  const normalizedStatus = status.toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium capitalize ${
        colors[normalizedStatus] ??
        "bg-neutral-100 text-neutral-700"
      }`}
    >
      {status}
    </span>
  );
}