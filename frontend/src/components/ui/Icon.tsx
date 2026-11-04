import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons, type IconName } from "@/constants";

config.autoAddCss = false;

type IconProps = {
  name: IconName;
  className?: string;
};

const Icon = ({ name, className }: IconProps) => {
  // An API may send a name this build does not know yet.
  return <FontAwesomeIcon icon={icons[name] ?? icons.info} className={className} />;
};

export default Icon;
