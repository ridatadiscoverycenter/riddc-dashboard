type Size = 'sm' | 'md' | 'lg' | 'xl' | 'hero';
type Variant = 'normal' | 'impact' | 'accent';
type ColorMode = 'light' | 'dark';
type HeaderProps = {
  size: Size;
  variant?: Variant;
  tag?: `h${1 | 2 | 3 | 4 | 5}`;
  className?: string;
  colorMode?: ColorMode;
  id?: string;
};

export function Header({
  children,
  size,
  variant = 'normal',
  tag = 'h2',
  className = '',
  colorMode,
  id,
}: React.PropsWithChildren<HeaderProps>) {
  const classString = `${className} ${sizeTailwindClass(size)} ${variantTailwindClass(variant, colorMode)}`;
  if (tag === 'h1')
    return (
      <h1 className={classString} id={id}>
        {children}
      </h1>
    );
  if (tag === 'h3')
    return (
      <h3 className={classString} id={id}>
        {children}
      </h3>
    );
  if (tag === 'h4')
    return (
      <h4 className={classString} id={id}>
        {children}
      </h4>
    );
  if (tag === 'h5')
    return (
      <h5 className={classString} id={id}>
        {children}
      </h5>
    );
  // tag === "h2"
  return (
    <h2 className={classString} id={id}>
      {children}
    </h2>
  );
}

function sizeTailwindClass(size: Size) {
  if (size === 'sm') return 'text-xl';
  if (size === 'md') return 'text-2xl';
  if (size === 'lg') return 'text-3xl';
  if (size === 'xl') return 'text-4xl';
  // size === "hero"
  return 'text-7xl';
}

function variantTailwindClass(variant: Variant, colorMode: ColorMode | undefined) {
  const light = 'text-black';
  const dark = 'text-white';
  const darkWithDarkSpecifier = 'dark:text-white';
  const colors =
    colorMode === undefined
      ? `${light} ${darkWithDarkSpecifier}`
      : colorMode === 'light'
        ? light
        : dark;
  if (variant === 'impact') return `font-extrabold ${colors}`;
  if (variant === 'accent') {
    const accentLight = 'text-cyan-600';
    const accentDark = 'text-cyan-200';
    // Note (AM): Tailwind will not create a class dark text color if the full
    // string isn't somewhere in the codebase. So, this cannot be string
    // parsed and needs to be written explicitly.
    const accentDarkWithDarkSpecifier = 'dark:text-cyan-200';
    const accentColors =
      colorMode === undefined
        ? `${accentLight} ${accentDarkWithDarkSpecifier}`
        : colorMode === 'light'
          ? accentLight
          : accentDark;
    return `font-semibold ${accentColors}`;
  }
  // variant === 'normal'
  return `font-light ${colors}`;
}
