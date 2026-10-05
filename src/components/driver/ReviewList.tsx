import Image from "next/image";
import { formatDate } from "@/lib/format";
import type { Review } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const roleLabel: Record<Review["role"], string> = {
  passenger: "Passenger Review",
  driver: "Driver Review",
};

export function ReviewList({
  reviews,
  total,
}: {
  reviews: Review[];
  total: number;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <h3 className="text-base font-bold">Reviews</h3>
        <ul className="flex flex-col gap-2">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="flex items-start gap-6 desktop:items-center"
            >
              <Image
                src={review.author.avatarUrl}
                alt=""
                width={64}
                height={64}
                className="size-16 shrink-0 rounded-full object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1 text-base">
                <div>
                  {/* Mobile stacks the rating above the name; desktop puts it at the end of the row. */}
                  <div className="flex flex-col items-start gap-1 desktop:flex-row desktop:items-center">
                    <p className="flex items-center gap-2 desktop:flex-1">
                      <span className="font-semibold">
                        {review.author.name}
                      </span>
                      <span
                        aria-hidden
                        className="size-0.75 rounded-full bg-blue-primary"
                      />
                      <span className="text-neutral-500">
                        {roleLabel[review.role]}
                      </span>
                    </p>
                    <p className="flex items-center gap-1 font-semibold max-desktop:order-first">
                      <Icon name="star" box={18} />
                      <span className="sr-only">Rated </span>
                      {review.rating.toFixed(1)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {review.route}
                    <span className="max-desktop:hidden"> on</span>{" "}
                    <time dateTime={review.date} className="max-desktop:block">
                      {formatDate(review.date)}
                    </time>
                  </p>
                </div>
                <p className="text-neutral-500">{review.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Button className="self-start">Show all {total} reviews</Button>
    </div>
  );
}
