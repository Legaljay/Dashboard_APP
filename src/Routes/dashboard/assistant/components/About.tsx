import Common from "./memory-tabs-common";
import AboutTemplate from "./memory-tabs-common/memory-modals/AboutTemplate";

const About: React.FC = () => {
    return (
        <Common tab="about" template={AboutTemplate}/>
    )
};

export default About;