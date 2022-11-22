import { IconProps } from '../components/icon';

interface IconButtonProps<T> {
  handleClick: React.MouseEventHandler<SVGElement>;
  Icon: React.FC<T>;
  iconProps: T;
}

const IconButton: React.FC<IconButtonProps<IconProps>> = ({
  handleClick,
  Icon,
  iconProps,
}) => {
  return <Icon {...iconProps} handleClick={handleClick} />;
};

export default IconButton;
