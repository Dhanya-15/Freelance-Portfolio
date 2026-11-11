import { forwardRef } from 'react';

// Full-screen warm light that covers the view swap. Opacity is driven by GSAP.
const PortalTransition = forwardRef(function PortalTransition(_, ref) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] opacity-0"
      style={{ background: 'radial-gradient(circle at 50% 50%, #fffaf0 0%, #f9e9bd 55%, #f1d594 100%)' }}
    />
  );
});

export default PortalTransition;