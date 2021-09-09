import {getApp} from '@/tcb';
import { notification } from 'ant-design-vue';
const app = getApp();

export function get(plate:string) {
  return new Promise<any>(async(resolve,reject)=>{
    try{
      const db = app.database();
      const _ = db.command;
      let condition = _.or([{status :'已完成'},{status:'工作中'}]);
      const {data} = await db.collection('db_customers').where(condition).get()
      resolve(data);
    }catch(e){
      notification.error({ message: '服务器异常',description:e.message })
      reject()
    }
  })
}

export function bill(_id:string){
  return new Promise<any>(async(resolve,reject)=>{
    try{
      const db = app.database();
      let res = await db.collection('db_customers').doc(_id).update({
          bill:true
        })
      resolve(res)
    }catch(e){
      notification.error({ message: '服务器异常',description:e.message })
      reject()
    }
  })
}

