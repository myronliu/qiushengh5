import React, { Component } from 'react';
import classnames from 'classnames';

class Match extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeButtonIndex: 0,
      iframeSrc: 'http://www.baidu.com',
    };
    this.buttonName = [
      { linkName: '火线资讯', linkUrl: 'http://www.baidu.com' },
      { linkName: '专家推荐', linkUrl: 'http://www.bilibili.com' },
      { linkName: '专家问答', linkUrl: 'http://www.baidu.com' },
      { linkName: '11选5', linkUrl: 'http://www.sina.com' },
      { linkName: '大乐透', linkUrl: 'http://www.baidu.com' },
      { linkName: '极限数据', linkUrl: 'http://www.baidu.com' },
      { linkName: '比分', linkUrl: 'http://www.baidu.com' },
      { linkName: '亚欧', linkUrl: 'http://www.baidu.com' },
    ];
  }

  componentDidMount() {
    // iFrameHeight();
    // console.log(document.querySelector('#iframeMain'));
    // setIframeHeight(document.querySelector('#iframeMain'));
  }

  render() {
    return (
      <div className="info-container">
        <div className="nav-container">
          {
            this.buttonName.map((button, index) =>
              <div
                onClick={() => {
                  this.setState({ activeButtonIndex: index, iframeSrc: button.linkUrl });
                }}
                className={classnames('nav-button', {
                  active: index === this.state.activeButtonIndex,
                })}
              >
                {button.linkName}
              </div>
            )
          }
        </div>
        <div className="notice-container">公告</div>
        <div className="iframe-container">
          <iframe
            id="iframeMain"
            src={this.state.iframeSrc}
            frameBorder="0"
            // scrolling="no"
            // marginHeight="0"
            // marginWidth="0"
            width="100%"
            height="100%"
          />
        </div>
      </div>
    );
  }
}

export default Match;
