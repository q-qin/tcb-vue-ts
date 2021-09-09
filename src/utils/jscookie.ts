import Cookies from 'js-cookie';

const KEY_TOKEN = 'xc_token'; // access_token
const EXPIRES = 1; // cookie过期时间(d)，0=session

// 获取access_token
export function getToken () {
  return Cookies.get(KEY_TOKEN);
};

// 设置access_token
export function setToken (value: string) {
  if (EXPIRES) {
    return Cookies.set(KEY_TOKEN, value, { expires: EXPIRES });
  }
  return Cookies.set(KEY_TOKEN, value);
}

// 清理token
export function clearToken () {
  Cookies.remove(KEY_TOKEN);
}
