<script>
import yidu from "@/assets/img/yidu1.png"
import weidu from "@/assets/img/weidu1.png"
export default {
  name: "lemonMessageText",
  inheritAttrs: false,
  inject: ["IMUI"],
  render() {
    return (
      <lemon-message-basic
        class="lemon-message-text"
        props={{ ...this.$attrs }}
        scopedSlots={{
          content: props => {
            const content = this.IMUI.emojiNameToImage(props.content);
            return h('div', {}, [h('div', {}, [content]),
            h('div', { class: { text: true, displayStyle: !props.translator } }, [props.translator]),
            h('div', { class: {"poretions":true,} }, [
              h('img', {
                class: {
                  "displayNone":true,
                  "weidu":true,
                  "poretions":true,
                  "displblock": props.fromUser.id == 99999999999 && props.status == 'send',
                },
                attrs:{
                  title:"已发送",
                  src:weidu,
                }
              }, []), h('img', {
                class: {
                  "displayNone":true,
                  "weidu":true,
                  "poretions":true,
                  'displblock':props.fromUser.id == 99999999999 && props.status == 'delivered',
                },
                attrs:{
                  title:"已送达",
                  src:weidu,
                }
              }, []), h('img', {
                class: {
                  "displayNone":true,
                  "poretions":true,
                  "displblock":props.fromUser.id == 99999999999 && props.status == 'read',
                },
                attrs:{
                  title:"已读",
                  src:yidu
                }
              }, []),])])
          }
        }}
      />
    );
  }
};
</script>
<style scoped>
.lemon-message-text {
  position: relative;
}

.text {
  border-top: 1px dashed #333;
}

.displayStyle {
  display: none;
}

.poretions {
  position: absolute;
  bottom: 0px;
  left: -12px;
}
.displayNone{
  display: none !important;
}
.displblock{
  display: block !important;
}
.weidu{
  width: 12px !important;
  height: 9px !important;
  left: -6px;
}
</style>
