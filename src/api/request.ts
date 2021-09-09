import $axios from './interceptors';

class ApiRequest {
  // constructor () {}

  private static axios (options: object) {
    return $axios(options);
  }

  public static get (url: string, data: object, options: object = {}) {
    const axiosOptions = {
      url: url,
      data: data,
      method: 'GET',
      ...options
    };
    return this.axios(axiosOptions);
  }

  public static post (url: string, data: object, options: object = {}) {
    const axiosOptions = {
      url: url,
      data: data,
      method: 'POST',
      ...options
    };
    return this.axios(axiosOptions);
  }
}

export default ApiRequest;
