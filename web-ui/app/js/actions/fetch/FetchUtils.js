var HTTPUtil = {};

/**
 * 基于 fetch 封装的 GET请求
 * @param url
 * @param params {}
 * @param headers
 * @returns {Promise}
 */
HTTPUtil.get = function (url, params) {
    if (params) {
        let paramsArray = [];
        //encodeURIComponent
        Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
        if (url.search(/\?/) === -1) {
            url += '?' + paramsArray.join('&')
        } else {
            url += '&' + paramsArray.join('&')
        }
    }
    var myHeaders = new Headers({
        "Content-Type": "application/json;charset=UTF-8"
    });
    return new Promise(function (resolve, reject) {
        fetch(url, {
                method: 'GET',
                headers: myHeaders,
            })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    reject({
                        status: response.status
                    })
                }
            })
            .then((response) => {
                resolve(response);
            })
            .catch((err) => {
                reject({
                    status: -1
                });
            })
    })
}


/**
 * 基于 fetch 封装的 POST请求  FormData 表单数据
 * @param url
 * @param formData
 * @param headers
 * @returns {Promise}
 */
HTTPUtil.post = function (url, formData) {
    var myHeaders = new Headers({
        "Content-Type": "application/json;charset=UTF-8"
    });
    return new Promise(function (resolve, reject) {
        fetch(url, {
            method: 'POST',
            body: formData,
            headers: myHeaders,
        }).then((response) => {
            if (response.ok) {
                return response.ok;
            } else {
                reject({
                    status: response.status
                })
            }
        }).then((response) => {
            resolve(response);
        }).catch((err) => {
            reject({
                status: -1
            });
        })
    })
}

/**
 * 基于 fetch 封装的多URL请求
 * @param urls
 * @param params {}
 * @param headers
 * @returns {Promise}
 */
HTTPUtil.URLs = function (urls) {
    var myHeaders = new Headers({
        "Content-Type": "application/json;charset=UTF-8"
    });
    return Promise.all(urls.map(url =>
        fetch(url,{
            headers: myHeaders,
        }).then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                return {
                    status: response.status
                };
            }
        })
    )).catch((err) => {
        return {
            status: -1
        };
    })
}

export default HTTPUtil;