import ERPConfig from './ERPConfig';
import test1Config from './test1Config';

export default [
    {
        titleName: "ERP",
        path: "ERP",
        children: ERPConfig
    },
    {
        titleName: "医生后台",
        path: "test1",
        children: test1Config
    }
]