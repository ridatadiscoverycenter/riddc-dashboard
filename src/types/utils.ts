type NextPageDefaultProps = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};
export type PageProps<T = unknown> = NextPageDefaultProps & T;
