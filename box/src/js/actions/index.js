import { createAction } from 'redux-actions';
import ActionTypes from '../constants/ActionTypes';
import { hosts } from '../constants/commonConfig';

export const getNotice = createAction(
    ActionTypes.GET_NOTICE,
    async () =>
         await fetch(`${hosts.notice}?token=D3EB44780D4B29EDD4E22B3A1B9316B7123A01E006EFE6B13E1A60475CA84E7205BF72D3A0E31E29AC6EA82F82E3460C78C419E89188D1210C6BA1D5F703838EF511B9BE8F42BE98FFD6235751058DEF`).then((response) => {
           if (response.status >= 200 && response.status < 300) {
             return response.json();
           }
           throw new Error(response.statusText);
         })
);

export const getMatch = createAction(
    ActionTypes.GET_MATCH,
    async () =>
         await fetch(`${hosts.match}?status=1&token=D3EB44780D4B29EDD4E22B3A1B9316B7123A01E006EFE6B13E1A60475CA84E7205BF72D3A0E31E29AC6EA82F82E3460C78C419E89188D1210C6BA1D5F703838EF511B9BE8F42BE98FFD6235751058DEF`).then((response) => {
           if (response.status >= 200 && response.status < 300) {
             return response.json();
           }
           throw new Error(response.statusText);
         })
);

export const selectTeam = createAction(
    ActionTypes.SELECT_TEAM
);

export const sortTeam = createAction(
    ActionTypes.SORT_TEAM
);
