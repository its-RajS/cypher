interface AddOnCardProps {
  title: string;
  price: string;
  description: string;
  onClick?: () => void;
}

export default function AddOnCard({
  title,
  price,
  description,
  onClick,
}: AddOnCardProps) {
  return (
    <div
      className="rounded-md border border-border p-5 hover:border-[var(--brand-tertiary)] hover:bg-highlight dark:hover:border-[var(--brand-tertiary)] cursor-pointer transition"
      onClick={onClick}
    >
      <h4 className="font-semibold text-foreground mb-1">
        {title}
      </h4>
      <p className="text-sm text-muted-foreground mb-2">
        {description}
      </p>
      <span className="text-[var(--brand-primary-readable)] font-medium">{price}</span>
    </div>
  );
}
