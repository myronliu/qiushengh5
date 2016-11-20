import mouthOrderSearchComponent from "../views/mouthProject/mouthOrderSearch/ViewComponent.js";
import mouthOrderSearchReducer from "../views/mouthProject/mouthOrderSearch/viewReducer.js";

import mouthVendorMngComponent from "../views/mouthProject/mouthInfoMaintain/mouthVendorMng/ViewComponent.js";
import mouthVendorMngReducer from "../views/mouthProject/mouthInfoMaintain/mouthVendorMng/viewReducer.js";

import mouthBranchMsgComponent from "../views/mouthProject/mouthInfoMaintain/mouthBranchMsg/ViewComponent.js";
import mouthBranchMsgReducer from "../views/mouthProject/mouthInfoMaintain/mouthBranchMsg/viewReducer.js";

export default [
    {
        titleName: "订单查询",
        path: "mouthOrderSearch",
        indexComponent: mouthOrderSearchComponent,
        reducerName: "mouthOrderSearchReducer",
        viewReducer: mouthOrderSearchReducer
    },
    {
        titleName: "信息维护",
        path: "mouthInfoMaintain",
        children: [
            {
                titleName: "商家管理",
                path: "mouthVendorMng",
                indexComponent: mouthVendorMngComponent,
                reducerName: "mouthVendorMngReducer",
                viewReducer: mouthVendorMngReducer
            },
            {
                titleName: "门店管理",
                path: "mouthBranchMsg",
                indexComponent: mouthBranchMsgComponent,
                reducerName: "mouthBranchMsgReducer",
                viewReducer: mouthBranchMsgReducer
            }
        ]
    }
]