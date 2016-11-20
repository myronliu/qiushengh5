import ERPConfig from './ERPConfig';
import doctorBackgroundConfig from './doctorBackgroundConfig';
import mouthProjectConfig from './mouthProjectConfig';

export default [
    {
        titleName: "ERP",
        path: "ERP",
        children: ERPConfig
    },
    {
        titleName: "医生后台",
        path: "test1",
        children: doctorBackgroundConfig
    },
    {
        titleName: "齿科项目",
        path: "mouthProject",
        children: mouthProjectConfig
    }
]