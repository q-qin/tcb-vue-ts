exports.main = async (event, context) => {
  if(event.type == '1'){
    if(event.username !='admin' || event.password != 'admin'){
      return {
        code:100,
        data:null,
        msg:'用户名密码错误',
      }
    }

    return {
      code: 200,
      data:`token-${event.username}`,
      msg:'操作成功'
    };
  }
  if(event.type == '2'){
    if(event.captcha != '123456'){
      return {
        code:100,
        data:null,
        msg:'验证码错误',
      }
    }
    return {
      code: 200,
      data:`token-${event.mobile}`,
      msg:'操作成功'
    };
  }
};
