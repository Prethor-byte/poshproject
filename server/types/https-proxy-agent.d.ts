declare module 'https-proxy-agent' {
  import { Agent } from 'https';
  
  interface HttpsProxyAgentOptions {
    host?: string;
    port?: number;
    protocol?: string;
    auth?: string;
    hostname?: string;
    path?: string;
  }

  class HttpsProxyAgent extends Agent {
    constructor(opts: HttpsProxyAgentOptions | string);
  }

  export default HttpsProxyAgent;
}
