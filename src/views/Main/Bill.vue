<template>
  <div class="page">
    <a-skeleton v-if="!loaded" />
    <div v-else>
      <a-card class="margin-top-10" :bodyStyle="{ padding: 0 }">
        <a-table :columns="columns" :data-source="list" :rowKey="(record, $index) => $index" :pagination="pagination">
         <div slot="spares" slot-scope="text" >
            <p v-for="(item,$index) in text" :key="$index" >{{item.name}} | {{item.value}}</p>
          </div>
          <span slot="action" slot-scope="text,record" v-if="!record.bill">
            <a-popconfirm
              title="是否开票给客户?"
              @confirm="bill(text)"
            >
              <a-button type="primary" class="margin-right-10" >开票</a-button>
            </a-popconfirm>
          </span>
        </a-table>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts">
import { get,bill } from '@/api/bill';
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Bill extends Vue {
  loaded = false;
  created() {
    setTimeout(() => {
      this.loaded = true;
      this.getList();
    }, 1e3);
  }
  list = [];
  pagination={
    current: 1,
    total: 0,
    pageSize: 10,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total: string) => `共有 ${total} 条数据`
  }
  columns=[{
    title:'车牌',
    dataIndex:'plate'
  },{
    title:'型号',
    dataIndex:'model'
  },{
    title:'客户',
    dataIndex:'name',
  },{
    title:'手机号',
    dataIndex:'mobile',
  },{
    title:'修理费',
    dataIndex:'price'
  },{
    title:'修理工',
    dataIndex:'worker'
  },{
    title:'配件',
    dataIndex:'spares',
    scopedSlots: { customRender: 'spares' },
  },{
    title:'是否开票',
    dataIndex:'bill',
    customRender: (text:string)=>`${text?'是':'否'}`,
  },{
    title:'操作',
    dataIndex:'_id',
    scopedSlots: { customRender: 'action' },
  }]
  async getList(){
    const data = await get('');
    this.list = data;
  }

  async bill(_id:string){
    await bill(_id);
    this.$notification.success({message:'提示',description:'发票已开给客户~'});
    this.getList();
  }
}
</script>

<style>

</style>