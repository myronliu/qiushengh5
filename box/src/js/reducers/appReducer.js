import { handleActions } from 'redux-actions';
import update from 'react-addons-update';
import ActionTypes from '../constants/ActionTypes';
// import { EventName } from '../constants/constValue';

const initState = {
  matchData: [],
  controlData: {
    selectTime: 0,
    buyNum: 1,
  },
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
      controlData: {
        selectTime: { $set: newSelectTime },
      },
    });
  },
  [ActionTypes.SORT_TEAM]: (state, action) => {
    const { payload: { a, b } } = action;

    let result;
    function choose(indexNum, key) {
      let sortKey;
      switch (indexNum) {
      case 0:
        sortKey = `odds${key.toUpperCase()}`;
        console.log(state.matchData.sort((itemDataA, itemDataB) => {
          return itemDataB[sortKey] - itemDataA[sortKey];
        }));
        result = update(state, {
          matchData: {
            $set: state.matchData.sort((itemDataA, itemDataB) => itemDataB[sortKey] - itemDataA[sortKey]),
          },
        });
        break;
      case 1:
        sortKey = `odds${key.toUpperCase()}`;
        result = update(state, {
          matchData: {
            $set: state.matchData.sort((itemDataA, itemDataB) => itemDataA[sortKey] - itemDataB[sortKey]),
          },
        });
        break;
      case 2:
        sortKey = `oddsR${key}`;
        result = update(state, {
          matchData: {
            $set: state.matchData.sort((itemDataA, itemDataB) => itemDataB[sortKey] - itemDataA[sortKey]),
          },
        });
        break;
      case 3:
        sortKey = `oddsR${key}`;
        result = update(state, {
          matchData: {
            $set: state.matchData.sort((itemDataA, itemDataB) => itemDataA[sortKey] - itemDataB[sortKey]),
          },
        });
        break;
      default:

      }
    }
    switch (a) {
    case 0:
      choose(b, 's');
      break;
    case 1:
      choose(b, 'f');
      break;
    case 2:
      choose(b, 'p');
      break;
    default:
    }
    return result;
  },
  [ActionTypes.CHANGE_BUY_NUM]: (state, action) => {
    const { payload } = action;
    console.log(payload);
    return state;
  },

}, initState);
