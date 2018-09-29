import {Action} from './action';

export interface ChatMessage {
    from?: any;
    time?:any;
    fromId?:any;
    content?: any;
    type?: Action;
    group:any;
    channel:any;
}