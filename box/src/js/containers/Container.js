import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ViewContainer from 'js/containers/ViewContainer';
import * as actions from './actions';
import './style.scss';

@connect(
    state => ({
        ABCData: state.ABCReducer,
    }),
    dispatch => bindActionCreators(actions, dispatch)
)
class ViewName extends Component {
    componentDidMount() {
        const { fetchABC } = this.props;
        fetchABC();
    }

    render() {
        const { ABCData: { ABC, loadState } } = this.props;

        return (
        );
    }
}

export default ViewName;
