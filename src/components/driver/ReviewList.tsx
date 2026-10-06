import Image from "next/image";
import { formatDate } from "@/lib/format";
import type { Review } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

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
            <li key={review.id} className="flex items-center gap-6">
              <Image
                src={review.author.avatarUrl}
                alt=""
                width={64}
                height={64}
                className="size-16 shrink-0 rounded-full object-cover"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1 text-base">
                <div>
                  <div className="flex items-center gap-1">
                    <p className="min-w-0 flex-1 font-bold">
                      {review.author.name}
                    </p>
                    <Icon name="star" box={18} />
                    <p className="font-semibold">
                      <span className="sr-only">Rated </span>
                      {review.rating.toFixed(1)}
                    </p>
                  </div>
                  <p className="text-sm text-neutral-500">
                    {review.route} on{" "}
                    <time dateTime={review.date}>
                      {formatDate(review.date)}
                    </time>
                  </p>
                </div>
                <p>{review.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Button className="self-start">Show all {total} reviews</Button>
    </div>
  );
}
