export function request<R>(option: RequestOptions): Promise<R> {
  if (typeof XMLHttpRequest === 'undefined') {
    return Promise.reject(Error('not support XMLHttpRequest'));
  }

  const xhr = new XMLHttpRequest();
  const action = option.url;
  const method = (option.method || 'post').toLowerCase().trim();

  if (method === 'get') {
    const url =
      action +
      '?' +
      Object.entries(option.params || {}).reduce((pre, cur) => {
        const [key, value] = cur;
        return pre + '&' + key + '=' + value;
      }, '');
    xhr.open(method, url, true);
  } else {
    xhr.open(method, action, true);
  }

  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true;
  }

  const headers = option.headers || {};

  for (const [key, value] of Object.entries(headers)) {
    if (headers.hasOwnProperty(key) && value !== null && value !== void 0) {
      xhr.setRequestHeader(key, value);
    }
  }

  return new Promise((resolve, reject) => {
    xhr.onerror = function error(e) {
      reject(e);
    };

    xhr.onload = function onload() {
      if (xhr.status < 200 || xhr.status >= 300) {
        return reject(getError(action, option, xhr));
      }

      resolve(getBody(xhr));
    };

    if (method === 'post') {
      try {
        xhr.send(JSON.stringify(option.data));
      } catch (error) {
        xhr.send();
      }
    } else if (method === 'get') {
      xhr.send();
    }
  });
}

function getError(action: string, option: RequestOptions, xhr: XMLHttpRequest) {
  let msg;
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`;
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`;
  } else {
    msg = `fail to post ${action} ${xhr.status}`;
  }

  const err = new Error(msg) as Error & {
    status: number;
    method: string;
    url: string;
  };
  err.status = xhr.status;
  err.method = option.method || 'post';
  err.url = action;
  return err;
}

function getBody(xhr: XMLHttpRequest) {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

export type RequestOptions = {
  method?: RequestMethodType;
  url: string;
  headers?: Object;
  withCredentials?: boolean;
  params?: object;
  data?: object;
};

export type RequestMethodType = 'get' | 'post' | 'GET' | 'POST';
