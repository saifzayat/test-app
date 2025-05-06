import { HeroOrbit } from "../components2/HeroOrbit";
import JavascriptIcon from "@/assets/icons/square-js.svg";
import HTMLIcon from "@/assets/icons/html5.svg";
import CSSIcon from "@/assets/icons/css3.svg";
import ReactIcon from "@/assets/icons/react.svg";
import ChromeIcon from "@/assets/icons/chrome.svg";
import GithubIcon from "@/assets/icons/github.svg";
import ArduinoIcon from "@/assets/icons/arduino-svgrepo-com.svg";
import GitIcon from "@/assets/icons/git-svgrepo-com.svg";
import { TechIcon } from "../components2/TechIcon";
import { Card } from "../components2/Card";
import { CardHeader } from "../components2/CardHeader";
import { ToolBoxItems } from "../components2/ToolBoxItems";
const toolboxItems = [
  {
    title: "JavaScript",
    iconType: <JavascriptIcon />,
  },
  {
    title: "HTML5",
    iconType: <HTMLIcon />,
  },
  {
    title: "CSS3",
    iconType: <CSSIcon />,
  },
  {
    title: "React",
    iconType: <ReactIcon />,
  },
  {
    title: "Chrome",
    iconType: <ChromeIcon />,
  },
  {
    title: "Github",
    iconType: <GithubIcon />,
  },
  {
    title: "ArduinoIcon",
    iconType: <ArduinoIcon />,
  },
  {
    title: "GitIcon",
    iconType: <GitIcon />,
  },
];
export const Skills = () => {
  return (
    <div className="py-60 md:py-60 lg:py-80 relative z-0 overflow-x-clip">
      <div className="">
        <HeroOrbit
          size={250}
          rotation={45}
          shouldOrbit
          orbitDuration="48s"
          shouldSpin
          spinDuration="48s"
        >
          <JavascriptIcon className="size-10 " />
        </HeroOrbit>
        <HeroOrbit
          size={250}
          rotation={225}
          shouldOrbit
          orbitDuration="48s"
          shouldSpin
          spinDuration="48s"
        >
          <ReactIcon className="size-10 " />
        </HeroOrbit>
        <HeroOrbit
          size={250}
          rotation={90}
          shouldOrbit
          orbitDuration="48s"
          shouldSpin
          spinDuration="48s"
        >
          <ArduinoIcon className="size-10" />
        </HeroOrbit>
        <HeroOrbit
          size={250}
          rotation={270}
          shouldOrbit
          orbitDuration="48s"
          shouldSpin
          spinDuration="48s"
        >
          <GitIcon className="size-10" />
        </HeroOrbit>
        <HeroOrbit
          size={250}
          rotation={135}
          shouldOrbit
          orbitDuration="48s"
          shouldSpin
          spinDuration="48s"
        >
          <GithubIcon className="size-10" />
        </HeroOrbit>
        <HeroOrbit
          size={250}
          rotation={315}
          shouldOrbit
          orbitDuration="48s"
          shouldSpin
          spinDuration="48s"
        >
          <CSSIcon className="size-10" />
        </HeroOrbit>
        <HeroOrbit
          size={250}
          rotation={0}
          shouldOrbit
          orbitDuration="48s"
          shouldSpin
          spinDuration="48s"
        >
          <HTMLIcon className="size-10" />
        </HeroOrbit>
        <HeroOrbit
          size={250}
          rotation={180}
          shouldOrbit
          orbitDuration="48s"
          shouldSpin
          spinDuration="48s"
        >
          <ChromeIcon className="size-10" />
        </HeroOrbit>
      </div>
    </div>
  );
};
