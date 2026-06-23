export type CollectionViewState =
  | "loading"
  | "refreshing"
  | "empty"
  | "ready"
  | "error";

type ResolveCollectionViewStateArgs<T> = {
  items: T[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  error?: string | null;
};

export function resolveCollectionViewState<T>({
  items,
  isLoading = false,
  isRefreshing = false,
  error = null,
}: ResolveCollectionViewStateArgs<T>): CollectionViewState {
  const hasItems = items.length > 0;

  if (isLoading && !hasItems) {
    return "loading";
  }

  if (error && !hasItems) {
    return "error";
  }

  if (!hasItems) {
    return "empty";
  }

  if (isRefreshing) {
    return "refreshing";
  }

  return "ready";
}
