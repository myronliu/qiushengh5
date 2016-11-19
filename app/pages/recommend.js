// 申请专家
import Layout from '../components/layout';
import Cookie from '../helper/cookie';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig';
import Toast from '../helper/toast';

export default class extends BasePage {
  constructor(props) {
		super(props);
		this.state = {
			freeList: [],
      caidianList: [],
      recState: 'NO',
		};
	}

  pay(fee, id, ifBuy) {
		window.to('/recodetail?id=' + id);
	}

  apiSuccess(url,body){
    this.showLoading(false);
    switch(url){
      case UrlConfig.freeRecommendList:
        if(body && body.success){
          this.setState({
            freeList: body.data
          });
        }else{
          this.setState({
            freeList: []
          });
          Toast.show(body.msg, 'error');
        }
        break;
      case UrlConfig.recommendList:
      if(body && body.success){
        this.setState({
          caidianList: body.data
        });
      }else{
        this.setState({
          caidianList: []
        });
        Toast.show(body.msg, 'error');
      }
      break;
    }
  }

  getRecommend(type){
    this.showLoading(true);
		var token = Cookie.getCookie("token") || '';
		if(type === 'free'){
      ApiAction.post(UrlConfig.freeRecommendList, {
        token: token,
        state: 'NO'
      });
    }else if(type === 'caidian'){
      ApiAction.post(UrlConfig.recommendList, {
        token: token,
        recommendWay: 'REAL',
        ifOver: 'NO'
      });
    }
  }

  componentDidMount() {
		super.componentDidMount();
		this.showLoading(true);
		this.getRecommend(this.props.type);
	}

  render(){
    var type = this.props.type;
    var titleName = type === 'free' ? '免费推荐' : '彩店实单';

    return (
        <Layout hideBack={false} className={'recommend'} title={titleName}>
          {
            (type === 'free' ? this.state.freeList : this.state.caidianList).map(function(item, index){
              return (
                <TapAble className="specialItem block" key={"s" + index}
      				         onTap={this.pay.bind(this, item.fee, item.id, item.ifBuy)}>
        					<div className="leftPart">
        						<div className="topInfo">
        							<span className="liansai">{item.matchName}</span>
        							<span className="add">{item.betsType}</span>
        							<span className="time">10-10 02:45</span>
        						</div>
        						<div className="bottomInfo">
        							<span className="left">{item.homeTeam}</span>
        							<span className="">VS</span>
        							<span className="right">{item.awayTeam}</span>
        						</div>
        					</div>
        					<div className="rightPart">
        						{this.state.recState == "NO" ? (item.fee && item.fee > 0 ? (item.ifBuy ? "查看" : item.fee + CommonConfig.unit) : "免费") : "免费"}
        					</div>
      				  </TapAble>
              );
            }.bind(this))
          }
        </Layout>
    )
  }
}
