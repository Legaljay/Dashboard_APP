import Common from "./memory-tabs-common";
import LegalTemplate from "./memory-tabs-common/memory-modals/LegalTemplate";

const Legal: React.FC = () => {
    return <Common tab="legal" template={LegalTemplate}/>;
};

export default Legal;