import { handleActions } from 'redux-actions';
import update from 'react-addons-update';
import ActionTypes from '../constants/ActionTypes';
// import { EventName } from '../constants/constValue';

const tickeyPrice = 2;
const initState = {
  matchData: [],
  controlData: {
    selectTime: 0,
    buyNum: 1,
    sumPay: 0,
    sumGet: '0.00',
  },
};

function getSumResult(matchData, selectTime, buyNum) {
  const sumPay = tickeyPrice * selectTime * buyNum;
  const sumGet = matchData.reduce((itemA, itemB) => {
    const bKeys = Object.keys(itemB);
    const itemSum = bKeys.reduce((a, b) => {
      if (typeof itemB[b] === 'object' && itemB[b].isSelected) {
        return a + (tickeyPrice * itemB[b].percent * buyNum);
      }
      return a;
    }, 0);
    return itemA + itemSum;
  }, 0);
  return {
    sumGet: sumGet.toFixed(2),
    sumPay,
  };
}

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
          oddsS: {
            percent: item.oddsS,
            isSelected: false,
          },
          oddsP: {
            percent: item.oddsP,
            isSelected: false,
          },
          oddsF: {
            percent: item.oddsF,
            isSelected: false,
          },
          oddsRs: {
            percent: item.oddsRs,
            isSelected: false,
          },
          oddsRp: {
            percent: item.oddsRp,
            isSelected: false,
          },
          oddsRf: {
            percent: item.oddsRf,
            isSelected: false,
          },
          handicap: item.handicap,
        })),
      },
    });
  },
  [ActionTypes.SELECT_TEAM]: (state, action) => {
    const { payload: { index, type } } = action;

    const isSelected = !state.matchData[index][type].isSelected;
    const newSelectTime = isSelected ? ++state.controlData.selectTime : --state.controlData.selectTime;

    const newState = update(state, {
      matchData: {
        [index]: {
          [type]: {
            isSelected: {
              $set: isSelected,
            },
          },
        },
      },
      controlData: {
        selectTime: { $set: newSelectTime },
      },
    });
    const result = getSumResult(newState.matchData, newState.controlData.selectTime, newState.controlData.buyNum);

    return update(newState, {
      controlData: {
        sumPay: { $set: result.sumPay },
        sumGet: { $set: result.sumGet },
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
        result = update(state, {
          matchData: {
            $set: state.matchData.sort((itemDataA, itemDataB) => itemDataB[sortKey].percent - itemDataA[sortKey].percent),
          },
        });
        break;
      case 1:
        sortKey = `odds${key.toUpperCase()}`;
        result = update(state, {
          matchData: {
            $set: state.matchData.sort((itemDataA, itemDataB) => itemDataA[sortKey].percent - itemDataB[sortKey].percent),
          },
        });
        break;
      case 2:
        sortKey = `oddsR${key}`;
        result = update(state, {
          matchData: {
            $set: state.matchData.sort((itemDataA, itemDataB) => itemDataB[sortKey].percent - itemDataA[sortKey].percent),
          },
        });
        break;
      case 3:
        sortKey = `oddsR${key}`;
        result = update(state, {
          matchData: {
            $set: state.matchData.sort((itemDataA, itemDataB) => itemDataA[sortKey].percent - itemDataB[sortKey].percent),
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
    const { payload: { num } } = action;
    let buyNum = state.controlData.buyNum;
    if (num > 0 || buyNum > 1) {
      buyNum = state.controlData.buyNum + num;
    }

    // const sumPay = 2 * state.controlData.selectTime * buyNum;
    // const sumGet = state.matchData.reduce((itemA, itemB) => {
    //   const bKeys = Object.keys(itemB);
    //   const itemSum = bKeys.reduce((a, b) => {
    //     if (typeof itemB[b] === 'object' && itemB[b].isSelected) {
    //       return a + (2 * itemB[b].percent * buyNum);
    //     }
    //     return a;
    //   }, 0);
    //   return itemA + itemSum;
    // }, 0);
    const result = getSumResult(state.matchData, state.controlData.selectTime, buyNum);

    return update(state, {
      controlData: {
        buyNum: { $set: buyNum },
        sumPay: { $set: result.sumPay },
        sumGet: { $set: result.sumGet },
      },
    });
  },

}, initState);
