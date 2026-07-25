import { Check, X } from "@/components/common/icons";

interface FeatureItem {
  label: string;
  available?: boolean;
}

interface PaymentCardProps {
  name: string;
  price: string;
  features: (string | FeatureItem)[];
  isFree?: boolean;
  highlighted?: boolean;
  isCurrent?: boolean;
  onClick?: () => void;
}

export default function PaymentCard({
  name,
  price,
  features,
  isFree,
  highlighted,
  isCurrent,
  onClick,
}: PaymentCardProps) {
  return (
    <div
      className={`relative rounded-md border p-5 transition hover:shadow-md cursor-pointer ${
        highlighted
          ? "palette-info"
          : "border-border"
      }`}
    >
      {/* Current Plan Badge */}
      {isCurrent && (
        <span className="absolute top-2 right-2 text-xs font-medium bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
          Current Plan
        </span>
      )}

      {/* Title and Price */}
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {name}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {isFree ? "Forever Free" : `${price}/month`}
      </p>

      {/* Features */}
      <ul className="space-y-2 text-sm">
        {features.map((f, i) => {
          const item: FeatureItem =
            typeof f === "string" ? { label: f, available: true } : f;
          return (
            <li
              key={i}
              className={`flex items-center gap-2 ${
                item.available === false
                  ? "text-muted-foreground line-through"
                  : "text-foreground"
              }`}
            >
              {item.available === false ? (
                <X className="w-4 h-4 text-destructive" />
              ) : (
                <Check className="w-4 h-4 text-[var(--brand-primary-readable)]" />
              )}
              {item.label}
            </li>
          );
        })}
      </ul>

      {/* Action Button */}
      {!isCurrent && (
        <button
          onClick={onClick}
          className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 rounded-md transition"
        >
          Select Plan
        </button>
      )}
    </div>
  );
}
