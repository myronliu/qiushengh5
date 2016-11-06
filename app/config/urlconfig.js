import Cookie from '../helper/cookie';
module.exports={// 不要加  '/'
  competition: 'index.php?competition-api-unionpay',
  contentFootball: 'index.php?content-api-unionpay-football',
  contentBasketball: 'index.php?content-api-unionpay-basketball',
  recommendationFootball: 'index.php?recommendation-api-unionpay-football',
  recommendationBasketball: 'index.php?recommendation-api-unionpay-basketball',

  // url:'/lottery/trans'
  url: 'lottery/transO',
  urlToday: 'lottery/dailyRecommend',
  getUserRec: 'getUserRec',

  expertlist: 'lottery/expert/list',
  expertDetail: 'lottery/expert/detail',
  expertRecommend: 'lottery/expert/recommend',
  recommendBuy: 'lottery/recommend/buy',
  recommendDetail: 'lottery/recommend/detail',
  matchList: 'lottery/match/list',
  matchDetail: 'lottery/match/detail',
  concern: 'lottery/my/concern',
  concernadd: 'lottery/my/concern/add',
  concerncancel: 'lottery/my/concern/cancel',
  order: 'lottery/my/order',
  myRecommend:'/api/lottery/my/recommend',
  deployRecommendation:'/api/lottery/recommend/publish',

  // server needs
  banner: 'lottery/banner',
  match: 'lottery/home/match',
  expert: 'lottery/home/experts',
  recommend: 'lottery/home/recommends',
  hots: 'lottery/home/hots',
  //
  //shangjie add
  apiAddress: 'http://60.205.145.105',
  token : Cookie.getCookie("token") || "08BDD85DD849D9B3216D97C6CDEE1308F75986F26E37179F9502C5478735E4109AF2489AAFF70CF7B7DE0BE3CC86789ED143E89CA8EF88F48DB07E4209BA53B36F23789BB05C35412362066C0FD54EC2"

};
