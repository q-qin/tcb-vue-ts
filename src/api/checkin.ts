import {getApp} from '@/tcb';
import { notification } from 'ant-design-vue';
import moment from 'moment';
const app = getApp();

export function get(name:string) {
  return new Promise<any>(async(resolve,reject)=>{
    try{
      const db = app.database();
      const _ = db.command;
      const condition = name?_.or([{name:name},{mobile:name}]):{};
      const {data} = await db.collection('db_customers').where(condition).orderBy('checkinTime','desc').get()
      resolve(data);
    }catch(e){
      notification.error({ message: '服务器异常',description:e.message })
      reject()
    }
  })
}

export function checkin(param:any){
  return new Promise<{}>(async(resolve,reject)=>{
    try{
      const db = app.database();
      let res = await db.collection('db_customers').add({...param,
        status:'待派单',
        checkinTime:moment().format('YYYY-MM-DD hh:mm'),
        worker:'',
        okTime:'',
        price:'',
        spares:[],
        bill:false
      })
      resolve(res)
    }catch(e){
      notification.error({ message: '服务器异常',description:e.message })
      reject()
    }
  })
}

export function complete(param:any){
  return new Promise<{}>(async(resolve,reject)=>{
    try{
      const db = app.database();
      let res = await db.collection('db_customers').doc(param._id).update({
          status:'已完成',
          okTime:moment().format('YYYY-MM-DD hh:mm')
        })
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
      const res = await db.collection('db_customers').doc(_id).remove()
      resolve(res);
    }catch(e){
      notification.error({ message: '服务器异常',description:e.message })
      reject()
    }
  })
}
