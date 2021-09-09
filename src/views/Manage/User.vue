<template>
  <div class="page">
    <a-skeleton v-if="!loaded" />
    <div v-else>
      <a-card>
        <a-form layout="inline">
          <a-form-item label="姓名">
            <a-input
              v-model="form.name"
              allowClear
              placeholder="请输入姓名"
            ></a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="search">查询</a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="danger" icon="plus" @click="add">新增员工</a-button>
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
        <a-form-model-item label="姓名" prop="name">
          <a-input placeholder="请输入姓名" v-model="formEdit.name"></a-input>
        </a-form-model-item>
        <a-form-model-item label="修车水平" prop="level">
          <a-select  placeholder="请选择" v-model="formEdit.level">
            <a-select-option value="初级修理工">
              初级修理工
            </a-select-option>
            <a-select-option value="中级修理工">
              中级修理工
            </a-select-option>
            <a-select-option value="高级修理工">
              高级修理工
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="擅长领域" prop="goodat">
          <a-select mode="multiple" placeholder="请选择" v-model="formEdit.goodat">
            <a-select-option value="钣金">
              钣金
            </a-select-option>
            <a-select-option value="喷漆">
              喷漆
            </a-select-option>
            <a-select-option value="发动机">
              发动机
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="修车年限">
          <a-input-number
            style="width:100%"
            :min="0"
            :max="100"
            v-model="formEdit.jobyear"
          />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { get, update, remove } from '@/api/user';

@Component
export default class User extends Vue {
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
    { title: "姓名", dataIndex: "name" },
    { title: "等级", dataIndex:'level' },
    { title: "擅长领域", dataIndex:'goodat',customRender: (text:string)=>`${text}`},
    { title: "工作年限", dataIndex:'jobyear',customRender: (text:string)=>`${text}年` },
    { title: "操作",dataIndex:'id',scopedSlots: { customRender: 'action' }, },
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
    level:undefined,
    goodat:undefined,
    jobyear:10,
  };
  rulesForm = {
    name:[{required: true, message: '请输入姓名', trigger: 'blur' }],
    level:[{required: true, message: '请选择等级', trigger: 'blur' }],
    goodat:[{required: true, message: '请选择擅长领域', trigger: 'blur' }]
  };
  add(){
    this.formEdit = {
      _id:undefined,
      name:'',
      level:undefined,
      goodat:undefined,
      jobyear:10,
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
      content:'确定删除这个员工吗？',
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