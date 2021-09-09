<template>
  <div class="page">
    <a-skeleton v-if="!loaded" />
    <div v-else>
      <a-card>
        <a-form layout="inline">
          <a-form-item label="客户">
            <a-input
              v-model="form.name"
              allowClear
              placeholder="请输入客户名称、手机号"
            ></a-input>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="search">查询</a-button>
          </a-form-item>
          <a-form-item>
            <a-button type="danger" icon="plus" @click="add">客户登记</a-button>
          </a-form-item>
        </a-form>
      </a-card>
      <a-card class="margin-top-10" :bodyStyle="{ padding: 0 }">
        <a-table :loading="loading" :columns="columns" :data-source="list" :rowKey="(record, $index) => $index" :pagination="pagination">
          <p slot="expandedRowRender" slot-scope="record" >
            {{ record.damage }}
          </p>
          <p slot="status" slot-scope="text,record" >
            <a-badge  color="orange" v-if="text=='待派单'" :text="text"></a-badge >
            <a-badge  color="blue" v-if="text=='工作中'" :text="`${text} 【修理工：${record.worker}】`"></a-badge >
            <a-badge  color="green" v-if="text=='已完成'" :text="`${text} 【修理工：${record.worker}】`"></a-badge >
          </p>
          <p slot="priority" slot-scope="text" >
            <a-tag color="green" v-if="text=='一般'">{{ text }}</a-tag>
            <a-tag color="blue" v-if="text=='重要'">{{ text }}</a-tag>
            <a-tag color="red" v-if="text=='紧急'">{{ text }}</a-tag>
            <a-tag color="purple" v-if="text=='非常紧急'">{{ text }}</a-tag>
          </p>
          <span slot="action" slot-scope="text,record" v-if="record.status !='已完成'">
            <a-popconfirm
              title="修理结束，短信通知客户取车吗?"
              @confirm="complete(text)"
              
            >
              <a-button type="primary" class="margin-right-10" v-if="record.status =='工作中'">完成</a-button>
            </a-popconfirm>
            <a-popconfirm
              title="作废此订单吗?"
              @confirm="remove(text)"
            >
            <a-button type="danger" v-if="record.status =='待派单'">作废</a-button>
            </a-popconfirm>
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
        <a-row>
          <a-col :span="11">
            <a-form-model-item label="顾客称呼" prop="name">
              <a-input placeholder="先生/女士" v-model="formEdit.name"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="11" :offset="2">
            <a-form-model-item label="手机号" prop="mobile">
              <a-input placeholder="手机号" v-model="formEdit.mobile"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="11">
            <a-form-model-item label="车型" prop="model">
              <a-select v-model="formEdit.model" placeholder="请选择">
                <a-select-option v-for="(item,$index) in carmodels" :key="$index" :value="item.model">{{item.model}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="11" :offset="2">
            <a-form-model-item label="车牌" prop="plate">
              <a-input v-model="formEdit.plate" placeholder="请输入车牌">
                <a-select slot="addonBefore" v-model="formEdit.plateBefore" >
                  <a-select-option value="苏B">
                    苏B
                  </a-select-option>
                  <a-select-option value="苏E">
                    苏E
                  </a-select-option>
                  <a-select-option value="苏U">
                    苏U
                  </a-select-option>
                </a-select>
              </a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="11">
            <a-form-model-item label="车龄" prop="age">
              <a-input v-model="formEdit.age" suffix="年" placeholder="请输入车龄"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="11" :offset="2">
            <a-form-model-item label="里程数" prop="odo">
              <a-input v-model="formEdit.odo" suffix="万公里" placeholder="请输入公里数"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
            <a-form-model-item label="优先级" prop="priority">
              <a-select v-model="formEdit.priority" placeholder="请选择">
                <a-select-option value="一般">
                  一般
                </a-select-option>
                <a-select-option value="重要">
                  重要
                </a-select-option>
                <a-select-option value="紧急">
                  紧急
                </a-select-option>
                <a-select-option value="非常紧急">
                  非常紧急
                </a-select-option>
              </a-select>
            </a-form-model-item>
        </a-row>
        <a-row>
          <a-form-model-item label="车损情况" prop="damage">
            <a-textarea
              v-model="formEdit.damage"
              placeholder="请描述车辆损坏情况~"
              :auto-size="{ minRows: 2, maxRows: 6 }"
            />
          </a-form-model-item>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { get,checkin, complete, remove } from '@/api/checkin';
import { get as getCarModel } from '@/api/car';

@Component
export default class Dengji extends Vue {
  loaded = false;
  created() {
    setTimeout(() => {
      this.loaded = true;
      this.getCarModels();
      this.getList();
    }, 1e3);
  }
  form = {
    name:''
  }
  loading = false;
  columns = [{
    title:'姓名',
    dataIndex:'name',
  },{
    title:'手机号',
    dataIndex:'mobile'
  },{
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
    title:'完成时间',
    dataIndex:'okTime',
  },{
    title:'操作',
    dataIndex:'_id',
    scopedSlots: { customRender: 'action' },
  }]
  list=[]
  pagination = {
    current: 1,
    total: 0,
    pageSize: 10,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total: string) => `共有 ${total} 条数据`
  }

  async getList(){
    this.loading = true;
    const list = await get(this.form.name);
    this.loading = false;
    this.list = list;
  }

  carmodels = [];
  async getCarModels(){
    const list = await getCarModel('');
    this.carmodels = list;
  }

  visible = false;
  formEdit = {
    name:'',  // 名称
    mobile:'',  // 手机号
    plateBefore:'苏E',
    plate:'', // 车牌
    model:undefined, // 车型
    priority:undefined, // 优先级
    age:'', // 车龄
    odo:'',  // 里程数
    damage:'',  // 损坏情况
  };

  rulesForm = {
    name:[{required: true, message: '请输入客户称呼', trigger: 'blur' }],
    mobile:[{required: true, message: '请输入客户手机号', trigger: 'blur' }],
    model:[{required: true, message: '请选择车型', trigger: 'blur' }],
    plate:[{required: true, message: '请输入车牌', trigger: 'blur' }],
    priority:[{required: true, message: '请选择优先级', trigger: 'blur' }],
    age:[{required: true, message: '请输入车龄', trigger: 'blur' }],
    odo:[{required: true, message: '请输入里程数', trigger: 'blur' }],
    damage:[]
  }
  
  get getformPass():Vue & { validate: () => boolean, resetFields:()=>void } {
    return this.$refs.formEdit as Vue & { validate: () => boolean, resetFields:()=>void }
  }

  add(){
    this.visible = true;
    this.$nextTick(()=>{
      this.getformPass.resetFields();
    })
  }
  search(){
    this.pagination.current = 1;
    this.getList();
  }
  async handleOk(){
    const valid = await this.getformPass.validate()
    if (valid) {
      checkin({...this.formEdit,plate:`${this.formEdit.plateBefore}${this.formEdit.plate}`}).then(()=>{
        this.$message.success('登记成功，请引导客户去贵宾等候区~')
        this.visible = false;
        this.search();
      })
    }
  }
  async complete(_id:string){
    await complete({_id:_id});
    this.$notification.success({message:'提示',description:'短信已通知客户~'});
    this.search();
  }
}
</script>

<style lang="less" scoped>

</style>