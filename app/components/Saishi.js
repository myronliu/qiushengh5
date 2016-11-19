/**
 * Created by xinxin on 2016/11/19.
 */
import React from 'react';
import TapAble from 'react-tappable';
export default class Saishi extends React.Component {

    static propTypes = {
        data: React.PropTypes.object,
        type: React.PropTypes.string,//'saishiAttachPrice'||'saishi'
        onTap: React.PropTypes.func,
    };
    static defaultProps = {
        data: {},
        type: 'saishi',
        onTap: function () {
        },
    };

    renderSaishi(data) {
        return (
            <TapAble onTap={this.props.onTap ? this.props.onTap : ''}>
                {this.props.children}
                <div className="line-1">
                    <span className="matchName">{data.matchName}</span>
                    <span className="matchTime">11-11 10:00</span>
                </div>
                <div className="line-2">
                    <div className="saishiLeft">
                        <img
                            src={data.homeTeamAvatar ? data.homeTeamAvatar : "../images/photo.png"}/>
                        <span>{data.homeTeam}</span>
                    </div>
                    <div className="saishiMiddle">
                        <span>{data.finalScore ? data.finalScore : 'vs'}</span>
                    </div>
                    <div className="saishiRight">
                        <span>{data.awayTeam}</span>
                        <img
                            src={data.awayTeamAvatar ? data.awayTeamAvatar : "../images/photo.png"}/>
                    </div>
                </div>
                <div className="line-3">
                            <span className="specialCountInfo"><span
                                className="specialCount">{data.experts || '0'}</span>位专家</span>
                </div>
            </TapAble>
        )
    }

    renderSaishiAttachPrice(data) {
        return (
            <TapAble
                onTap={this.props.onTap ? this.props.onTap : ''}>
                <div className="leftPart">
                    <div className="sTopInfo">
                        <span className="liansai">{data.matchName}</span>
                        <span className="add">{data.betsType}</span>
                        <span className="time">{data.matchDate}</span>
                    </div>
                    <div className="bottomInfo">
                        <span className="left">{data.homeTeam}</span>
                        <span >VS</span>
                        <span className="right">{data.awayTeam}</span>
                    </div>
                </div>
                <div className="rightPart">
                    {data.fee > 0 ? (data.ifBuy ? "查看" : (data.fee + CommonConfig.unit)) : ("免费")}
                </div>
            </TapAble>
        );
    }

    render() {
        var data = this.props.data;
        var type = this.props.type;
        return (
            <div className={type}>
                {type === 'saishi' ? this.renderSaishi(data) : this.renderSaishiAttachPrice(data)}
            </div>
        );
    }
}