<template>
  <div class="page">
    <a-skeleton v-if="!loaded" />
    <div v-else>
      <a-card>
        <a-form layout="inline">
          <a-form-item label="车牌">
            <a-input
              v-model="form.plate"
              allowClear
              placeholder="请输入车牌"
            ></a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="search">查询</a-button>
          </a-form-item>
        </a-form>
      </a-card>
      <a-card class="margin-top-10" :bodyStyle="{ padding: 0 }">
        <a-table :loading="loading" :columns="columns" :data-source="list" :rowKey="(record, $index) => $index" :pagination="pagination">
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
          <span slot="action" slot-scope="text,record" v-if="record.status !='工作中'">
            <a-button type="primary" @click="doWork(text)">派单</a-button>
          </span>
        </a-table>
      </a-card>
    </div>
    <!-- 选人 -->
    <a-modal v-model="visible" title="选择修理工" @ok="handleOk" :body-style="{padding:0}">
      <a-table :columns="workerCols" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange,type:'radio' }" :data-source="workerList" :rowKey="(record, $index) => $index" :pagination="false">

      </a-table>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { get,dowork } from '@/api/checkout';
import { get as getWorkers } from '@/api/user';

@Component
export default class Gongdan extends Vue {
  loaded = false;
  created() {
    setTimeout(() => {
      this.loaded = true;
      this.getList();
      this.getWorkers();
    }, 1e3);
  }
  form = {
    plate:''
  }
  loading = false;
  columns = [{
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
    title:'修理工',
    dataIndex:'worker',
  },{
    title:'操作',
    dataIndex:'_id',
    scopedSlots: { customRender: 'action' },
  }];
  list = [];
  pagination = {
    current: 1,
    total: 0,
    pageSize: 10,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total: string) => `共有 ${total} 条数据`
  }

  search(){
    this.pagination.current = 1;
    this.getList();
  }
  async getList(){
    const data = await get('');
    this.list = data;
  }

  workerList:any = [];
  workerCols = [{title:'姓名',dataIndex:'name'},
    { title: "等级", dataIndex:'level' },
    { title: "擅长领域", dataIndex:'goodat',customRender: (text:string)=>`${text}`},
    { title: "工作年限", dataIndex:'jobyear',customRender: (text:string)=>`${text}年` },]
  async getWorkers(){
    const data = await getWorkers('');
    this.workerList = data;
  }
  visible = false;
  workerId = '';
  doWork(_id:string){
    this.workerId = _id;
    this.visible = true;
  }
  pickWorker = '';
  selectedRowKeys= []
  onSelectChange(selectedRowKeys:any){
    this.selectedRowKeys = selectedRowKeys;
  }
  async handleOk(){
    if(!this.selectedRowKeys.length){
      this.$message.error('您还未选修理工！')
      return false;
    }
    const {name} = this.workerList[this.selectedRowKeys[0]]
    await dowork(this.workerId,name)
    this.$notification.success({message:'提示',description:'工单分配给修理工~'});
    this.search();
  }
}
</script>

<style>

</style>