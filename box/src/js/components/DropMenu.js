// 并不是通用组件，就是给排序写的
import React, { Component } from 'react';

class DropMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextState.showMenu, this.state.showMenu);
    return nextState.showMenu !== this.state.showMenu;
  }

  showMenu() {
    this.setState({
      showMenu: true,
    });
  }

  handleSort(a, b) {
    const { sortTeam } = this.props;

    this.setState({
      showMenu: false,
    });
    sortTeam({ a, b });
  }

  render() {
    const { index, keyName } = this.props;
    let menu = null;

    if (this.state.showMenu) {
      menu = (
        <ul>
          <li onClick={(e) => { e.stopPropagation(); this.handleSort(index, 0); }}>
            <span>{keyName}</span><img style={{ width: 10 }} src="./images/up.png" alt="" />
          </li>
          <li onClick={(e) => { e.stopPropagation(); this.handleSort(index, 1); }}>
            <span>{keyName}</span><img style={{ width: 10 }} src="./images/down.png" alt="" />
          </li>
          <li onClick={(e) => { e.stopPropagation(); this.handleSort(index, 2); }}>
            <span>让球{keyName}</span><img style={{ width: 10 }} src="./images/up.png" alt="" />
          </li>
          <li onClick={(e) => { e.stopPropagation(); this.handleSort(index, 3); }}>
            <span>让球{keyName}</span><img style={{ width: 10 }} src="./images/down.png" alt="" />
          </li>
        </ul>
      );
    }
    return (
      <div onClick={() => { this.showMenu(); }} className="match-block header-title drop-menu">
        <span>{keyName}</span><img style={{ width: 10 }} src="./images/sort.png" alt="" />
        {menu}
      </div>
    );
  }
}

export default DropMenu;
