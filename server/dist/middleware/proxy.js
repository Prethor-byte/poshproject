"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyError = void 0;
exports.getProxyAgent = getProxyAgent;
exports.attachProxy = attachProxy;
exports.handleProxyError = handleProxyError;
exports.validateRegion = validateRegion;
const proxy_1 = require("../config/proxy");
const https_proxy_agent_1 = __importDefault(require("https-proxy-agent"));
const url_1 = require("url");
// Custom error for proxy-related issues
class ProxyError extends Error {
    constructor(message, details) {
        super(message);
        this.details = details;
        this.name = 'ProxyError';
    }
}
exports.ProxyError = ProxyError;
// Get proxy agent for a specific region
function getProxyAgent(region) {
    const proxy = (0, proxy_1.getNextProxy)(region);
    if (!proxy) {
        throw new ProxyError(`No proxy available for region: ${region}`);
    }
    const proxyUrl = new url_1.URL(`http://${proxy.hostname}:${proxy.port}`);
    if (proxy.auth) {
        proxyUrl.username = proxy.auth.username;
        proxyUrl.password = proxy.auth.password;
    }
    return new https_proxy_agent_1.default(proxyUrl.toString());
}
// Middleware to attach proxy to requests
function attachProxy(req, res, next) {
    const region = req.body?.region;
    if (!region) {
        return next(new ProxyError('Region not specified in request'));
    }
    try {
        const agent = getProxyAgent(region);
        req.proxyAgent = agent;
        next();
    }
    catch (error) {
        next(error);
    }
}
// Error handler middleware for proxy errors
function handleProxyError(error, req, res, next) {
    if (error instanceof ProxyError) {
        res.status(502).json({
            error: 'Proxy Error',
            message: error.message,
            details: error.details
        });
    }
    else {
        next(error);
    }
}
// Middleware to validate region
function validateRegion(req, res, next) {
    const region = req.body?.region;
    if (!region) {
        return res.status(400).json({
            error: 'Missing Region',
            message: 'Region must be specified in the request body'
        });
    }
    if (!['US', 'CA'].includes(region)) {
        return res.status(400).json({
            error: 'Invalid Region',
            message: 'Region must be either "US" or "CA"'
        });
    }
    next();
}
