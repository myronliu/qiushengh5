/**
 * Created by sjzhang on 2016/11/14.
 */
import {Component, PropTypes} from 'react';
import $ from 'jquery';

export default class FileUpload extends Component {
	static propTypes = {
		// onError: PropTypes.func,
		// onChoose: PropTypes.func,
		// url: PropTypes.oneOf(PropTypes.string, PropTypes.func), //服务器地址
		// beforeUpload: PropTypes.func
	};

	constructor(props, context) {
		super(props, context);
	}

	render() {
		return <div {...this.props} onTouchEnd={this.click.bind(this)}>
			{this.props.children}
			<input style={{display: "none"}} className="fileInput" type="file" ref="fileInput" multiple
			       onChange={this.uploadFiles.bind(this)}/>
		</div>
	}

	click($e) {
		this.refs.fileInput.click();
		$e.stopPropagation();
	}

	componentDidMount() {

	}

	uploadFiles($e) {
		let files = $e.target.files;
		if (files.length == 0) return;
		let formData = new FormData();
		formData.append('file', files[0]);
		let {url, beforeUpload, onChoose, onError} = this.props;
		// beforeUpload(files[0]) && $.ajax({
		// 	url: url,
		// 	type: 'POST',
		// 	cache: false,
		// 	data: formData,
		// 	processData: false,
		// 	contentType: false,
		// 	success: ()=> {
		// 		onChoose && onChoose(files[0]);
		// 	},
		// 	error: ()=> {
		// 		onError && onError(e)
		// 	}
		// });

		beforeUpload(files[0]) && onChoose && onChoose(files[0]);
	}
}