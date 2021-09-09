import request from './request';

import {getApp} from '@/tcb';
import { notification } from 'ant-design-vue';
const app = getApp();

// demo
export function demo (data: any) {
  return request.post('/demo', data);
}

export function login(data:any) {
  return new Promise<{}>(async(resolve,reject)=>{
    try{
      app.callFunction({
        name: 'login', data:{...data}
      }).then((result:any)=>{
        console.log(result);
        resolve(result)
      }).catch((e: any)=>{
        notification.error({ message: '服务器异常', description:e.message });
        reject()
      })
    }catch(e){
      notification.error({ message: '服务器异常',description:e.message })
      reject()
    }
  })
}

export function get(name:string) {
  return new Promise<any>(async(resolve,reject)=>{
    try{
      const db = app.database();
      const condition = name?{name:name}:{};
      const {data} = await db.collection('all_users').where(condition).get()
      resolve(data);
    }catch(e){
      notification.error({ message: '服务器异常',description:e.message })
      reject()
    }
  })
}

export function update(param:any) {
  return new Promise<{}>(async(resolve,reject)=>{
    try{
      const db = app.database();
      let res = {};
      if(!param._id){
        res = await db.collection('all_users').add({...param})
      }else{
        res = await db.collection('all_users').doc(param._id).update({
          name:param.name,
          goodat:param.goodat,
          level:param.level,
          jobyear:param.jobyear,
        })
      }
      resolve(res)
    }catch(e){
      notification.error({ message: '服务器异常',description:e.message })
      reject()
    }
  })
}

export function remove(_id:string) {
  return new Promise<{}>(async(resolve,reject)=>{
    try{
      const db = app.database();
      const res = await db.collection('all_users').doc(_id).remove()
      resolve(res);
    }catch(e){
      notification.error({ message: '服务器异常',description:e.message })
      reject()
    }
  })
}
