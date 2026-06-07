import { useEffect, useRef } from "react";

export default function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      node.style.setProperty("--reveal-opacity", "1");
      node.style.setProperty("--reveal-y", "0px");
      node.style.setProperty("--reveal-blur", "0px");
      node.style.setProperty("--reveal-scale", "1");
      node.classList.add("visible");
      return undefined;
    }

    let current = 0;
    let target = 0;
    let frame = 0;

    function clamp(value) {
      return Math.min(1, Math.max(0, value));
    }

    function apply(progress) {
      const eased = 1 - Math.pow(1 - progress, 3);
      node.style.setProperty("--reveal-opacity", eased.toFixed(3));
      node.style.setProperty("--reveal-y", `${((1 - eased) * 34).toFixed(2)}px`);
      node.style.setProperty("--reveal-blur", `${((1 - eased) * 10).toFixed(2)}px`);
      node.style.setProperty("--reveal-scale", (0.985 + eased * 0.015).toFixed(4));
      node.classList.toggle("visible", eased > 0.98);
    }

    function measure() {
      const rect = node.getBoundingClientRect();
      const viewport = window.innerHeight || document.documentElement.clientHeight;
      const start = viewport * 0.94;
      const end = viewport * 0.54;

      if (rect.bottom <= 0) {
        target = 1;
      } else {
        target = clamp((start - rect.top) / (start - end));
      }

      if (!frame) frame = requestAnimationFrame(tick);
    }

    function tick() {
      current += (target - current) * 0.18;
      if (Math.abs(target - current) < 0.002) current = target;
      apply(current);

      if (current !== target) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    }

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
