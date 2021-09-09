import router from './router';

import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style

import { getToken } from '@/utils/jscookie'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

// NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/user/login', '/user/register']; // no redirect whitelist
router.beforeEach(async (to:any, from, next) => {
  // start progress bar
  NProgress.start();
  // set page title
  document.title = getPageTitle(to.meta.title);
  // 判断是否登录
  const hasToken = getToken();
  if(!hasToken){
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/user/login?redirect=${to.path}`)
    }
  }else{
    next();
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
