<script>
  import { getSessionList, getMessageList } from '@/api/sessionList.js'
  let width = document.documentElement.clientWidth - 296
  let height = document.documentElement.clientHeight - 200
  // console.log(width, height)
  export default {
    name: 'QqImui',
    components: {},
    data() {
      return {
        pages: 2,
        param: {
          page: 1,
          limit: 50,
          sort: 'created_at',
          order: 'desc',
        },
        list: [],
        messageInfo: [],
        user: {
          id: 99999999999,
          displayName: 'da帅比',
        },
        contact: {},
        URL: 'https://wschat.micome.vip/',
      }
    },

    computed: {},
    watch: {},

    mounted() {
      this.param.page = 1
      this.pages = 2
      this.getList()
    },
    methods: {
      /* 获取消息列表 */
      getList() {
        const IMUI = this.$refs.IMUI
        let dataList = []
        getSessionList(this.param).then((res) => {
          let loading = document.querySelector('.loading2')
          if (loading) {
            loading.remove()
          }
          this.pages = res.data.pages
          if (res.data.list.length > 0) {
            this.user.displayName = res.data.list[0].support.username
          }
          // console.log(res)
          if (res.data.list.length != 0) {
            dataList = res.data.list.map((i) => {
              i.displayName = i.contact.name
              i.lastSendTime = i.last_message?.last_send_at
              i.lastContent = IMUI.lastContentRender({
                type: i.last_message ? i.last_message.type : 'text',
                content: i.last_message ? i.last_message.body : ' ',
              })
              let messagePage = {
                page: 1,
                limit: 10,
                sort: 'created_at',
                order: 'desc',
                session_id: i.id,
              }
              this.messageInfo.push(messagePage)
              return i
            })
            if (this.param.page == 1) {
              this.list = dataList
              this.ListenerScroll()
            } else {
              this.list.push(...dataList)
              IMUI.initContacts(this.list)
            }
          }
          IMUI.initContacts(this.list)
          if (res.data.list.length != 0) {
            IMUI.clearMessages()
            IMUI.changeContact(this.list[0].id)
          }
          IMUI.initEditorTools([])
        })
      },
      handleChangeContact(Contact) {
        this.user.displayName = Contact.support?.username
      },
      /* 获取消息详情 */
      handlePullMessages(contact, next) {
        this.user.displayName = contact.support.username
        for (let s of this.messageInfo) {
          if (contact.id == s.session_id) {
            return getMessageList(s).then((res) => {
              let messages = res.data.list.map((data) => {
                return {
                  id: data.id,
                  status: 'succeed',
                  type: data.type,
                  sendTime: data.last_send_at,
                  translator: data.translator,
                  content:
                    data.type == 'text'
                      ? data.body
                      : this.URL + data?.file?.file_path,
                  toContactId: contact.id,
                  fromUser: data.from_support_id ? this.user : contact,
                }
              })
              if (s.page < res.data.pages) {
                s.page++
                next(messages.reverse(), false)
              } else {
                next(messages.reverse(), true)
              }
            })
          }
        }
      },
      //监听滚动条事件
      ListenerScroll() {
        let box = document.querySelectorAll('.lemon-sidebar__scroll')[0]
        box.addEventListener('scroll', (e) => {
          let scrollTop = e.target.scrollTop
          let clientHeight = e.target.clientHeight
          let scrollHeight = e.target.scrollHeight
          // console.log(scrollTop, clientHeight)
          // console.log(scrollHeight)
          if (scrollTop + clientHeight == scrollHeight) {
            let loading = box.querySelector('.loading2')
            if (!loading) {
              let p = document.createElement('p')
              p.className = 'loading2'
              p.innerText = '加载中...'

              if (this.pages == this.param.page) {
                p.innerText = '已加载全部'
              } else {
                this.param.page++
                this.getList()
              }
              box.appendChild(p)
            }
          }
        })
      },
    },
    render() {
      return (
        <div class="qq-lemon-imui">
          <lemon-imui
            class="lemon-slot"
            user={this.user}
            width={width}
            height={height}
            avatar-cricle
            hideMenu={true}
            ref="IMUI"
            on={{
              'pull-messages': this.handlePullMessages,
              'change-contact': this.handleChangeContact,
            }}
          />
        </div>
      )
    },
  }
</script>
<style>
  .avatarUploader .el-upload--text {
    width: 22px;
    height: 28px;
    background-image: url('/assets/img/image.png');
    background-size: 100% 100%;
    background-color: #f4f4f4;
    border: none;
  }

  .avatarUploader .el-upload--text img {
    width: 22px;
    height: 22px;
  }

  .lemon-editor__tool {
    border-top: 1px solid #ccc;
  }
  .lemon-editor {
    height: 0;
  }

  .loading2 {
    text-align: center;
    font-size: 12px;
    color: #ccc;
    padding: 0 0 8px;
  }
</style>
