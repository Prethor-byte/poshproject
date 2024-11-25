"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextProxy = getNextProxy;
exports.resetProxyRotation = resetProxyRotation;
exports.validateProxyConfig = validateProxyConfig;
exports.addProxy = addProxy;
exports.removeProxy = removeProxy;
exports.getProxyStats = getProxyStats;
exports.loadProxiesFromEnv = loadProxiesFromEnv;
exports.initializeProxyConfig = initializeProxyConfig;
// Proxy rotation state
let currentUSProxyIndex = 0;
let currentCAProxyIndex = 0;
// Configure your proxy pools here
const proxyPools = {
    US: [
    // Add your US proxies here
    // Example:
    // {
    //   hostname: 'us.proxy.service',
    //   port: 1234,
    //   auth: {
    //     username: 'user',
    //     password: 'pass'
    //   }
    // }
    ],
    CA: [
    // Add your Canadian proxies here
    ]
};
// Get the next proxy for a specific region
function getNextProxy(region) {
    const pool = proxyPools[region];
    if (!pool || pool.length === 0)
        return null;
    let index = region === 'US' ? currentUSProxyIndex : currentCAProxyIndex;
    const proxy = pool[index];
    // Rotate to next proxy
    if (region === 'US') {
        currentUSProxyIndex = (currentUSProxyIndex + 1) % pool.length;
    }
    else {
        currentCAProxyIndex = (currentCAProxyIndex + 1) % pool.length;
    }
    return proxy;
}
// Reset proxy rotation
function resetProxyRotation() {
    currentUSProxyIndex = 0;
    currentCAProxyIndex = 0;
}
// Validate proxy configuration
function validateProxyConfig(config) {
    return (typeof config.hostname === 'string' &&
        typeof config.port === 'number' &&
        config.port > 0 &&
        config.port < 65536 &&
        (!config.auth ||
            (typeof config.auth.username === 'string' &&
                typeof config.auth.password === 'string')));
}
// Add a new proxy to the pool
function addProxy(region, config) {
    if (!validateProxyConfig(config))
        return false;
    proxyPools[region].push(config);
    return true;
}
// Remove a proxy from the pool
function removeProxy(region, hostname, port) {
    const pool = proxyPools[region];
    const index = pool.findIndex(p => p.hostname === hostname && p.port === port);
    if (index === -1)
        return false;
    pool.splice(index, 1);
    // Reset indices if we removed the current proxy
    if (region === 'US' && currentUSProxyIndex >= pool.length) {
        currentUSProxyIndex = 0;
    }
    if (region === 'CA' && currentCAProxyIndex >= pool.length) {
        currentCAProxyIndex = 0;
    }
    return true;
}
// Get proxy stats
function getProxyStats() {
    return {
        US: {
            total: proxyPools.US.length,
            current: currentUSProxyIndex,
        },
        CA: {
            total: proxyPools.CA.length,
            current: currentCAProxyIndex,
        }
    };
}
// Load proxies from environment variables
function loadProxiesFromEnv() {
    const envProxies = process.env.PROXY_CONFIG;
    if (!envProxies)
        return;
    try {
        const config = JSON.parse(envProxies);
        if (config.US)
            proxyPools.US = config.US;
        if (config.CA)
            proxyPools.CA = config.CA;
    }
    catch (err) {
        console.error('Failed to load proxy configuration:', err);
    }
}
// Initialize proxy configuration
function initializeProxyConfig() {
    loadProxiesFromEnv();
    resetProxyRotation();
}
