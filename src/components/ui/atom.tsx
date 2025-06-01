
import * as React from "react";

interface AtomProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export const Atom = React.forwardRef<SVGSVGElement, AtomProps>(
  ({ className, ...props }, ref) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      ref={ref}
      {...props}
    >
      <circle cx="12" cy="12" r="1" />
      <path d="M20.2 20.2c2.04-2.03 2.77-4.86 2.04-7.44C21.46 10.18 19.5 8 16.88 6.22c-1.7-1.16-3.9-2.26-6.3-2.97-1.94-.57-3.87-.66-5.33-.04-1.92.81-3.06 2.76-3.06 5.26 0 2.28.95 4.74 2.51 7.03 1.5 2.18 3.56 4.18 5.76 5.56 1.74 1.1 3.56 1.82 5.25 2 1.44.17 2.78-.05 3.94-.67 1.3-.7 2.2-1.88 2.55-3.35" />
      <path d="M12.73 12.73a3.5 3.5 0 0 0 4.9-4.9" />
      <path d="M6.37 6.37a3.5 3.5 0 0 0-4.9 4.9" />
      <path d="M17.63 17.63a3.5 3.5 0 0 1-4.9 4.9" />
    </svg>
  )
);

Atom.displayName = "Atom";

export default Atom;
