<template>
  <div>
    <el-card class="box-card">
      <h3>H5客服</h3>
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item title="客服配置" name="1">
          <el-steps direction="vertical" process-status="success">
            <el-step>
              <template slot="title">
                <div class="title">点击客服管理-添加，创建客服账号：</div>
              </template>

              <template slot="description">
                <img class="guideImg" src="../assets/guide/1.png" alt="" />
              </template>
            </el-step>
            <el-step>
              <template slot="title">
                <div class="title">
                  输入客服账号密码，下拉选择分配的应用ID，调整客服状态开关（停用/启用）后点击确定创建客服账号：
                </div>
              </template>

              <template slot="description">
                <img class="guideImg" src="../assets/guide/2.png" alt="" />
              </template>
            </el-step>
            <el-step>
              <template slot="title">
                <div class="title">创建成功</div>
              </template>
              <template slot="description">
                <!-- <img class="guideImg" src="../assets/guide/3.png" alt="" /> -->
              </template>
            </el-step>
          </el-steps>
        </el-collapse-item>
        <el-collapse-item title="会话链接" name="2">
          <el-steps direction="vertical">
            <el-step>
              <template slot="title">
                <div class="title">web应用地址：</div>
              </template>
              <template slot="description">
                <img class="guideImg" src="../assets/guide/4.png" alt="" />
              </template>
            </el-step>
            <el-step>
              <template slot="title">
                <div class="title">开发人员按需选择：</div>
              </template>
              <template slot="description">
                <img class="guideImg" src="../assets/guide/5.png" alt="" />
              </template>
            </el-step>
          </el-steps>
        </el-collapse-item>
        <el-collapse-item title="客服登录" name="3">
          <div>前往此地址使用客服用户名及密码登录客服平台</div>
          <a>https://wschat.micome.vip/client/index.html#/dashboard</a>
        </el-collapse-item>
      </el-collapse>
    </el-card>
    <el-card class="box-card">
      <h3>WhatsApp客服</h3>
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item title="客服配置" name="4">
          <el-steps direction="vertical" process-status="success">
            <el-step>
              <template slot="title">
                <div class="title">点击客服管理-添加，创建客服账号：</div>
              </template>

              <template slot="description">
                <img class="guideImg" src="../assets/guide/6.png" alt="" />
              </template>
            </el-step>
            <el-step>
              <template slot="title">
                <div class="title">
                  输入客服账号密码，下拉选择分配的手机号，调整客服状态开关（停用/启用）后点击确定创建客服账号：
                </div>
              </template>

              <template slot="description">
                <img class="guideImg" src="../assets/guide/7.png" alt="" />
              </template>
            </el-step>
            <el-step>
              <template slot="title">
                <div class="title">创建成功</div>
              </template>
              <template slot="description">
                <!-- <img class="guideImg" src="../assets/guide/3.png" alt="" /> -->
              </template>
            </el-step>
          </el-steps>
        </el-collapse-item>

        <el-collapse-item title="客服登录" name="5">
          <div>前往此地址使用客服用户名及密码登录客服平台</div>
          <a>https://wschat.micome.vip/client/index.html#/dashboard</a>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activeNames: ['1'],
        // activeNames2: ['1'],
      }
    },
    methods: {},
  }
</script>
<style lang="scss" scoped>
  .title {
    font-size: 13px;
    color: #333;
    margin: 0px 0 12px;
  }
  .guideImg {
    max-width: 100%;
    height: auto;
    margin-bottom: 12px;
  }
</style>
