import { useEffect, useRef } from 'react';
import logoUrl from '../assets/batch_mono.svg';

type Size = 'sm' | 'md' | 'lg' | 'xl';

const dims: Record<Size, string> = {
  sm: 'w-6 h-8',
  md: 'w-10 h-14',
  lg: 'w-20 h-24',
  xl: 'w-40 h-52',
};

const PATH =
  'm46.15,109.62s0,11.02,0,17.86c0,3.72,2.06,7.16,4.72,8.96,5.96,4.04,10.97,5.09,18.73,5.09,20.28,0,36.72-16.31,36.72-36.43s-16.44-36.43-36.72-36.43c-8.92,0-17.09,3.15-23.45,8.4h0V14.93c0-5.75-4.66-10.41-10.41-10.41-5.75,0-10.41,4.66-10.41,10.41v115.58c0,5.71-4.6,10.36-10.31,10.41-5.79.05-10.5-4.62-10.5-10.41V5.82';

export function LogoImage({ size = 'md' }: { size?: Size }) {
  return (
    <img
      src={logoUrl}
      alt="batch"
      className={`${dims[size]} object-contain`}
    />
  );
}

interface LogoAnimatedProps {
  size?: Size;
  color?: string;
}

export function LogoAnimated({ size = 'md', color = 'white' }: LogoAnimatedProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const len = p.getTotalLength();
    p.style.strokeDasharray = String(len);
    p.style.strokeDashoffset = String(-len);
    const raf = requestAnimationFrame(() => {
      p.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(0.4,0,0.2,1) 0.3s';
      p.style.strokeDashoffset = '0';
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={dims[size]}>
      <svg
        viewBox="0 0 110.84 146.06"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <path
          ref={pathRef}
          d={PATH}
          stroke={color}
          strokeWidth="9.04"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

export default LogoImage;
