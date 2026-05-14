import * as React from 'react';

export type UseIsInViewOptions = {
  inView?: boolean;
  inViewMargin?: string;
  inViewOnce?: boolean;
};

export function useIsInView(
  ref: React.Ref<HTMLElement>,
  { inView = false, inViewMargin = '0px', inViewOnce = true }: UseIsInViewOptions = {},
) {
  const localRef = React.useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = React.useState(!inView);

  React.useEffect(() => {
    if (!inView) return;

    const el = localRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (inViewOnce) observer.disconnect();
        } else if (!inViewOnce) {
          setIsInView(false);
        }
      },
      { rootMargin: inViewMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, inViewMargin, inViewOnce]);

  const setRef = React.useCallback(
    (node: HTMLElement | null) => {
      localRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref && typeof ref === 'object')
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    },
    [ref],
  );

  return { ref: setRef, isInView };
}
