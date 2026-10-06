const links = [
  { label: "GitHub", href: "https://github.com/Li-Zhi-4/poparide-demo" },
  {
    label: "Figma",
    href: "https://www.figma.com/design/0W8ANZLVT6abxA7QABrkAK/Poparide?node-id=10-4885",
  },
] as const;

/** Where the demo came from, shown under the price card. */
export function DemoLinks() {
  const [github, figma] = links.map(({ label, href }) => (
    <a
      key={label}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-blue-primary underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-primary"
    >
      {label}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  ));

  return (
    <p className="text-center text-sm text-blue-secondary">
      See the {github} and {figma} files that helped build this demo.
    </p>
  );
}
