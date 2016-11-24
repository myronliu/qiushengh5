import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
import Info from '../components/Info';
import Match from '../components/Match';

@connect(
    state => ({
      appData: state.appReducer,
    }),
    dispatch => bindActionCreators(actions, dispatch)
)
class Root extends Component {
  componentWillMount() {
    const { getNotice, getMatch } = this.props;

    getNotice();
    getMatch();
  }


  render() {
    const { appData: { matchData, controlData }, selectTeam, sortTeam, changeBuyNum } = this.props;

    return (
      <div className="main-container">
        <Info />
        <Match
          controlData={controlData}
          matchData={matchData}
          selectTeam={selectTeam}
          sortTeam={sortTeam}
          changeBuyNum={changeBuyNum}
        />
      </div>
    );
  }
}

export default Root;
