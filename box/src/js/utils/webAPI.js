import React from 'react';
import PubSub from 'pubsub-js';
import makeParam from 'jquery-param';
import { EventName } from '../constants/constValue';

// function encrypt(data, withUserAuth) {
//     const baseObj = {
//         // "_aid": Globals.APP_ID,
//         // "_vc": Globals.VERSION_CODE,
//         '_sm': 'md5',
//     };
//
//     const mergeObj = {};
//     _Assign(mergeObj, baseObj, data);
//
//     let s = '',
//         params = '?',
//         keys = [];
//
//     for (const k in mergeObj) {
//         keys.push(k);
//     }
//
//     keys.sort();
//
//     for (let i = 0; i < keys.length; i++) {
//         if (typeof mergeObj[keys[i]] !== 'undefined') {
//             s = s + keys[i] + '=' + mergeObj[keys[i]];
//             params += keys[i] + '=' + mergeObj[keys[i]] + '&';
//         }
//     }
//
//     if (withUserAuth) {
//         const c = Cookie.load('_wtk');
//         c && (s += c);
//     } else {
//         s += 'jk.pingan.com';
//     }
//
//     params += '_sig=' + Md5(s);
//     console.info(params);
//
//     return params;
// }

export function fetchData(url, userConfig = {}) {
    const showProgress = typeof userConfig.showProgress === 'boolean' ? userConfig.showProgress : true;
    const showSnack = typeof userConfig.showSnack === 'boolean' ? userConfig.showProgress : true;
    const isOldApi = userConfig.isOldApi || false;
    const finalUrl = userConfig.data ? `${url}?${makeParam(userConfig.data)}` : url;
    const fetchKeys = Object.keys(userConfig).filter(key =>
        !['showProgress', 'showSnack', 'isOldApi', 'data'].some(filterData =>
            key === filterData
        )
    );

    const fetchConfig = {};

    for (const key of fetchKeys) {
        fetchConfig[key] = userConfig[key];
    }

    const config = Object.assign({
        credentials: 'include',
    }, fetchConfig);

    if (showProgress) PubSub.publish(EventName.SWITCH_PROGRESS, { open: true });

    const fetchFunc = fetch(finalUrl, config).then((response) => {
        // 对服务器状态处理
        if (response.status >= 200 && response.status < 300) {
            return response;
        }

        throw new Error(response.statusText);
    }).then(
        response => response.json()
    ).then((responseData) => {
        // 对返回值处理
        if (isOldApi) {
            if (typeof responseData.success === 'boolean' && responseData.success === false) {
                throw new Error('老接口返回错误');
            } else {
                if (showProgress) PubSub.publish(EventName.SWITCH_PROGRESS, { open: false });
                console.log(responseData);
                return responseData;
            }
        } else if (responseData.result.success) {
            if (showProgress) PubSub.publish(EventName.SWITCH_PROGRESS, { open: false });
            return responseData.data;
        } else {
            throw new Error(responseData.result.errorMsg);
        }
    })
    .catch((e) => {
        if (showProgress) PubSub.publish(EventName.SWITCH_PROGRESS, { open: false, error: true });
        if (showSnack) {
            PubSub.publish(EventName.SNACK, {
                open: true,
                message: <div>错误: {e.message}</div>,
            });
        }
        return Promise.reject(e.message);
    });
    return fetchFunc;
}

export function fetchAllData(fetchArray, showProgress = true, showSnack = false) {
    if (showProgress) PubSub.publish(EventName.SWITCH_PROGRESS, { open: true });
    return Promise.all(fetchArray.map(fetchConfig => fetchData(fetchConfig.url, Object.assign(fetchConfig.config, { showProgress: false, showSnack }))))
        .then((result) => {
            if (showProgress) PubSub.publish(EventName.SWITCH_PROGRESS, { open: false });
            return result;
        })
        .catch((e) => {
            console.log(e);
            if (showProgress) PubSub.publish(EventName.SWITCH_PROGRESS, { open: false, error: true });
            return Promise.reject(e.message);
        }
    );
}
