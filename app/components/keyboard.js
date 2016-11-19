import React from 'react';

export default class KeyBoard extends React.Component {
	state = {
		num: "-1",
		color: "#62a8ff"
	}

	handleEnd(num) {
		this.setState({
			num: "-1"
		})
		if (this.props.handleAdd && typeof this.props.handleAdd == "function") {
			this.props.handleAdd(num);
		}
	}

	handleStart(num) {
		this.setState({
			num: num
		})
	}

	handleDelete() {
		this.setState({
			num: "-1"
		})
		if (this.props.handleDel && typeof this.props.handleDel == "function") {
			this.props.handleDel();
		}
	}

	render() {
		return (
			<div className="kbdwap">
				<div className={this.props.show ? "keyboard" : " hide"}>
					<div className='close'><span onTouchEnd={this.props.close}>完成</span></div>
					<div className='row-first'>
					<span style={this.state.num === "1" ? {backgroundColor: this.state.color} : {}}
					      onTouchStart={this.handleStart.bind(this, "1")}
					      onTouchEnd={this.handleEnd.bind(this, "1")}>1</span>
						<span style={this.state.num === "2" ? {backgroundColor: this.state.color} : {}}
						      onTouchStart={this.handleStart.bind(this, "2")}
						      onTouchEnd={this.handleEnd.bind(this, "2")}>2</span>
						<span style={this.state.num === "3" ? {backgroundColor: this.state.color} : {}}
						      onTouchStart={this.handleStart.bind(this, "3")}
						      onTouchEnd={this.handleEnd.bind(this, "3")}>3</span>
					</div>
					<div className='row'>
					<span style={this.state.num === "4" ? {backgroundColor: this.state.color} : {}}
					      onTouchStart={this.handleStart.bind(this, "4")}
					      onTouchEnd={this.handleEnd.bind(this, "4")}>4</span>
						<span style={this.state.num === "5" ? {backgroundColor: this.state.color} : {}}
						      onTouchStart={this.handleStart.bind(this, "5")}
						      onTouchEnd={this.handleEnd.bind(this, "5")}>5</span>
						<span style={this.state.num === "6" ? {backgroundColor: this.state.color} : {}}
						      onTouchStart={this.handleStart.bind(this, "6")}
						      onTouchEnd={this.handleEnd.bind(this, "6")}>6</span>
					</div>
					<div className='row'>
					<span style={this.state.num === "7" ? {backgroundColor: this.state.color} : {}}
					      onTouchStart={this.handleStart.bind(this, "7")}
					      onTouchEnd={this.handleEnd.bind(this, "7")}>7</span>
						<span style={this.state.num === "8" ? {backgroundColor: this.state.color} : {}}
						      onTouchStart={this.handleStart.bind(this, "8")}
						      onTouchEnd={this.handleEnd.bind(this, "8")}>8</span>
						<span style={this.state.num === "9" ? {backgroundColor: this.state.color} : {}}
						      onTouchStart={this.handleStart.bind(this, "9")}
						      onTouchEnd={this.handleEnd.bind(this, "9")}>9</span>
					</div>
					<div className='row'>
						<span style={this.state.num === "." ? {backgroundColor: this.state.color} : {}}></span>
						<span style={this.state.num === "0" ? {backgroundColor: this.state.color} : {}}
						      onTouchStart={this.handleStart.bind(this, "0")}
						      onTouchEnd={this.handleEnd.bind(this, "0")}>0</span>
						<span className="back" style={this.state.num === "<" ? {backgroundColor: this.state.color} : {}}
						      onTouchStart={this.handleStart.bind(this, "<")}
						      onTouchEnd={this.handleDelete.bind(this, "<")}>{''}</span>
					</div>
				</div>
			</div>
		);
	}
}