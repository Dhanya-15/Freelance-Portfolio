export default function ProjectLogo({ project, className = 'h-10 w-10' }) {
  if (project.logo) {
    return <img src={project.logo} alt="" className={`${className} rounded-xl object-contain`} />;
  }
  const initials = project.name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className={`${className} grid place-items-center rounded-xl bg-[#1a1817] text-[13px] font-bold text-[#f3efe9]`}
    >
      {initials}
    </span>
  );
}