import GHIConfigComponent from "../views/DEF/DEF/GHIConfig/ViewComponent.js";
import GHIConfigReducer from "../views/DEF/DEF/GHIConfig/viewReducer.js";

import JKLConfigComponent from "../views/DEF/DEF/JKLConfig/ViewComponent.js";
import JKLConfigReducer from "../views/DEF/DEF/JKLConfig/viewReducer.js";

export default [
    {
        titleName: "啦啦啦测试菜单",
        path: "DEF",
        isOpen: true,
        children: [
            {
                titleName: "啦啦啦子菜单1",
                path: "GHIConfig",
                indexComponent: GHIConfigComponent,
                reducerName: "GHIConfigReducer",
                viewReducer: GHIConfigReducer
            },
            {
                titleName: "啦啦啦子菜单2",
                path: "JKLConfig",
                indexComponent: JKLConfigComponent,
                reducerName: "JKLConfigReducer",
                viewReducer: JKLConfigReducer
            }
        ]
    }
]