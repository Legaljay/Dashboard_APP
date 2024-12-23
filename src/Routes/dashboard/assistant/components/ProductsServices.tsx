import Common from "./memory-tabs-common";
import ProductTemplate from "./memory-tabs-common/memory-modals/ProductTemplate";

const ProductsServices: React.FC = () => {
    return <Common tab="product_and_service" template={ProductTemplate}/>;
};

export default ProductsServices;