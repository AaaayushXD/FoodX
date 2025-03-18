import { Icons } from "@/utils";

export const StarRating = ({
  rating,
  size,
}: {
  rating: number;
  size: "1" | "2" | "3" | "4" | "5" | "6";
  }) => {
  const iconsSize = `size-${size}`;
  return (
    <div className="flex items-center gap-0.5 justify-start">
      {[...Array(5)].map((_, i) => (
        <Icons.tomato
          key={i}
          className={`${iconsSize} ${
            i < Math.round(rating)
              ? "fill-red-600 text-[var(--secondary-color)] "
              : "text-green-500 fill-green-500  "
          }`}
        />
      ))}
    </div>
  );
};
