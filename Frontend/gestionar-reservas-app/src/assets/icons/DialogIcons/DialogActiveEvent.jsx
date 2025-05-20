export function DialogActiveEventIcon({
  width = 24,
  height = 24,
  tickColor = "#33ce95",
  backgroundColor = "#193834",
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className="icon icon-tabler icons-tabler-filled icon-tabler-circle-check"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      {/* Fondo */}
      <path
        d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336z"
        fill={backgroundColor}
      />
      {/* Tick */}
      <path
        d="M15.707 9.293a1 1 0 0 0 -1.414 0l-3.293 3.292-1.293-1.292a1 1 0 1 0 -1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0 0-1.414z"
        fill={tickColor}
      />
    </svg>
  );
}
