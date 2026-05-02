import { CSSProperties, ReactNode } from 'react';

interface GridBlockProps {
  children: ReactNode;
  className?: string;
  spanClass?: string;
  style?: CSSProperties;
  href?: string;
  accent?: 'bronze' | 'chocolate' | 'saffron' | 'mint' | 'none';
  tag?: string;
  id?: string;
}

const accentBorderMap = {
  bronze: 'hover:border-[#cc5803]/40',
  chocolate: 'hover:border-[#e2711d]/40',
  saffron: 'hover:border-[#ff9505]/40',
  mint: 'hover:border-[#81C784]/30',
  none: 'hover:border-[#efede6]/20',
};

const accentBgMap = {
  bronze: 'hover:bg-[#cc5803]/[0.05]',
  chocolate: 'hover:bg-[#e2711d]/[0.05]',
  saffron: 'hover:bg-[#ff9505]/[0.05]',
  mint: 'hover:bg-[#81C784]/[0.04]',
  none: 'hover:bg-[#efede6]/[0.02]',
};

export default function GridBlock({
  children,
  className = '',
  spanClass = '',
  style,
  href,
  accent = 'none',
  tag,
  id,
}: GridBlockProps) {
  const base =
    'relative border border-[#efede6]/[0.08] border-dashed bg-[#221f1d] transition-colors duration-75 ' +
    accentBorderMap[accent] +
    ' ' +
    accentBgMap[accent];

  const inner = (
    <div id={href ? undefined : id} style={style} className={`${base} ${href ? 'cursor-pointer group' : ''} ${className}`}>
      {tag && (
        <span className="absolute top-4 left-5 text-[10px] tracking-[0.2em] uppercase text-[#68625c]">
          {tag}
        </span>
      )}
      {children}
    </div>
  );

  if (href) {
    return (
      <a id={id} href={href} className={`block ${spanClass}`}>
        {inner}
      </a>
    );
  }
  return inner;
}
