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
  myRecommend:'lottery/my/recommend',
  deployRecommendation:'lottery/recommend/publish',
  publishArticle: 'lottery/article/publish',
  depositRecord: 'lottery/draw/records',
  freeRecommendList: 'lottery/recommend/free',
  // 彩店实单
  recommendList: 'lottery/recommend/list',
  drawapply: 'lottery/draw/apply',
  myorder: 'lottery/my/balance/value',
  articledetail: 'lottery/article/detail',

  // server needs
  banner: 'lottery/banner',
  match: 'lottery/home/match',
  expert: 'lottery/home/experts',
  recommend: 'lottery/home/recommends',
  hots: 'lottery/home/hots',
  //
  //shangjie add
  apiAddress: 'http://60.205.145.105',
  token : Cookie.getCookie("token") || ""

};
