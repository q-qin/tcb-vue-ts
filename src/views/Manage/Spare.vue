<template>
  <div class="page">
    <a-skeleton v-if="!loaded" />
    <div v-else>
      <a-card>
        <a-form layout="inline">
          <a-form-item label="名称">
            <a-input
              v-model="form.name"
              allowClear
              placeholder="请输入配件名称"
            ></a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="search">查询</a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="danger" icon="plus" @click="add">新增配件</a-button>
          </a-form-item>
        </a-form>
      </a-card>
      <a-card class="margin-top-10" :bodyStyle="{ padding: 0 }">
        <a-table :loading="loading" :columns="columns" :data-source="list" :rowKey="(record, $index) => $index" :pagination="pagination">
          <span slot="action" slot-scope="text,record">
            <a-button type="primary" class="margin-right-10" @click="edit(text,record)">编辑</a-button>
            <a-button type="danger" @click="del(text)">删除</a-button>
          </span>
        </a-table>
      </a-card>
    </div>
    <!-- 表单 -->
    <a-modal
      title="编辑表单"
      :visible="visible"
      @ok="handleOk"
      @cancel="visible = false;"
    >
      <a-form-model ref="formEdit" :model="formEdit" :rules="rulesForm">
        <a-form-model-item label="配件名称" prop="name">
          <a-input placeholder="请输入配件名称" v-model="formEdit.name"></a-input>
        </a-form-model-item>
        <a-form-model-item label="成本价格" prop="money">
          <a-input placeholder="请输入成本价格" v-model="formEdit.money"></a-input>
        </a-form-model-item>
        <a-form-model-item label="库存" prop="count">
          <a-input placeholder="请输入库存" v-model="formEdit.count"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { get, update, remove } from '@/api/spare';

@Component
export default class Spare extends Vue {
  loaded = false;
  created() {
    setTimeout(() => {
      this.loaded = true;
      this.getList()
    }, 1e3);
  }

  form = {
    name: "",
  };
  pagination = {
    current: 1,
    total: 0,
    pageSize: 10,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total: string) => `共有 ${total} 条数据`
  }
  columns = [
    { title: "配件名称", dataIndex: "name" },
    { title: "成本价格", dataIndex:'money' ,customRender: (text:string)=>`￥${text}`,},
    { title: "库存", dataIndex:'count' },
    { title: "操作",dataIndex:'_id',scopedSlots: { customRender: 'action' }, },
  ];
  
  search(){
    this.pagination.current = 1;
    this.getList();
  }
  loading = false;
  list = [];

  async getList(){
    this.loading = true;
    const list = await get(this.form.name);
    this.loading = false;
    this.list = list;
  }

  visible = false;
  formEdit = {
    _id:undefined,
    name:'',
    money:'',
    count:'',
  };
  rulesForm = {
    name:[{required: true, message: '请输入配件名称', trigger: 'blur' }],
    money:[{required: true, message: '请输入成本价', trigger: 'blur' }],
    count:[{required: true, message: '请输入库存', trigger: 'blur' }]
  };
  add(){
    this.formEdit = {
      _id:undefined, 
      name:'',
      money:'',
      count:'',
    }
    this.visible = true;
  }
  get getformPass():Vue & { validate: () => boolean } {
    return this.$refs.formEdit as Vue & { validate: () => boolean }
  }

  async handleOk(){
    const valid = await this.getformPass.validate()
    if (valid) {
      update({...this.formEdit}).then(()=>{
        this.$message.success(this.formEdit._id?'编辑成功~':'新增成功~')
        this.visible = false;
        this.search();
      })
    }
  }

  edit(id:string,obj:any){
    this.formEdit = {
      ...obj
    }
    this.visible = true;
  }

  del(id:string){
    this.$confirm({
      title: '提示',
      content:'确定删除这个配件吗？',
      onOk:async ()=> {
        await remove(id);
        this.$message.success('删除成功~')
        this.search();
      },
    })
  }
}
</script>
<style lang="less" scoped>
  
</style>