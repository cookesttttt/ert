<template>
  <Card style="height: 100%">
    <br> <br> <br>
    <Row type="flex" justify="center" class="top50">
      <Col span="18">
        <Col span="12">
          <Form :label-width="100">
            <FormItem label="文件名称:">
              <Input v-model="data.name" type="text" disabled style="width: 80%"></Input>
            </FormItem>
          </Form>
        </Col>
        <Col span="12">
          <Form :label-width="100">
            <FormItem label="文件大小:">
              <Input v-model="data.fileSize" type="text" disabled style="width: 80%"></Input>
            </FormItem>
          </Form>
        </Col>
        <Col span="12">
          <Form :label-width="100">
            <FormItem label="上传人:">
              <Input v-model="data.uploadRealName" type="text" disabled style="width: 80%"></Input>
            </FormItem>
          </Form>
        </Col>
        <Col span="12">
          <Form :label-width="100">
            <FormItem label="发文单位:">
              <Input v-model="data.reportDepartment" type="text" disabled style="width: 80%"></Input>
            </FormItem>
          </Form>
        </Col>
        <Col span="12">
          <Form :label-width="100">
            <FormItem label="文件分类:">
              <Input v-model="data.type" type="text" disabled style="width: 80%"></Input>
            </FormItem>
          </Form>
        </Col>
        <Col span="12">
          <Form :label-width="100">
            <FormItem label="分享给:">
              <Input v-model="shareName" type="text"  style="width: 80%" @on-focus="focusName"></Input>
            <!--  <Select
                style="width: 80%"
                v-model="user.id"
                multiple
                filterable
                remote
                :label-in-value=labe
                @on-change="getItemName"
                placeholder="请输入选择的人员"
                :remote-method="remoteMethod2"
                :loading="loading2">
                <Option v-for="item in userList" :value="item.id" :key="item.realName">{{item.realName}}</Option>
              </Select>-->
            </FormItem>
          </Form>
          <Modal
            v-model="isAddModal"
            @on-cancel="cancel"
            width="650"
            title="选择分享人"
            :mask-closable="false">
            <el-tabs type="border-card" style="height: 400px;overflow-y: scroll;" tab-position="left">
              <el-tab-pane :label="i.deptName" v-for="i in userList">
                <el-checkbox-group v-model="allUser">
                  <el-checkbox :label="j" v-for="j in i.teamerList" class="checkBoxstop" >{{j.realname}}</el-checkbox>
                </el-checkbox-group>
              </el-tab-pane>
            </el-tabs>
            <div slot="footer">
              <Button type="text"   size="large"  @click="cancel">取消</Button>
              <Button type="primary" size="large" @click="saveData">保存</Button>
            </div>
          </Modal>
        </Col>
        <Col span="24" class="center">
          <br><br>
          <ButtonGroup :size="buttonSize">
            <Button type="primary" @click="share" class="button_sty">保存</Button>
            <Button @click="close" class="button_sty">取消</Button>
          </ButtonGroup>
        </Col>
      </Col>
    </Row>
  </Card>
</template>

<script>
  import axios from '@/libs/api.request'
  import {mapMutations} from 'vuex'

  export default {
    name: 'share',
    data() {
      return {
        isAddModal:false,
        userList: [],
        allUser:[],
        loading2: false,
        shareName:'',
        select_cId: '',
        data: {},
        buttonSize: 'large',
        // options2: [],
        // labe: true,
        // FileId: '',
       /* user: {
          id: '',
          name: ''
        },
        */
      }
    },
    created() {
      this.getAllname()
      this.select_cId = sessionStorage.getItem('select_cId')
      axios.request({
        url: '/docs/share/fileInfo/' + this.select_cId,
        method: 'get'
      }).then(res => {
        if (res.data.msgCode === 0) {
          this.data = res.data.msgData
        }
      })
    },
    methods: {
      ...mapMutations([
        'closeTag'
      ]),
      close() {
        this.closeTag({
          name: '分享传阅',
        })
      },
      cancel(){
        this.allUser=[]
        this.isAddModal = false
      },
      focusName(){
        this.isAddModal=true
      },
      saveData(){
        this.isAddModal=false
        console.log(this.allUser)
        const str=[]
        this.allUser.forEach(v=>{
          if(this.allUser.length>1){
             str.push(v.realname)
            console.log(str)
            this.shareName=str.join(';')
          }else {
            this.shareName=v.realname
          }
        })
      },
      getAllname(){
        axios.request({
          url: '/uac/org/depts/teamers/' + JSON.parse(localStorage.getItem('projectId')).id,
          method: 'get'
        }).then(res => {
          if (res.data.msgCode === 0) {
            console.log(this.userList)
            this.userList = res.data.msgData
          }
        })
      },
      share() {
        console.log(this.allUser)
        if (this.allUser.length !== 0 && this.data.name) {
          let users = []
          this.allUser.forEach(v => {
            users.push({
              realName: v.realname,
              userId: v.userId
            })
          })
          console.log(users)
          let obj = {}
          obj.fileId = this.data.id
          obj.fileName = this.data.name
          obj.users = users
          obj.projectId = JSON.parse(localStorage.getItem('projectId')).id
          axios.request({
            url: '/docs/fileShares',
            data: obj,
            method: 'post'
          }).then(res => {
            if (res.data.msgCode === 0) {
              this.$Message.success('分享成功')
              this.close()
              this.$router.push({path: '/doc/Myshare'})
            } else {
              this.$Message.error('分享失败')
            }
          })
        } else {
          this.$Message.error('请输入分享人')
        }
      }
    }
  }
</script>
<style src='./index.css' scoped></style>
