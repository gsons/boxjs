
export enum Err{
    BASE,HTTP,SYS,OTHER
};


class BaseErr extends Error {
    public code:Err;
    constructor(msg: string,code:Err =Err.BASE) {
        super(msg);
        this.name = 'baseErr';
        this.code=code;
        this.stack = (<any>new Error()).stack;
        Object.setPrototypeOf(this, BaseErr.prototype);
    }
}

export default BaseErr;