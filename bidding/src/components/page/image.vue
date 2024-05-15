<script>
import yidu from "@/assets/img/yidu1.png"
import weidu from "@/assets/img/weidu1.png"
export default {
  name: "lemonMessageImage",
  inheritAttrs: false,
  render() {
    return (
      <lemon-message-basic
        class="lemon-message-image"
        props={{ ...this.$attrs }}
        scopedSlots={{
          content: props => {
            if (props.fromUser.id == 99999999999 && props.status == 'send') {
              return <div><viewer imglist={props.content} class="screen-view">
                <img src={props.content} />
              </viewer><div class='poretions'><img  src={weidu} class='imgx'  title='已发送' /></div></div>;
            } else if (props.fromUser.id == 99999999999 && props.status == 'delivered') {
              return <div><viewer imglist={props.content} class="screen-view">
                <img src={props.content}  />
              </viewer><div class='poretions'><img  src={weidu} class='imgx' title='已送达' /></div></div>;
            } else if (props.fromUser.id == 99999999999 && props.status == 'read') {
              return <div><viewer imglist={props.content} class="screen-view">
                <img src={props.content}  />
              </viewer><div class='poretions'><img src={yidu} class='imgd' title='已读' /></div></div>;
            } else {
              return <div><viewer imglist={props.content} class="screen-view">
                <img src={props.content} />
              </viewer></div>;
            }
          }
        }}
      />
    );
  }
};
</script>
<style scoped>
/* :deep(.lemon-message__content-flex .lemon-message-ilemon-message__content) {
  position: relative;
  overflow: auto !important;
} */
.lemon-message-image .lemon-message__content {
  position: relative;
  overflow: auto !important;
}

.poretions {
  position: absolute;
  bottom: 0px;
  left: -20px;
}
.poretions .imgx{
  width: 12px !important;
  height: 9px !important;
  min-width: 10px;
  max-width: 20px;
  background-color: transparent;
}
.poretions .imgd{
  width: 22px !important;
  height: 18px !important;
  min-width: 10px;
  max-width: 22px;
  background-color: transparent;
  transform: translateX(-6px);
}
:deep(.lemon-message__content){
  overflow: visible !important;
}
</style>
