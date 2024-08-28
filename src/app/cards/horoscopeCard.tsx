import Image from "next/image";
import { MouseEventHandler } from "react";

const HoroscopeCard = ({
  name,
  icon,
  onClick,
}: {
  name: string;
  icon: string;
  onClick: MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col justify-center items-center border-2 p-12 w-1/2 h-1/2"
    >
      <Image src={icon} alt={`${name} icon`} width={64} height={64} />
      <h3>{name}</h3>
    </div>
  );
};

export default HoroscopeCard;
