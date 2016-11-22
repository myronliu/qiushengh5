import React, { Component } from 'react';
import classnames from 'classnames';

class Match extends Component {
  select(index, type) {
    const { selectTeam } = this.props;
    selectTeam({ index, type });
  }

  render() {
    const { matchData, selectTime } = this.props;

    return (
      <div className="match-container">
        <div className="match-header">
          <div className="match-block header-title">主队 VS 客队</div>
          <div className="match-block header-title">让球</div>
          <div className="match-block header-title">胜</div>
          <div className="match-block header-title">平</div>
          <div className="match-block header-title">负</div>
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
                    className={classnames('match-block-cell pl', { active: itemData.oddsSSelected })}
                  >
                    {itemData.oddsS}
                  </div>
                  <div
                    onClick={() => this.select(index, 'oddsRs')}
                    className={classnames('match-block-cell pl', { active: itemData.oddsRsSelected })}
                  >
                    {itemData.oddsRs}
                  </div>
                </div>
                <div className="match-block pl-wrap">
                  <div
                    onClick={() => this.select(index, 'oddsP')}
                    className={classnames('match-block-cell pl', { active: itemData.oddsPSelected })}
                  >
                    {itemData.oddsP}
                  </div>
                  <div
                    onClick={() => this.select(index, 'oddsRp')}
                    className={classnames('match-block-cell pl', { active: itemData.oddsRpSelected })}
                  >
                    {itemData.oddsRp}
                  </div>
                </div>
                <div className="match-block pl-wrap">
                  <div
                    onClick={() => this.select(index, 'oddsF')}
                    className={classnames('match-block-cell pl', { active: itemData.oddsFSelected })}
                  >
                    {itemData.oddsF}
                  </div>
                  <div
                    onClick={() => this.select(index, 'oddsRf')}
                    className={classnames('match-block-cell pl', { active: itemData.oddsRfSelected })}
                  >
                    {itemData.oddsRf}
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
