import { handleActions } from 'redux-actions';
import update from 'react-addons-update';
import ActionTypes from '../constants/ActionTypes';
// import { EventName } from '../constants/constValue';

const initState = {
  matchData: [],
  selectTime: 0,
};


export default handleActions({
  [`${ActionTypes.GET_NOTICE}_FULFILLED`]: (state, action) => {
    const { payload } = action;
    console.log(payload);
    return state;
  },

  [`${ActionTypes.GET_MATCH}_FULFILLED`]: (state, action) => {
    const { payload } = action;
    console.log(payload);
    return update(state, {
      matchData: {
        $set: payload.map(item => ({
          awayTeam: item.awayTeam,
          homeTeam: item.homeTeam,
          oddsS: item.oddsS,
          oddsP: item.oddsP,
          oddsF: item.oddsF,
          oddsRf: item.oddsRf,
          oddsRp: item.oddsRp,
          oddsRs: item.oddsRs,
          handicap: item.handicap,
          oddsSSelected: false,
          oddsPSelected: false,
          oddsFSelected: false,
          oddsRfSelected: false,
          oddsRpSelected: false,
          oddsRsSelected: false,
        })),
      },
    });
  },
  [ActionTypes.SELECT_TEAM]: (state, action) => {
    const { payload: { index, type } } = action;

    const isSelected = !state.matchData[index][`${type}Selected`];
    const newSelectTime = isSelected ? ++state.selectTime : --state.selectTime;
    return update(state, {
      matchData: {
        [index]: {
          [`${type}Selected`]: {
            $set: isSelected,
          },
        },
      },
      selectTime: { $set: newSelectTime },
    });
  },
  [ActionTypes.SORT_TEAM]: (state, action) => {
    const { payload: { sortKey } } = action;

    return update(state, {
      matchData: {
        $set: state.matchData.sort((itemDataA, itemDataB) => itemDataB[sortKey] - itemDataA[sortKey]),
      },
    });
  },

}, initState);
