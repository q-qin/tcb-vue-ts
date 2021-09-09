<template>
  <div class="page">
    <a-skeleton v-if="!loaded" />
    <div v-else>
      <a-card>
        <a-form layout="inline">
          <a-form-item label="品牌">
            <a-input
              v-model="form.model"
              allowClear
              placeholder="请输入品牌"
            ></a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="search">查询</a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="danger" icon="plus" @click="add">新增车型</a-button>
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
        <a-form-model-item label="品牌" prop="brand">
          <a-select placeholder="请选择" v-model="formEdit.brand">
            <a-select-option value="大众">
              大众
            </a-select-option>
            <a-select-option value="丰田">
              丰田
            </a-select-option>
            <a-select-option value="本田">
              本田
            </a-select-option>
            <a-select-option value="奔驰">
              奔驰
            </a-select-option>
            <a-select-option value="宝马">
              宝马
            </a-select-option>
            <a-select-option value="奥迪">
              奥迪
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="车型" prop="model">
          <a-input placeholder="型号" v-model="formEdit.model"></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { get, update, remove } from '@/api/car';

@Component
export default class Car extends Vue {
  loaded = false;
  created() {
    setTimeout(() => {
      this.loaded = true;
      this.getList();
    }, 1e3);
  }

  form = {
    model: "",
  };
  loading = false;
  list = []
  columns=[
    { title: "型号", dataIndex: "model" },
    { title: "品牌", dataIndex:'brand' },
    { title: "操作",dataIndex:'_id',scopedSlots: { customRender: 'action' }, },
  ];
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
    this.loading = true;
    const list = await get(this.form.model);
    this.loading = false;
    this.list = list;
  }

  visible = false;
  formEdit = {
    _id:undefined,
    model:'',
    brand:undefined
  };
  rulesForm = {
    model:[{required: true, message: '请输入车型', trigger: 'blur' }],
    brand:[{required: true, message: '请输入品牌', trigger: 'blur' }]
  };
  add(){
    this.formEdit = {
      _id:undefined,
      model:'',
      brand:undefined
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
      content:'确定删除这个车型吗？',
      onOk:async ()=> {
        await remove(id);
        this.$message.success('删除成功~')
        this.search();
      },
    })
  }
}
</script>

<style>

</style>