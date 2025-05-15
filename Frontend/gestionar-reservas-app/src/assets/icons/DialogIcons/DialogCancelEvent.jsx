export function DialogCancelEventIcon({
  width = 24,
  height = 24,
  iconColor = "#fc7975",
  backgroundColor = "#4d0806",
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
    >
      {/* Fondo circular */}
      <circle cx="12" cy="12" r="12" fill={backgroundColor} />

      {/* Ícono de cubo de basura */}
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M4 7l16 0"
        stroke={iconColor}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 11l0 6"
        stroke={iconColor}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11l0 6"
        stroke={iconColor}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
        stroke={iconColor}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"
        stroke={iconColor}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
