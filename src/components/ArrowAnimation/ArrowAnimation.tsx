import './arrow.modules.css';

export function ArrowAnimation({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div>{children}</div>
      <div>
        <svg width="400" viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            id="arrow-line"
            className="arrow-path"
            pathLength="100"
            d="M95 5C93.5 15 86.5 32.4118 65 40C43.5 47.5882 25 47 5 31.5"
            stroke="black"
            strokeLinecap="round"
          />
          <path id="arrow-head-1" className="arrow-path" d="M4 31L8 41" pathLength="100" />
          <path id="arrow-head-2" className="arrow-path" d="M4 31H15" pathLength="100" />
        </svg>
      </div>
    </div>
  );
}
