'use client';
import { Children, cloneElement, isValidElement, useEffect, useRef, useState } from 'react';

// Scroll-reveal wrapper. Backward compatible: <Reveal delay={n}> still fades up.
// variant: 'up' | 'fade' | 'left' | 'right' | 'scale' | 'blur' | 'clip'
// stagger: when set (ms), direct children animate in sequence.
export default function Reveal({
  children,
  className = '',
  delay = 0,
  variant = 'up',
  stagger = 0,
  amount = 0.15,
  as: Tag = 'div',
}) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVis(true);
          o.disconnect();
        }
      },
      { threshold: amount, rootMargin: '0px 0px -8% 0px' }
    );
    o.observe(el);
    return () => o.disconnect();
  }, [amount]);

  const cls = `reveal ${vis ? 'in' : ''} ${className}`;

  if (stagger > 0) {
    const kids = Children.toArray(children).filter(isValidElement);
    return (
      <Tag ref={ref} className={cls} data-v={variant}>
        {kids.map((child, i) =>
          cloneElement(child, {
            key: child.key ?? i,
            className: `reveal-item ${child.props.className || ''}`.trim(),
            style: { ...(child.props.style || {}), transitionDelay: `${delay + i * stagger}ms` },
          })
        )}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={cls} data-v={variant} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}
