import { MDXRemote } from 'next-mdx-remote/rsc';

interface MdxContentProps {
  source: string;
}

export default function MdxContent({ source }: MdxContentProps) {
  if (!source || source.trim() === '') {
    return null;
  }

  return (
    <div className="prose prose-slate max-w-none">
      <MDXRemote source={source} />
    </div>
  );
}
