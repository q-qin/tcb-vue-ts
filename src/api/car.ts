import {getApp} from '@/tcb';
import { notification } from 'ant-design-vue';
const app = getApp();

export function get(model:string) {
  return new Promise<any>(async(resolve,reject)=>{
    try{
      const db = app.database();
      const condition = model?{model:model}:{};
      const {data} = await db.collection('all_cars').where(condition).get()
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
      let data = {};
      if(!param._id){
        data = await db.collection('all_cars').add({...param})
      }else{
        data = await db.collection('all_cars').doc(param._id).update({
          model:param.model,
          brand:param.brand
        })
      }
      resolve(data)
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
      const data = await db.collection('all_cars').doc(_id).remove()
      resolve(data);
    }catch(e){
      notification.error({ message: '服务器异常',description:e.message })
      reject()
    }
  })
}
