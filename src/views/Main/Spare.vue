<template>
  <div class="page">
    <a-table :columns="columns" :data-source="list" :rowKey="(record, $index) => $index">
      <p slot="expandedRowRender" slot-scope="record" >
        {{ record.damage }}
      </p>
      <p slot="status" slot-scope="text" >
        <a-badge  color="orange" v-if="text=='待派单'" :text="text"></a-badge >
        <a-badge  color="blue" v-if="text=='工作中'" :text="text"></a-badge >
      </p>
      <p slot="priority" slot-scope="text" >
        <a-tag color="green" v-if="text=='一般'">{{ text }}</a-tag>
        <a-tag color="blue" v-if="text=='重要'">{{ text }}</a-tag>
        <a-tag color="red" v-if="text=='紧急'">{{ text }}</a-tag>
        <a-tag color="purple" v-if="text=='非常紧急'">{{ text }}</a-tag>
      </p>
      <div slot="spares" slot-scope="text" >
        <p v-for="(item,$index) in text" :key="$index" >{{item.name}} | {{item.value}}</p>
      </div>
      <span slot="action" slot-scope="text" >
        <a-button type="primary" @click="addSpare(text)">申领配件</a-button>
      </span>
    </a-table>
    <!-- 选配件 -->
    <a-modal v-model="visible" title="选择配件" @ok="handleOk" :body-style="{padding:0}">
      <a-table :columns="spareCols" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,}" :data-source="spareList" :rowKey="(record, $index) => $index" :pagination="false">
        <span slot="action" slot-scope="text,record" >
          <a-input v-model="record.shuliang" placeholder="输入数量" style="width: 100px;" allowClear ></a-input>
        </span>
      </a-table>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getOrder,get as getSpare ,updateSpare } from '@/api/spare';

@Component
export default class Spare extends Vue {
  private created(){
    this.getList();
    this.getSpare();
  }
  list = []
  columns= [{
    title:'车牌',
    dataIndex:'plate'
  },{
    title:'车型',
    dataIndex:'model'
  },{
    title:'车龄',
    dataIndex:'age',
    customRender: (text:string)=>`${text}年`,
  },{
    title:'公里数',
    dataIndex:'odo',
    customRender: (text:string)=>`${text}万`,
  },{
    title:'状态',
    dataIndex:'status',
    scopedSlots: { customRender: 'status' },
  },{
    title:'优先级',
    dataIndex:'priority',
    scopedSlots: { customRender: 'priority' },
  },{
    title:'登记时间',
    dataIndex:'checkinTime',
  },{
    title:'配件',
    dataIndex:'spares',
    scopedSlots: { customRender: 'spares' },
  },
  {
    title:'操作',
    dataIndex:'_id',
    scopedSlots: { customRender: 'action' },
  }]

  private async getList (){
    const data = await getOrder()
    this.list = data;
  }

  spareList:any = [];
  spareCols = [{
    title:'名称',
    dataIndex:'name'
  },{
    title:'价格(元)',
    dataIndex:'money'
  },{
    title:'库存',
    dataIndex:'count'
  },{
    title:'申领数量',
    dataIndex:'_id',
    scopedSlots: { customRender: 'action' },
  }];
  private async getSpare(){
    const data = await getSpare('')
    this.spareList = data.concat([{_id:'-999',name:'工时费',money:'自定义',count:1}]);
  }

  visible = false;
  editId = '';
  addSpare(_id:string){
    this.editId = _id;
    this.visible = true;
  }

  selectedRowKeys= []
  Spares = []
  onSelectChange(selectedRowKeys:any){
    this.selectedRowKeys = selectedRowKeys;
  }
  async handleOk(){
    if(!this.selectedRowKeys.length){
      return false;
    }
    let sapreArr:any = [];
    let sum = 0;
    this.selectedRowKeys.forEach(m=>{
      if(!this.spareList[m].shuliang){
        this.$message.error('请填写数量');
        return false;
      }
      sapreArr.push({
        name:this.spareList[m].name,
        value:this.spareList[m].name == '工时费'?this.spareList[m].shuliang:`${this.spareList[m].shuliang * this.spareList[m].money}`,
      })
      sum += this.spareList[m].name == '工时费'?Number(this.spareList[m].shuliang):Number(this.spareList[m].shuliang * this.spareList[m].money);
    })
    if(sapreArr.length>0){
      await updateSpare({_id:this.editId,spares:sapreArr,price:sum});
      this.$notification.success({message:'提示',description:'申领成功，等待出库~'});
      this.getList()
      this.getSpare()
    }
  }
}
</script>

<style>

</style>