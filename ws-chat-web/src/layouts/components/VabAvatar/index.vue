<template>
  <el-row>
    <el-row>
      <el-col :span="10">
        <span class="avatar-dropdown">
          <div class="user-name">
            {{ username }}
          </div>
        </span>
      </el-col>
      <el-col :span="14">
        <el-button
          @click.native="logout()"
          size="mini"
          type="text"
          class="logout-button"
        >
          退出登录
        </el-button>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { recordRoute } from '@/config'

  export default {
    name: 'VabAvatar',
    computed: {
      ...mapGetters({
        avatar: 'user/avatar',
        username: 'user/username',
      }),
    },
    methods: {
      handleCommand(command) {
        switch (command) {
          case 'logout':
            this.logout()
            break
        }
      },
      personalCenter() {
        this.$router.push('/personalCenter/personalCenter')
      },
      logout() {
        this.$baseConfirm(
          '您确定要退出' + this.$baseTitle + '吗?',
          null,
          () => {
            this.$store.state.user.permissions = []
            localStorage.clear()
            this.$router.push('/login')
          }
        )
      },
    },
  }
</script>
<style lang="scss" scoped>
  .avatar-dropdown {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    justify-items: center;
    height: 50px;
    padding: 0;

    .user-avatar {
      width: 100px;
      height: 40px;
      cursor: pointer;
      border-radius: 50%;
    }

    .user-name {
      position: relative;
      margin-left: 5px;
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .logout-button {
    height: 50px;
    text-align: right;
    margin-left: 30px;
  }
</style>
