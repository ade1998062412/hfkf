<script>
  export default {
    name: 'lemonMessageImage',
    inheritAttrs: false,
    render() {
      return (
        <lemon-message-basic
          class="lemon-message-image"
          props={{ ...this.$attrs }}
          scopedSlots={{
            content: (props) => (
              <viewer imglist={props.content} class="screen-view">
                <img src={props.content} />
              </viewer>
            ),
          }}
        />
      )
    },
  }
</script>
