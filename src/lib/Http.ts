export type RequestHeader = Record<string, string | number | boolean>;
export type Method = 'get' | 'GET' | 'post' | 'POST';
export type ResponseHeader = Record<string, string> & { "set-cookie"?: string[] };

export type RequestData = Record<string, string | number | boolean>;


export interface RequestConfig{
    url: string;
    method: Method;
    headers?: RequestHeader;
    data: RequestData,
}

class Http{
    constructor(){

    }
    static get(config:RequestConfig){

    }
}