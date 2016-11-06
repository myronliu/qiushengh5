import $ from 'jquery';
import UrlConfig from '../config/urlconfig'
function tryParse(response) {
	try {
		return JSON.parse(response)
	} catch (e) {
		return response;
	}
}
export const Get = function (url, data = {}) {
	return $.get(UrlConfig.apiAddress + url, Object.assign(data, {
		token: UrlConfig.token
	})).then(tryParse)
};
export const Post = function (url, data = {}, options = {}) {
	return $.ajax(Object.assign({
		type: 'post',
		url: UrlConfig.apiAddress + url,
		data: Object.assign(data, {
			token: UrlConfig.token
		})
	}, options)).then(tryParse)
};

