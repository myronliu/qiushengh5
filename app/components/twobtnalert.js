var React = require('react');
module.exports = React.createClass({
    propTypes: {
        title: React.PropTypes.string,
        message: React.PropTypes.string,
        bottomMessage: React.PropTypes.string,
        icon: React.PropTypes.string,
        firstBtnTitle: React.PropTypes.string,
        secondBtnTitle: React.PropTypes.string,
        firstBtnOnTouchEnd: React.PropTypes.func,
        secondBtnOnTouchEnd: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {
            title: '',
            message: '',
            placeholder: '',
            icon: '',
            firstBtnTitle: '取消',
            secondBtnTitle: '确认',
            bottomMessage: ''
        }
    },
    getInitialState: function () {
        return {
            text: ''
        }
    },
    textChange: function (event) {
        this.setState({
            text: text
        });
    },
    render: function () {
        var center = {
            width: '60%',
            marginLeft: '20%',
            backgroundColor: 'rgba(255,255,255,0.95)',
            WebkitBorderRadius: '1rem 1rem 0.5rem 0.5rem'
        };
        var td = {
            textAlign: 'center',
            verticalAlign: 'middle'
        };
        var table = {
            width: '100%',
            height: '100%',
            tableLayout: 'fixed'
        };
        var title = {
            width: '100%',
            padding: '10% 0 5%',
            color: '#2E2E2E',
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            lineHeight:'2'
        };
        var messageDiv = {
            width: '100%',
            color: '#D1D1D1',
            textAlign: 'center',
            wordWrap: 'break-word',
            paddingTop: 5,
            paddingBottom: 15
        };
        var textStyle = {
            WebkitAppearance: 'none',
            border: '1px solid #BEBEBE',
            backgroundColor: '#FFFFFF',
            WebkitBorderRadius: 2,
            display: "inline-block",
            height: 35,
            width: '96%',
            paddingLeft: 5,
            fontSize: 15
        };
        var cancleBtnStyle = {
            width: '50%',
            WebkitAppearance: 'none',
            lineHeight: '2.5rem',
            backgroundColor: 'transparent',
            border: 0,
            color: '#518ad6',
            fontSize: '1.2rem',
            borderRight: '0.05rem solid #B0B6BF'
        };

        var nextButtonStyle = {
            width: '50%',
            WebkitAppearance: 'none',
            lineHeight: '2.5rem',
            backgroundColor: this.props.disabled ? '#969696' : 'transparent',
            border: 0,
            color: '#518ad6',
            fontSize: '1.2rem',
        };
        var iconStyle = {
            display: this.props.icon === '' ? 'none' : 'inline-block',
            width: 18,
            height: 18
        };
        var messageStyle = {
            color: '#2E2E2E',
            marginLeft: 5,
            display: 'inline'
        };
        var iconDiv = {
            display: 'inline-block'
        };
        var btnGroup = {
            borderTop:'0.05rem solid #B0B6BF'
        };
        var bottomMessageStyle = {
            marginTop: 5,
            display: this.props.icon === '' ? 'none' : 'block',
            fontSize: 12,
            color: '#FE0000'
        };
        var backStyle = {opacity: 1};
        var margin54 = {height: 45};
        return (
            <div className={this.props.show ? "show" : "hide"}>
                <div style={backStyle} className="twobtnalert">
                    <table style={table}>
                        <tbody>
                        <tr>
                            <td style={td}>
                                <div style={center}>
                                    <div style={title} dangerouslySetInnerHTML={{__html: this.props.title}}/>
                                    <div style={messageDiv} className="messageDiv">
                                        <div style={iconDiv}>
                                            <img style={iconStyle} src={this.props.icon}/>
                                        </div>
                                        {
                                            this.props.message ? <div style={messageStyle}>{this.props.message}</div> :
                                                this.props.children
                                        }
                                    </div>
                                    <div style={btnGroup}>
                                        <TapAble onTap={this.props.firstBtnOnTouchEnd}><input type="button"
                                                                                              style={cancleBtnStyle}
                                                                                              value={this.props.firstBtnTitle}/></TapAble>
                                        <TapAble onTap={this.props.secondBtnOnTouchEnd}><input type="button"
                                                                                               style={nextButtonStyle}
                                                                                               value={this.props.secondBtnTitle}/></TapAble>
                                    </div>
                                    <div style={bottomMessageStyle}>
                                        {this.props.bottomMessage}
                                    </div>
                                </div>
                                <div style={margin54}></div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
});