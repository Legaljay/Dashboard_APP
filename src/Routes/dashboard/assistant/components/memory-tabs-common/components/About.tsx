import Common from "..";
import AboutTemplate from "../memory-modals/AboutTemplate";

const About: React.FC = () => {
    return (
        <Common tab="about" template={AboutTemplate}/>
    )
};

export default About;