<template>
  <div class="redirect_container">
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Cookies from "js-cookie";
import { setLoc, getLoc } from '@/utils/util'
import bus from "@/utils/bus";
export default {
  created() {
    
  },
  mounted(){
    this.redirect();
  },
  computed: {
    ...mapState('media', ['isMobile']),
  },
  methods: {
    // 重定向方法，判断是否是移动端环境，跳转对应界面
    redirect() {
      let tokenName = this.$route.query.tokenName || 'token';
      const token = this.$route.query[tokenName];
      setLoc('mobile_token', token);
      if(this.$route.query.deviceType == "pc" || this.$route.query.deviceType == "Desktop") {
        this.$router.replace({ name: 'customerServerPc', query: this.$route.query });
        return;
      }

      if(this.$route.query.deviceType == "Mobile") {
        this.$router.replace({ name: 'customerServerMobile', query: this.$route.query })
        return;
      }
      if(this.isMobile) {
        this.$router.replace({ name: 'customerServerMobile', query: this.$route.query })
      } else {
        this.$router.replace({ name: 'customerServerPc', query: this.$route.query });
      }
    }
  }
}
</script>
