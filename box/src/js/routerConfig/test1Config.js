import chattingRecordsComponent from "../views/test1/chattingRecords/ViewComponent.js";
import chattingRecordsReducer from "../views/test1/chattingRecords/viewReducer.js";

import doctorListComponent from "../views/test1/insideDoctor/doctorList/ViewComponent.js";
import doctorListReducer from "../views/test1/insideDoctor/doctorList/viewReducer.js";

import departmentsListComponent from "../views/test1/insideDoctor/departmentsList/ViewComponent.js";
import departmentsListReducer from "../views/test1/insideDoctor/departmentsList/viewReducer.js";

import doctorGroupComponent from "../views/test1/insideDoctor/doctorGroup/ViewComponent.js";
import doctorGroupReducer from "../views/test1/insideDoctor/doctorGroup/viewReducer.js";

import userBindManagementComponent from "../views/test1/insideDoctor/userBindManagement/ViewComponent.js";
import userBindManagementReducer from "../views/test1/insideDoctor/userBindManagement/viewReducer.js";

import departmentsSchedulingComponent from "../views/test1/insideDoctor/departmentsScheduling/ViewComponent.js";
import departmentsSchedulingReducer from "../views/test1/insideDoctor/departmentsScheduling/viewReducer.js";

import receptionNumComponent from "../views/test1/insideDoctor/receptionNum/ViewComponent.js";
import receptionNumReducer from "../views/test1/insideDoctor/receptionNum/viewReducer.js";

export default [
    {
        titleName: "聊天记录",
        path: "chattingRecords",
        indexComponent: chattingRecordsComponent,
        reducerName: "chattingRecordsReducer",
        viewReducer: chattingRecordsReducer
    },
    {
        titleName: "内部医生",
        path: "insideDoctor",
        children: [
            {
                titleName: "医生列表",
                path: "doctorList",
                indexComponent: doctorListComponent,
                reducerName: "doctorListReducer",
                viewReducer: doctorListReducer
            },
            {
                titleName: "科室列表",
                path: "departmentsList",
                indexComponent: departmentsListComponent,
                reducerName: "departmentsListReducer",
                viewReducer: departmentsListReducer
            },
            {
                titleName: "医生分组",
                path: "doctorGroup",
                indexComponent: doctorGroupComponent,
                reducerName: "doctorGroupReducer",
                viewReducer: doctorGroupReducer
            },
            {
                titleName: "用户绑定管理",
                path: "userBindManagement",
                indexComponent: userBindManagementComponent,
                reducerName: "userBindManagementReducer",
                viewReducer: userBindManagementReducer
            },
            {
                titleName: "科室排班",
                path: "departmentsScheduling",
                indexComponent: departmentsSchedulingComponent,
                reducerName: "departmentsSchedulingReducer",
                viewReducer: departmentsSchedulingReducer
            },
            {
                titleName: "接诊人数",
                path: "receptionNum",
                indexComponent: receptionNumComponent,
                reducerName: "receptionNumReducer",
                viewReducer: receptionNumReducer
            }
        ]
    }
]