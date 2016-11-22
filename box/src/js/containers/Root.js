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
  constructor(props) {
    super(props);
    console.log(props);
  }
  componentWillMount() {
    const { getNotice, getMatch } = this.props;

    getNotice();
    getMatch();
  }


  render() {
    const { appData: { matchData, selectTime }, selectTeam } = this.props;

    return (
      <div className="main-container">
        <Info />
        <Match
          selectTime={selectTime}
          matchData={matchData}
          selectTeam={selectTeam}
        />
      </div>
    );
  }
}

export default Root;
