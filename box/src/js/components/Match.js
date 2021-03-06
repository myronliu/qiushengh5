import React, { Component } from 'react';
import classnames from 'classnames';
import Ps from 'perfect-scrollbar';
import DropMenu from './DropMenu';

class Match extends Component {
  constructor(props) {
    super(props);
    this.sortMenuKey = ['胜', '负', '平'];
    // this.sortMenu = [
    //   {
    //     keyName: '胜',
    //     menuList: [
    //       {
    //         text: 1,
    //         method() {
    //           console.log(1);
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     keyName: '负',
    //     menuList: [
    //       {
    //         text: 1,
    //         method() {
    //           console.log(1);
    //         },
    //       },
    //     ],
    //   },
    //   {
    //     keyName: '平',
    //     menuList: [
    //       {
    //         text: 1,
    //         method() {
    //           console.log(1);
    //         },
    //       },
    //     ],
    //   },
    // ];
  }

  componentDidMount() {
    Ps.initialize(document.querySelector('.match-list'));
  }

  componentDidUpdate() {
    Ps.initialize(document.querySelector('.match-list'));
  }

  select(index, type) {
    const { selectTeam } = this.props;
    selectTeam({ index, type });
  }

  render() {
    const { matchData, controlData: { selectTime, buyNum, sumPay, sumGet }, sortTeam, changeBuyNum } = this.props;

    return (
      <div className="match-container">
        <div className="match-header">
          <div className="match-block header-title">主队 VS 客队</div>
          <div className="match-block header-title">让球</div>
          {
            this.sortMenuKey.map((keyName, index) => (
              <DropMenu
                sortTeam={sortTeam}
                keyName={keyName}
                index={index}
              />
            ))
          }
        </div>
        <div className="match-list">
          {
            matchData.map((itemData, index) => (
              <div className="match-item">
                <div className="match-block">
                  {itemData.homeTeam} VS {itemData.awayTeam}
                </div>
                <div className="match-block rq-wrap">
                  <div className="match-block-cell rq">{index}</div>
                  <div className="match-block-cell rq">{itemData.handicap}</div>
                </div>
                <div className="match-block pl-wrap">
                  <div
                    onClick={() => this.select(index, 'oddsS')}
                    className={classnames('match-block-cell pl', { active: itemData.oddsS.isSelected })}
                  >
                    {itemData.oddsS.percent}
                  </div>
                  <div
                    onClick={() => this.select(index, 'oddsRs')}
                    className={classnames('match-block-cell pl', { active: itemData.oddsRs.isSelected })}
                  >
                    {itemData.oddsRs.percent}
                  </div>
                </div>
                <div className="match-block pl-wrap">
                  <div
                    onClick={() => this.select(index, 'oddsF')}
                    className={classnames('match-block-cell pl', { active: itemData.oddsF.isSelected })}
                  >
                    {itemData.oddsF.percent}
                  </div>
                  <div
                    onClick={() => this.select(index, 'oddsRf')}
                    className={classnames('match-block-cell pl', { active: itemData.oddsRf.isSelected })}
                  >
                    {itemData.oddsRf.percent}
                  </div>
                </div>
                <div className="match-block pl-wrap">
                  <div
                    onClick={() => this.select(index, 'oddsP')}
                    className={classnames('match-block-cell pl', { active: itemData.oddsP.isSelected })}
                  >
                    {itemData.oddsP.percent}
                  </div>
                  <div
                    onClick={() => this.select(index, 'oddsRp')}
                    className={classnames('match-block-cell pl', { active: itemData.oddsRp.isSelected })}
                  >
                    {itemData.oddsRp.percent}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <div className="control-panel">
          <div className="control-block">
            <div className="show-select-time">
              <span>已选{selectTime}次</span>
            </div>
          </div>
          <div className="control-block">
            <div>
              过关方式
            </div>
            <div>
              普通过关
            </div>
            <div>
              多选过关
            </div>
          </div>
          <div className="control-block">
            <div>
              <div>
                <div className="control-num">
                  <div
                    className="handle-button delete"
                    onClick={() => changeBuyNum({ num: -1 })}
                  >
                    <img style={{ width: 10 }} src="./images/delete-yellow.png" alt="" />
                  </div>
                  <div className="buy-num-count-in"><span>{buyNum}</span></div>
                  <div
                    className="handle-button plus"
                    onClick={() => changeBuyNum({ num: 1 })}
                  >
                    <img style={{ width: 10 }} src="./images/plus-yellow.png" alt="" />
                  </div>
                </div>
                <span>倍</span>
              </div>
            </div>
            <div>
              <div><span>投注金额：</span><span className="price-result">{sumPay}</span><span> &nbsp;&nbsp;元</span></div>
            </div>
            <div>
              <div style={{ whiteSpace: 'nowrap' }}><span>理论最高奖金：</span><span className="price-result">{sumGet}</span><span>&nbsp;&nbsp;元</span></div>
            </div>
          </div>
          <div className="control-block">
            <div className="show-more">
              <span>查看详情</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Match;
