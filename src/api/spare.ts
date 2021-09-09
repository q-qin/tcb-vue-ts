import {getApp} from '@/tcb';
import { notification } from 'ant-design-vue';
const app = getApp();


export function get(name:string) {
  return new Promise<any>(async(resolve,reject)=>{
    try{
      const db = app.database();
      const condition = name?{name:name}:{};
      const {data} = await db.collection('all_spares').where(condition).get()
      resolve(data);
    }catch(e){
      notification.error({ message: '服务器异常',description:e.message })
      reject()
    }
  })
}

export function update(param:any){
  return new Promise<{}>(async(resolve,reject)=>{
    try{
      const db = app.database();
      let res = {};
      if(!param._id){
        res = await db.collection('all_spares').add({...param})
      }else{
        res = await db.collection('all_spares').doc(param._id).update({
          name:param.name,
          count:param.count,
          money:param.money
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
      const res = await db.collection('all_spares').doc(_id).remove()
      resolve(res);
    }catch(e){
      notification.error({ message: '服务器异常',description:e.message })
      reject()
    }
  })
}

export function getOrder() {
  return new Promise<any>(async(resolve,reject)=>{
    try{
      const db = app.database();
      const {data} = await db.collection('db_customers').where({status:'工作中'}).get()
      resolve(data);
    }catch(e){
      notification.error({ message: '服务器异常',description:e.message })
      reject()
    }
  })
}

export function updateSpare(param :any) {
  return new Promise<{}>(async(resolve,reject)=>{
    try{
      const db = app.database();
      let res = await db.collection('db_customers').doc(param._id).update({
        spares:param.spares,
        price:param.price
      })
      resolve(res)
    }catch(e){
      notification.error({ message: '服务器异常',description:e.message })
      reject()
    }
  })
}