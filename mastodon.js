const API_URL = "/api/v1/";
const Endpoint = {
    account: {
        verifyCredentials: "/accounts/verify_credentials"
    },
    postStatus: "/statuses"
}

class MastodonAPI {
    instanceURL;
    accessToken;

    constructor(instanceURL, accessToken) {
        this.instanceURL = instanceURL;
        this.accessToken = accessToken;
    }

    _getEndpointURL(endpoint) {
        return this.instanceURL + API_URL + endpoint;
    }

    async _request(endpoint, method, headers, bodyData, needAuth) {
        let headerObject = headers || {};

        if(needAuth) {
            headerObject.Authorization = 'Bearer ' + this.accessToken
        }

        let resp = await fetch(this._getEndpointURL(endpoint), {
            method: method,
            headers: headerObject,
            body: bodyData
        });

        let data = await resp.json();

        return {
            resp: resp,
            data: data
        };
    }

    async authorize() {
        let req = await this._request(Endpoint.account.verifyCredentials, "GET", null, null, true);

        // If we don't give read:accounts scope, this error will occur. But it still at least confirms that the token works.
        if(req.data.error == "This action is outside the authorized scopes") {
            return {
                'error': null
            }
        }

        if(req.resp.status == 200) {
            return {
                'error': null,
                'id': req.data.id,
                'name': req.data.display_name,
                'tag': req.data.acct
            }
        }

        return {
            'error': req.data.error
        }
    }

    async post(postParams) {
        const params = new URLSearchParams();
        for(let [key, value] of Object.entries(postParams)) {
            params.set(key, value);
        }

        let req = await this._request(Endpoint.postStatus, "POST", null, params, true);

        if(req.data.error != null) {
            console.log("Cannot send post: " + data.error);
            req.data.success = false;
        } else {
            req.data.success = true;
        }
        return req.data
    }
}

module.exports = MastodonAPI;