'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var storecove_client_1 = require("storecove-client");
var dotenv_1 = require("dotenv");
var express = require("express");
var path = require("path");
var OAuthClient = require("intuit-oauth");
var bodyParser = require("body-parser");
// ...
dotenv_1.config();
var app = express();
/**
 * Configure View and Handlebars
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });
/**
 * App Variables
 */
var oauth2_token_json = null;
var redirectUri = '';
/**
 * Instantiate new Client
 */
var oauthClient = null;
/**
 * Home Route
 */
app.get('/', function (req, res) {
    res.render('index');
});
/**
 * Get the AuthorizeUri
 */
app.get('/authUri', urlencodedParser, function (req, res) {
    oauthClient = new OAuthClient({
        clientId: process.env.QBO_CLIENT_ID,
        clientSecret: process.env.QBO_CLIENT_SECRET,
        environment: 'sandbox',
        redirectUri: process.env.QBO_REDIRECT_URI
    });
    var authUri = oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.Accounting],
        state: 'intuit-test'
    });
    res.send(authUri);
});
/**
 * Handle the callback to extract the `Auth Code` and exchange them for `Bearer-Tokens`
 */
app.get('/callback', function (req, res) {
    oauthClient
        .createToken(req.url)
        .then(function (authResponse) {
        oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
    })["catch"](function (e) {
        console.error(e);
    });
    res.send('');
});
/**
 * Display the token : CAUTION : JUST for sample purposes
 */
app.get('/retrieveToken', function (req, res) {
    res.send(oauth2_token_json);
});
/**
 * Refresh the access-token
 */
app.get('/refreshAccessToken', function (req, res) {
    oauthClient
        .refresh()
        .then(function (authResponse) {
        console.log("The Refresh Token is  " + JSON.stringify(authResponse.getJson()));
        oauth2_token_json = JSON.stringify(authResponse.getJson(), null, 2);
        res.send(oauth2_token_json);
    })["catch"](function (e) {
        console.error(e);
    });
});
/**
 * getCompanyInfo ()
 */
app.get('/getCompanyInfo', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var companyID, url, qboResponse, currentUserCompanyInfo, legalEntityCreate, scRes, json, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    companyID = oauthClient.getToken().realmId;
                    url = oauthClient.environment == 'sandbox'
                        ? OAuthClient.environment.sandbox
                        : OAuthClient.environment.production;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, oauthClient
                            .makeApiCall({ url: url + "v3/company/" + companyID + "/companyinfo/" + companyID })];
                case 2:
                    qboResponse = _a.sent();
                    currentUserCompanyInfo = JSON.parse(qboResponse.text());
                    console.log('qbo response', JSON.stringify(currentUserCompanyInfo, null, 2));
                    legalEntityCreate = {
                        body: {
                            tenant_id: companyID,
                            party_name: currentUserCompanyInfo.CompanyInfo.LegalName,
                            line1: currentUserCompanyInfo.CompanyInfo.LegalAddr.Line1,
                            city: currentUserCompanyInfo.CompanyInfo.LegalAddr.City,
                            zip: currentUserCompanyInfo.CompanyInfo.LegalAddr.PostalCode,
                            country: currentUserCompanyInfo.CompanyInfo.LegalAddr.Country
                        }
                    };
                    return [4 /*yield*/, storecove_client_1.createLegalEntity(legalEntityCreate)];
                case 3:
                    scRes = _a.sent();
                    return [4 /*yield*/, scRes.response.json()];
                case 4:
                    json = _a.sent();
                    console.log('storecove response', json);
                    res.send('ok');
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
});
/**
 * disconnect ()
 */
app.get('/disconnect', function (req, res) {
    console.log('The disconnect called ');
    var authUri = oauthClient.authorizeUri({
        scope: [OAuthClient.scopes.OpenId, OAuthClient.scopes.Email],
        state: 'intuit-test'
    });
    res.redirect(authUri);
});
/**
 * Start server on HTTP (will use ngrok for HTTPS forwarding)
 */
var server = app.listen(process.env.PORT || 8000, function () {
    console.log("\uD83D\uDCBB Server listening on port " + server.address().port);
    redirectUri = "" + server.address().port + '/callback';
    console.log("\uD83D\uDCB3  Step 1 : Paste this URL in your browser : " +
        'http://localhost:' +
        ("" + server.address().port));
    console.log('💳  Step 2 : Copy and Paste the clientId and clientSecret from : https://developer.intuit.com');
    console.log("\uD83D\uDCB3  Step 3 : Copy Paste this callback URL into redirectURI :" +
        'http://localhost:' +
        ("" + server.address().port) +
        '/callback');
    console.log("\uD83D\uDCBB  Step 4 : Make Sure this redirect URI is also listed under the Redirect URIs on your app in : https://developer.intuit.com");
});
