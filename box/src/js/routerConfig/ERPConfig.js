import orderConfigComponent from "../views/ERP/outerGroupBuy/orderConfig/ViewComponent.js";
import orderConfigReducer from "../views/ERP/outerGroupBuy/orderConfig/viewReducer.js";

export default [
    {
        titleName: "外部团购",
        path: "outerGroupBuy",
        isOpen: true,
        children: [
            {
                titleName: "商品配置",
                path: "orderConfig",
                indexComponent: orderConfigComponent,
                reducerName: "orderConfigReducer",
                viewReducer: orderConfigReducer
            }
        ]
    }
]