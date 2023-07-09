interface MessageHandler<T extends any[] = any[]> {
  (sender: chrome.runtime.MessageSender, ...args: T): any;
}

interface MessageHandlersRecord {
  [type: string]: MessageHandler;
}

interface MessageObject<K extends string, U extends MessageHandler> {
  type: K;
  payload: PayloadType<U>;
}

type MessageObjectUnion<T extends MessageHandlersRecord> = {
  [K in Extract<keyof T, string>]: MessageObject<K, T[K]>;
}[Extract<keyof T, string>];

type PayloadType<T extends MessageHandler> = T extends MessageHandler<infer U> ? U : never;
type ResponseType<T extends (...args: any[]) => any> = Promise<Await<ReturnType<T>>>;
type Await<T> = T extends Promise<infer U> ? U : T;

export interface ComposedMessageHandler<T extends MessageHandlersRecord> {
  <M extends MessageObjectUnion<T>>(
    message: M,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void,
  ): boolean;
  isMessage(message: any): message is MessageObjectUnion<T>;
  handlers: T;
}

export interface MessageSender<T extends MessageHandlersRecord> {
  <K extends Extract<keyof T, string>>(type: K, ...params: PayloadType<T[K]>): ResponseType<T[K]>;
}

export const createMessageHandler = <T extends MessageHandlersRecord>(handlers: T) => {
  const handler: ComposedMessageHandler<T> = (message, sender, sendResponse) => {
    try {
      const response = handlers[message.type](sender, ...message.payload);
      if (response instanceof Promise) {
        response.then(sendResponse).catch((e) => {
          // eslint-disable-next-line no-console
          console.log(e);
          sendResponse(void 0);
        });
        return true;
      } else {
        sendResponse(response);
        return false;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      return false;
    }
  };
  handler.isMessage = (message): message is MessageObjectUnion<T> => {
    return message && typeof message === 'object' && message.type in handlers;
  };
  handler.handlers = handlers;

  return handler;
};
