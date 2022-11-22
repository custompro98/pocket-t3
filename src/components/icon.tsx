export interface IconProps {
  filled?: boolean;
  fillColor?: string;
  handleClick?: React.MouseEventHandler<SVGElement>;
}

const StarIcon: React.FC<IconProps> = ({
  filled,
  fillColor = "none",
  handleClick: onClick,
}) => {
  const fill = filled ? fillColor : "none";
  const size = 24;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      strokeWidth="1"
      stroke="currentColor"
      fill={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={onClick}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
    </svg>
  );
};

export { StarIcon };
