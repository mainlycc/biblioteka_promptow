/* eslint-disable @next/next/no-img-element */
import { Suspense } from "react";
import {
  enrichTweet,
  type EnrichedTweet,
  type TweetProps,
  type TwitterComponents,
} from "react-tweet";
import { getTweet, type Tweet } from "react-tweet/api";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CopyButton from "./comp-105";

interface TwitterIconProps {
  className?: string;
  [key: string]: unknown;
}

const Verified = ({ className, ...props }: TwitterIconProps) => (
  <svg
    aria-label="Verified Account"
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <g fill="currentColor">
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
    </g>
  </svg>
);

export const truncate = (str: string | null, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length - 3)}...`;
};

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("rounded-md bg-primary/10", className)} {...props} />
  );
};

export const TweetSkeleton = ({
  className,
  ...props
}: {
  className?: string;
  [key: string]: unknown;
}) => (
  <div
    className={cn(
      "flex size-full max-h-max min-w-72 flex-col gap-2 rounded-lg border p-4",
      className,
    )}
    {...props}
  >
    <div className="flex flex-row gap-2">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-20 w-full" />
  </div>
);

export const TweetNotFound = ({
  className,
  ...props
}: {
  className?: string;
  [key: string]: unknown;
}) => (
  <div
    className={cn(
      "flex size-full flex-col items-center justify-center gap-2 rounded-lg border p-4",
      className,
    )}
    {...props}
  >
    <h3>Tweet not found</h3>
  </div>
);

export const TweetHeader = ({ tweet }: { tweet: EnrichedTweet }) => {
  // Pobierz pierwsze 50 znaków z opisu jako nazwę promptu
  const promptName = tweet.text.split('\n')[0].slice(0, 50) + (tweet.text.split('\n')[0].length > 50 ? '...' : '');
  
  return (
    <div className="flex flex-row justify-between tracking-tight px-4 pt-2">
      <div className="w-full">
        <h3 className="font-semibold text-base text-black text-center">{promptName}</h3>
      </div>
    </div>
  );
};

export const TweetBody = () => null;

export const TweetMedia = ({ tweet }: { tweet: EnrichedTweet }) => {
  if (!tweet.video && !tweet.photos) return null;
  
  const photos = tweet.photos || [];
  const photoCount = photos.length;

  return (
    <div className="flex flex-1 items-center justify-center px-4 pt-2">
      {tweet.video && (
        <video
          poster={tweet.video.poster}
          autoPlay
          loop
          muted
          playsInline
          className="rounded-xl border shadow-sm w-full aspect-square object-cover"
        >
          <source src={tweet.video.variants[0].src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {photos.length > 0 && (
        <div className="grid w-full aspect-square gap-2" style={{
          gridTemplateColumns: photoCount === 1 ? '1fr' : '1fr 1fr',
          gridTemplateRows: photoCount === 1 ? '1fr' : photoCount <= 2 ? '1fr' : '1fr 1fr'
        }}>
          {photos.map((photo, index) => (
            <img
              key={photo.url}
              src={photo.url}
              title={"Photo by " + tweet.user.name}
              alt={tweet.text}
              className="w-full h-full object-cover rounded-xl border shadow-sm"
              style={{
                gridColumn: photoCount === 1 ? '1 / -1' : 'span 1',
                gridRow: photoCount === 1 ? '1 / -1' : photoCount <= 2 ? '1 / -1' : index < 2 ? '1' : '2'
              }}
            />
          ))}
        </div>
      )}
      {!tweet.video &&
        !photos.length &&
        // @ts-ignore
        tweet?.card?.binding_values?.thumbnail_image_large?.image_value.url && (
          <img
            src={
              // @ts-ignore
              tweet.card.binding_values.thumbnail_image_large.image_value.url
            }
            className="w-full aspect-square rounded-xl border object-cover shadow-sm"
            alt={tweet.text}
          />
        )}
    </div>
  );
};

export const TweetFooter = ({ tweet }: { tweet: EnrichedTweet }) => (
  <div className="flex flex-row items-center justify-between mt-auto px-4 py-2 border-t">
    <div className="flex items-center gap-1">
      <img
        title={`Profile picture of ${tweet.user.name}`}
        alt={tweet.user.screen_name}
        height={20}
        width={20}
        src={tweet.user.profile_image_url_https}
        className="overflow-hidden rounded-full border border-transparent"
      />
      <div>
        <a
          href={tweet.user.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center whitespace-nowrap font-semibold text-sm text-black"
        >
          {truncate(tweet.user.name, 20)}
          {tweet.user.verified ||
            (tweet.user.is_blue_verified && (
              <Verified className="ml-1 inline size-3 text-blue-500" />
            ))}
        </a>
        <div className="flex items-center space-x-1">
          <a
            href={tweet.user.url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-muted-foreground transition-all duration-75"
          >
            @{truncate(tweet.user.screen_name, 16)}
          </a>
        </div>
      </div>
    </div>
    <CopyButton
      text={tweet.text}
    />
  </div>
);

export const MagicTweet = ({
  tweet,
  className,
}: {
  tweet: Tweet;
  components?: TwitterComponents;
  className?: string;
}) => {
  const enrichedTweet = enrichTweet(tweet);
  return (
    <Card className={cn(
      "relative flex size-full max-w-lg flex-col gap-2 overflow-hidden min-h-[300px] border-[color:var(--main-orange)]",
      className,
    )}>
      <TweetHeader tweet={enrichedTweet} />
      <TweetBody />
      <TweetMedia tweet={enrichedTweet} />
      <TweetFooter tweet={enrichedTweet} />
    </Card>
  );
};

/**
 * TweetCard (Server Side Only)
 */
export const TweetCard = async ({
  id,
  components,
  fallback = <TweetSkeleton />,
  onError,
  ...props
}: TweetProps & {
  className?: string;
}) => {
  const tweet = id
    ? await getTweet(id).catch((err) => {
        if (onError) {
          onError(err);
        } else {
          console.error(err);
        }
        return undefined;
      })
    : undefined;

  if (!tweet) {
    const NotFound = components?.TweetNotFound || TweetNotFound;
    return <NotFound {...props} />;
  }

  return (
    <Suspense fallback={fallback}>
      <MagicTweet tweet={tweet} {...props} />
    </Suspense>
  );
}; 