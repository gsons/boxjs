import axios from 'axios';

export type RequestHeaders = Record<string, string | number | boolean>;
export type Method = 'get' | 'GET' | 'post' | 'POST';
export type ResponseHeader = Record<string, string> & { "set-cookie"?: string[] };

export type RequestData = Record<string, string | number | boolean>;


export interface RequestConfig<D>{
    url: string;
    method?: Method;
    headers?: RequestHeaders;
    data?: D,
}

export interface Response<T = any> {
    body: T;
    status: number;
    statusText: string;
    headers: ResponseHeader;
}


    
