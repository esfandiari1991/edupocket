import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { AnchorHTMLAttributes } from "react";

type MDXContentProps = {
  source: string;
};

const components = {
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} className="text-amber-200 underline decoration-amber-300/40 underline-offset-4 transition hover:text-amber-100" />
  ),
};

export async function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose-edupocket">
      <MDXRemote source={source} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} components={components} />
    </div>
  );
}
