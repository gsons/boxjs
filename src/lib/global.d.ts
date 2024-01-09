type ScriptResponse = {
    status: number,
    headers: Record<string, string>,
    body: string,
}

type VpnResult = (Partial<ScriptResponse> & { url?: string, response?: Partial<ScriptResponse> }) | false;

type ScriptRequest = {
    url: string,
    body: string,
    method: 'get' | 'GET' | 'post' | 'POST' | 'put' | 'PUT' | 'delete' | 'DELETE' | 'options' | 'OPTIONS' | 'patch' | 'PATCH',
    headers: Record<string, string> 
}

type HttpOption = Partial<ScriptRequest>  & { url: string};

type HttpResponse = ScriptResponse & { statusCode: number};

type HttpClient = {
    [key in Lowercase<ScriptRequest['method']>]: (options: HttpOption, callback: (error: string, response: Pick<ScriptResponse, 'status' | 'headers'>, body: string) => void) => void;
};

declare let $task: {fetch(opts:any):Promise<any>};

declare let $persistentStore: {
    write(key: string, val: string): boolean,
    read(key: string): string | null
};
declare let $prefs: {
    setValueForKey(key: string, val: string): boolean,
    valueForKey(key: string): string | null
};
declare let $httpClient: any;
declare let $loon: unknown;
declare let $rocket: unknown;
declare let $notification: { post(title: string, subtitle: string, body: string): void };
declare let $notify: (title: string, subtitle: string, body: string) => void;
declare let $done: (obj: VpnResult) => void;
declare let $request: ScriptRequest;
declare let $argument: string;
declare let $response: ScriptResponse;






