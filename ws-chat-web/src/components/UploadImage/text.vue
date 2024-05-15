<script>
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
            if(props.translator){
                return <div><div domProps={{ innerHTML: content }} /><div  domProps={{ innerHTML: props.translator }} class='text'/></div>;
            }else{
                return <span domProps={{ innerHTML: content }} />;
            }
          }
        }}
      />
    );
  }
};
</script>
<style>
.text{
    border-top: 1px dashed #333;
}
</style>
