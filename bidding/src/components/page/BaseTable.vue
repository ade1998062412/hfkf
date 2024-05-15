<script>
import {
    GET_SESSIONLIST,
    DEL_SESSION,
    GET_MESSAGE_LIST,
    GET_INFO, SENDMESSAGE,
    UPLOADIMAGE, GETENUMS,
    GETCONFIG,
    SAVECONFIG,
    TRANSLATE,
    GET_LABEL_LIST,
    ADD_LABEL,
    EDIT_LABEL,
    DEL_LABEL,
    SET_LABEL,
    GET_LABEL_SESSION_LIST,
    GET_FASTREPLY_LIST,
    ADD_FASTREPLY,
    DEL_FASTREPLY,
    GET_EXPIRESESSIONLIST,
    RECALLMESSAGE
} from "@/api"
let width = document.documentElement.clientWidth;
let height = document.documentElement.clientHeight - 70;
const getTime = () => {
    return new Date().getTime();
};
import fanyi from "@/assets/img/fanyi.png"
import mp3 from "@/assets/img/msg.mp3"
import { Loading } from 'element-ui';
import { h } from "vue";
export default {
    name: "QqImui",
    components: {},
    data() {
        return {
            contextmenu: [
                {
                    click: (e, instance, hide) => {
                        this.recallMessage(instance, hide)

                    },
                    visible: instance => {
                        return instance.message.fromUser.id == this.user.id;
                    },
                    text: "撤回消息",
                },
            ],
            badgeShow1: true,
            badgeShow2: true,
            badgeShow3: true,
            loadingInstance: null,
            expireList: [],//无效回话列表
            activeIndex2: '1',
            activeIndex3: '1',//type类型
            textarea2: "",
            selFastReply: '',
            checkAllList: [],
            checkedCities: [],
            isIndeterminateList: [],
            activeNames: 4,
            activeNames2: 3,
            fastReplyList: [],
            isOneOn: true,//第一次进入
            activeIndex: 'huifu',
            lable_session_list: [],
            selLabelList: [],
            MenuName: "messages",
            param: {
                "page": 1,
                "limit": 100,
                "sort": "created_at",
                "order": "desc"
            },
            param2: {
                "page": 1,
                "limit": 100,
                "sort": "created_at",
                "order": "desc"
            },
            labelListPage: {
                "page": 1,
                "limit": 20,
                "sort": "created_at",
                "order": "desc"
            },
            labelList: [],
            list: [],
            list2: [],
            pages: 2,
            pages2: 2,
            messageInfo: [],
            user: {
                id: 999,
                displayName: "da帅比"
            },
            contact: {},
            idList: [],
            URL: 'https://wschat.micome.vip/',
            lockReconnect: false, //是否真正建立连接
            timeout: 30 * 1000, //58秒一次心跳
            timeoutObj: null, //心跳心跳倒计时
            timeoutnum: null, //断开 重连倒计时
            MessagesBox: {
                translationBth: 1,
                line: 'Google',
                sourceLanguage: "1",
                targetLanguage: "",
                line2: "Google",
                sourceLanguage2: "1",
                targetLanguage2: "",

            },
            clickqiehuan: false,
            selection: { line: [], sourceLanguage: [], targetLanguage: [] },
            loading: false,
            sourceLanguage: '',
            websocketCloseFun: true,
            isDisabled: true,
            setIntervalList: {},
            notification: undefined,//通知栏消息
            visibilityState: 1,//页面显示或隐藏
            contactContextmenu: [{
                text: "修改备注",
                click: this.reviseRemark,
                visible: () => { return this.MenuName == 'messages' }
            }, {
                text: "新增标签",
                click: this.addLabel,
                visible: () => { return this.MenuName == 'contacts' }
            }, {
                text: "修改标签",
                click: this.setLabel,
                visible: () => { return this.activeIndex2 == '1' && this.MenuName == 'messages' }
            }, {
                text: "重命名标签",
                click: this.reviseLabelName,
                visible: () => { return this.MenuName == 'contacts' }
            }, {
                text: "删除标签",
                color: "red",
                click: this.delLabel,
                visible: (a) => { return this.MenuName == 'contacts' && a.contact.id !== 999 }
            },
            ],
            MenusList: [
                {
                    name: "messages",
                    title: "聊天",
                    unread: 0,
                    click: null,
                    render: menu => {
                        return <i class="lemon-icon-message" />;
                    },
                    isBottom: false,
                },
                {
                    name: "contacts",
                    title: "标签",
                    unread: 0,
                    click: null,
                    render: menu => {

                        return <svg t="1683717484325" class={"icon "} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2407" width="24" height="24"><path class={this.clickqiehuan ? 'lvse' : ''} d="M920.528912 444.49616l-340.111125-340.114737a135.932464 135.932464 0 0 0-96.155899-39.758503L200.418112 64.662657h-0.018063C125.275769 64.662657 64.301413 125.40943 64.301413 200.548159v283.673992a136.091412 136.091412 0 0 0 39.881326 96.199248l340.230335 340.241173a136.022775 136.022775 0 0 0 192.369598 0l283.74624-283.76069c53.128139-53.131752 53.128139-139.277583 0-192.405722z m-45.209673 147.192436l-283.746241 283.760691a72.064544 72.064544 0 0 1-101.924964 0l-340.212273-340.241173A72.187367 72.187367 0 0 1 128.241582 484.218538V200.548159A72.021195 72.021195 0 0 1 200.396437 128.602826l283.843776-0.039737a71.887535 71.887535 0 0 1 50.935389 21.053294l340.114737 340.1039a72.104281 72.104281 0 0 1 0.0289 101.968313z" fill="#999999" p-id="2408"></path><path class={this.clickqiehuan ? 'lvse' : ''} d="M384.002258 255.999097c-70.69543 0-128.003161 57.307731-128.003161 128.003161S313.306828 511.998194 384.002258 511.998194s127.999548-57.307731 127.999548-127.999549S454.690463 255.999097 384.002258 255.999097z m45.296371 173.29592a64.059379 64.059379 0 1 1 18.759396-45.292759 63.640337 63.640337 0 0 1-18.763008 45.292759z" fill="#999999" p-id="2409"></path></svg>;
                    },
                    isBottom: false,
                },
            ]
        };
    },
    render() {
        return (
            <div class="qq-lemon-imui" on-keydown={this.keydownFun} v-loading={this.loading}>
                <lemon-imui
                    class="lemon-slot"
                    user={this.user}
                    width={width}
                    height={height}
                    avatar-cricle
                    contextmenu={this.contextmenu}
                    hide-message-time
                    hideMenuAvatar
                    contactContextmenu={this.contactContextmenu}
                    ref="IMUI"
                    on={{
                        "pull-messages": this.handlePullMessages,
                        "change-contact": this.handleChangeContact,
                        send: this.handleSend,
                        "change-menu": this.changeMenu
                    }}
                    scopedSlots={{
                        //消息输入框底部
                        "editor-footer": () => {
                            return h('div', {
                                class: "lemon-editor__submit",
                            }, [h('button', {
                                class: "lemon-button lemon-button--color-default",
                                attrs: {
                                    disabled: this.isDisabled
                                },
                                on: {
                                    click: () => {
                                        this.translate()
                                    },
                                }
                            }, ["翻译"])])
                        },
                        //固定在左侧最新消息列表的顶部
                        "sidebar-message-fixedtop": () => {
                            return h('div', {}, [
                                h('el-menu', {
                                    props: {
                                        type: 'text',
                                        "default-active": this.activeIndex3,
                                        mode: 'horizontal',
                                    },
                                    attrs: {},
                                    on: {
                                        select: this.handleSelect3
                                    }
                                }, [h('el-badge', {
                                    props: {
                                        "is-dot": true,
                                        hidden: this.badgeShow1,
                                    },
                                    class: 'badge'

                                }, [h('el-menu-item', {
                                    props: {
                                        index: '1'
                                    },
                                    class: 'el-menu-item2'
                                }, ['whatsapp']),]), h('el-badge', {
                                    props: {
                                        "is-dot": true,
                                        hidden: this.badgeShow2,
                                    },
                                    class: 'badge'

                                }, [, h('el-menu-item', {
                                    props: {
                                        index: '2'
                                    },
                                    class: 'el-menu-item2'
                                }, ['web'])])]),
                                h('el-menu', {
                                    props: {
                                        type: 'text',
                                        "default-active": this.activeIndex2,
                                        mode: 'horizontal',
                                    },
                                    class: { displayName: this.activeIndex3 != '1' },
                                    on: {
                                        select: this.handleSelect2
                                    }
                                }, [h('el-menu-item', {
                                    props: {
                                        index: '1'
                                    }
                                }, ['有效会话']), h('el-menu-item', {
                                    props: {
                                        index: '2'
                                    }
                                }, ['已过期'])])
                            ])
                        },
                        //固定在左侧联系人列表的顶部
                        "sidebar-contact-fixedtop": () => {
                            return h('el-button', {
                                props: {
                                    type: 'text',

                                },
                                attrs: { style: 'padding:3px 0;position: absolute;top:6px;left:236px;' }, on: {
                                    click: this.addLabel
                                }
                            }, ["+ 新增标签"])
                        },
                        //左侧联系人列表插槽
                        "sidebar-contact": Contact => {
                            return h('div', {
                                class: "",
                                attrs: {
                                    title: Contact.displayName
                                }
                            }, [

                                h('div', {
                                    class: "lemon-contact__inner lxrBox",
                                }, [h('p', {
                                    class: "lemon-contact__label",
                                }, [
                                    h('span', {
                                        class: { "lemon-contact__name": true, displayName: Contact.note },
                                        attrs: {
                                            //style: "font-weight:700;"
                                        }
                                    }, [Contact.displayName + ' ( ' + Contact.sessions.length + " )"]),
                                ]),])])
                        },
                        //左侧联系人详细页
                        "contact-info": Contact => {
                            return h('div', { class: 'labelBox', }, [
                                h('div', {}, [
                                    h('div', { attrs: { style: "padding:12px;font-weight:700;" } },
                                        [Contact.sessions ? `成员 (${Contact.sessions.length})` : '成员 (0)']),
                                    h('div', { attrs: { style: "padding:0 12px;" } }, [
                                        Contact.sessions && Contact.sessions.map(i => {
                                            return h('el-tag', {
                                                props: {
                                                    closable: false,
                                                    type: ''
                                                },
                                                attrs: {
                                                    style: 'margin:4px;'
                                                },
                                                on: {
                                                    close: () => this.handleCloseLabel(i.contact.name)
                                                }
                                            }, [i.note ? `${i.note}(${i.contact.name})` : i.contact.name])
                                        })
                                    ])
                                ])
                            ])
                        },
                        //消息列表的标题
                        "message-title": contact => {
                            return (<div>
                                <div style="display:flex;justify-content:space-between">
                                    <div> <span>{contact.note ? `${contact.note} ( ${contact.displayName} )` : contact.displayName}</span>
                                        <span style='margin-left:12px;'>{contact.contact ? contact.contact.wa_id : ''} {contact.uid ? `(${contact.uid})` : ''}</span></div>
                                    <span style="font-size:12px;">
                                        {contact.labels && contact.labels.map((i) => {
                                            return (<el-tag style='margin-left:2px;'>{i.name}</el-tag>)
                                        })}
                                    </span>
                                </div>

                                <div class="slot-group-menu">
                                    {new Date(contact.expiration_at_unix) < new Date() && this.activeIndex3 == '1' && <span>(已结束会话)</span>}
                                </div></div>
                            )
                        },
                        //左侧最新消息列表插槽
                        "sidebar-message": Contact => {
                            return h('div', {
                                class: "",
                                attrs: {
                                    title: Contact.displayName,
                                    style: "padding:15px 0"
                                },
                            }, [
                                h('span', {
                                    class: { 'lemon-badge': true, 'lemon-contact__avatar': true, },

                                }, [
                                    h('span', {
                                        class: { 'lemon-avatar': true, 'lemon-avatar--circle': true },
                                        attrs: {
                                            style: "width: 40px; height: 40px; line-height: 40px; font-size: 20px;"
                                        }
                                    }, [h('i', { class: "lemon-icon-people" }, [])])
                                ]),
                                h('div', {
                                    class: "lemon-contact__inner lxrBox 0000000",
                                }, [
                                h('span', {
                                    class: {displayName: this.activeIndex3 == '1', "lemon-contact__del":true },
                                    attrs: { 
                                        style:"z-index: 99;color: red;position: absolute; right: -7px;top: -23px;font-size: 22px;" 
                                    },
                                    on: {
                                        click: (e) => {
                                            e.stopPropagation();
                                            this.delCurrentContact(Contact)
                                        },
                                    }
                                    
                                }, ['×']),
                                    h('p', {
                                    class: "lemon-contact__label",
                                }, [
                                    h('span', {
                                        class: { "lemon-contact__name": true, displayName: !Contact.note },
                                        attrs: {
                                            style: "color:red;"
                                        }

                                    }, [Contact.note]),
                                    h('span', {
                                        class: { "lemon-contact__name": true, displayName: Contact.note },
                                    }, [Contact.displayName]),
                                    h('span', { class: "lemon-contact__name" }, [Contact.contact ? Contact.contact.wa_id : '']),
                                ]), h('p', {
                                    class: "lemon-contact__content ",
                                    attrs: { style: "display:flex;justify-content: space-between;" }
                                },
                                    [
                                        h('span', { attrs: { style: "width:120px;display: inline-block;white-space: nowrap;overflow: hidden;" } }, [Contact.lastContent]),
                                        h('span', { class: "lemon-contact__time" }, [this.timestampToTime(Contact.lastSendTime, this.isToday(Contact.lastSendTime) ? "h:i" : "y/m/d")]),
                                        h('span', { class: 'daojishi' }, [Contact.daojishi ? Contact.daojishi : '']), h('span', { class: 'weidu' }, [Contact.unread ? Contact.unread : '']),])])])
                        },
                        /* 消息列表右侧 */
                        "message-side": contact => {
                            return h("div", {}, [
                                h('el-tabs', {
                                    props: {
                                        value: this.activeIndex,
                                    },
                                    on: { "tab-click": this.handleSelect }
                                }, [
                                    h('el-tab-pane', {
                                        props: { label: '快捷回复', name: "huifu" },
                                    }, [h('div', { class: { displayName: this.activeIndex !== 'huifu' } }, [
                                        h('el-card', {
                                            class: 'rightBox box-card', attrs: {
                                                style: ""
                                            }
                                        }, [
                                            h('div', {
                                                props: {
                                                    slot: "header"
                                                }, class: "clearfix",
                                                attrs: {
                                                    style: "display:flex;justify-content: space-between;width:100%;padding-bottom:12px;"
                                                }
                                            }, [
                                                h('div', {}, ["快速回复"]),
                                                h('el-button', {
                                                    props: {
                                                        type: 'text'
                                                    }, attrs: { style: 'padding:3px 0;' }, on: {
                                                        click: this.addFastreply
                                                    }
                                                }, ["添加快速回复"])
                                            ]),
                                            h('el-collapse', {
                                                props: {
                                                    value: this.activeNames,
                                                    accordion: true
                                                },
                                                on: {
                                                    input: val => { this.activeNames = val }
                                                }
                                            }, [
                                                this.fastReplyList.length > 0 && this.fastReplyList.map(i => {
                                                    return h('el-collapse-item', {
                                                        class: "text item",
                                                        attrs: {
                                                            name: i.id,
                                                        },
                                                        props: {
                                                            title: i.note,
                                                        }
                                                    }, [
                                                        h('template', {
                                                            slot: 'title',
                                                        }, [h('p', { class: 'kuaijiehuifu' }, [i.note])]),
                                                        h('div', {}, [
                                                            h('div', {}, [i.content]),
                                                            h('div', {
                                                                attrs: {
                                                                    style: 'text-align: right;'
                                                                }
                                                            }, [
                                                                h('el-button', {
                                                                    props: {
                                                                        type: 'text'
                                                                    }, attrs: { style: 'padding:3px 0;' }, on: {
                                                                        click: this.kuaiJieFaSong.bind(this, i.content, contact)
                                                                    }
                                                                }, ["发送"]),
                                                                h('el-button', {
                                                                    props: {
                                                                        type: 'text'
                                                                    }, attrs: { style: 'padding:3px 0;color:red;' }, on: {
                                                                        click: this.delFastreply.bind(this, i.id)
                                                                    }
                                                                }, ["删除"])
                                                            ])
                                                        ])
                                                    ])
                                                })
                                            ]),

                                        ]),
                                    ]),]),
                                    h('el-tab-pane', {
                                        props: { label: '翻译设置', name: 'fanyi' },
                                    }, [h('div', { class: { displayName: this.activeIndex !== 'fanyi' } }, [
                                        h('div', { class: { rightBox: true, } }, [
                                            h('div', {
                                                attrs: {
                                                    style: "display:flex;"
                                                }
                                            }, [
                                                h('img', {
                                                    attrs: {
                                                        src: fanyi,
                                                        style: "width:16px;margin-right:12px;"
                                                    }
                                                }, []),
                                                h("div", { class: { textcolor: true } }, ["接收消息实时翻译"]),
                                            ]),
                                            h('el-switch', {
                                                props: {
                                                    value: this.MessagesBox.translationBth,
                                                    "active-color": "#1093ff",
                                                    "inactive-color": "#ccc"
                                                },
                                                on: {
                                                    input: (value) => {
                                                        this.MessagesBox.translationBth = value
                                                    },
                                                    change: (value) => {
                                                        this.saveConfig()
                                                    }

                                                }
                                            })
                                        ]),
                                        h('div', {}, [
                                            h('div', {
                                                class: { rightBox: true }
                                            }, [
                                                h('div', { class: { seleFontstyle: true } }, ["路线"]),
                                                h('el-select', {
                                                    props: {
                                                        value: this.MessagesBox.line,
                                                    },
                                                    on: {
                                                        input: res => {
                                                            this.MessagesBox.line = res
                                                        },
                                                        change: res => {
                                                            this.MessagesBox.sourceLanguage = this.selection.sourceLanguage[res][0].key
                                                            this.MessagesBox.targetLanguage = this.selection.targetLanguage[res][0].key
                                                            this.saveConfig()
                                                        }
                                                    }
                                                }, this.selection.line.map(res => {
                                                    return h('el-option', {
                                                        props: {
                                                            key: res.key,
                                                            label: res.value,
                                                            value: res.key
                                                        },
                                                    })
                                                }))
                                            ]),
                                            h('div', {
                                                class: { rightBox: true }
                                            }, [
                                                h('div', { class: { seleFontstyle: true } }, ["源语言"]),
                                                h('el-select', {
                                                    props: {
                                                        value: this.MessagesBox.sourceLanguage,
                                                        filterable: true
                                                    },
                                                    on: {
                                                        input: res => {
                                                            this.MessagesBox.sourceLanguage = res
                                                        },
                                                        change: res => {
                                                            this.saveConfig()
                                                        }
                                                    }
                                                }, this.selection.sourceLanguage[this.MessagesBox.line].map(res => {
                                                    return h('el-option', {
                                                        props: {
                                                            key: res.key,
                                                            label: res.value,
                                                            value: res.key
                                                        },
                                                    })
                                                }))
                                            ]),
                                            h('div', {
                                                class: { rightBox: true }
                                            }, [
                                                h('div', { class: { seleFontstyle: true } }, ["目标语言"]),
                                                h('el-select', {
                                                    props: {
                                                        value: this.MessagesBox.targetLanguage,
                                                        filterable: true
                                                    },
                                                    on: {
                                                        input: res => {
                                                            this.MessagesBox.targetLanguage = res
                                                        },
                                                        change: res => {
                                                            this.saveConfig()
                                                        }
                                                    }
                                                }, this.selection.targetLanguage[this.MessagesBox.line].map(res => {
                                                    return h('el-option', {
                                                        props: {
                                                            key: res.key,
                                                            label: res.value,
                                                            value: res.key
                                                        },
                                                    })
                                                }))
                                            ])
                                        ]),
                                        h('div', { class: { rightBox: true } }, [
                                            h('div', {
                                                attrs: {
                                                    style: "display:flex;"
                                                }
                                            }, [
                                                h('img', {
                                                    attrs: {
                                                        src: fanyi,
                                                        style: "width:16px;margin-right:12px;"
                                                    }
                                                }, []),
                                                h("div", { class: { textcolor: true } }, ["发送消息实时翻译"]),
                                            ])
                                        ]),
                                        h('div', {}, [
                                            h('div', {
                                                class: { rightBox: true }
                                            }, [
                                                h('div', { class: { seleFontstyle: true } }, ["路线"]),
                                                h('el-select', {
                                                    props: {
                                                        value: this.MessagesBox.line2,
                                                    },
                                                    on: {
                                                        input: res => {
                                                            this.MessagesBox.line2 = res
                                                        },
                                                        change: res => {
                                                            this.MessagesBox.sourceLanguage2 = this.selection.sourceLanguage[res][0].key
                                                            this.MessagesBox.targetLanguage2 = this.selection.targetLanguage[res][0].key
                                                            this.saveConfig()
                                                        }
                                                    }
                                                }, this.selection.line.map(res => {
                                                    return h('el-option', {
                                                        props: {
                                                            key: res.key,
                                                            label: res.value,
                                                            value: res.key
                                                        },
                                                    })
                                                }))
                                            ]),
                                            h('div', {
                                                class: { rightBox: true }
                                            }, [
                                                h('div', { class: { seleFontstyle: true } }, ["源语言"]),
                                                h('el-select', {
                                                    props: {
                                                        value: this.MessagesBox.sourceLanguage2,
                                                        filterable: true
                                                    },
                                                    on: {
                                                        input: res => {
                                                            this.MessagesBox.sourceLanguage2 = res
                                                        },
                                                        change: res => {
                                                            this.saveConfig()
                                                        }
                                                    }
                                                }, this.selection.sourceLanguage[this.MessagesBox.line2].map(res => {
                                                    return h('el-option', {
                                                        props: {
                                                            key: res.key,
                                                            label: res.value,
                                                            value: res.key
                                                        },
                                                    })
                                                }))
                                            ]),
                                            h('div', {
                                                class: { rightBox: true }
                                            }, [
                                                h('div', { class: { seleFontstyle: true } }, ["目标语言"]),
                                                h('el-select', {
                                                    props: {
                                                        value: this.MessagesBox.targetLanguage2,
                                                        filterable: true
                                                    },
                                                    on: {
                                                        input: res => {
                                                            this.MessagesBox.targetLanguage2 = res
                                                        },
                                                        change: res => {
                                                            this.saveConfig()
                                                        }
                                                    }
                                                }, this.selection.targetLanguage[this.MessagesBox.line2].map(res => {
                                                    return h('el-option', {
                                                        props: {
                                                            key: res.key,
                                                            label: res.value,
                                                            value: res.key
                                                        },
                                                    })
                                                }))
                                            ])
                                        ]),
                                        h('ul', {
                                            attrs: {
                                                style: "color:#999"
                                            }
                                        }, [
                                            h('div', {}, ["提示："]), h('li', { attrs: { style: "margin-left:40px;" } }, ["使用 alt + t 快捷翻译"]),
                                            h('li', { attrs: { style: "margin-left:40px;" } }, ["使用 ctrl + enter 快捷发送消息"])
                                        ]),
                                    ]),]),
                                    h('el-tab-pane', {
                                        props: { label: '群发设置', name: "qunfa" },
                                    }, [
                                        h('div', { class: { displayName: this.activeIndex !== 'qunfa' }, attrs: { style: 'max-height:calc(100vh - 300px);' } }, [
                                            h('el-select', {
                                                props: {
                                                    value: this.selFastReply,
                                                },
                                                class: "rightBox",
                                                attrs: {
                                                    placeholder: "请选择群发消息"
                                                },
                                                on: {
                                                    input: val => {
                                                        this.selFastReply = val
                                                    },
                                                }
                                            }, this.fastReplyList.map(i => {
                                                return h('el-option', {
                                                    props: {
                                                        label: i.note,
                                                        value: i.content,
                                                        key: i.id
                                                    }
                                                })
                                            })),
                                            this.labelList && this.labelList.map(i => {
                                                return h('el-collapse', {
                                                    props: {
                                                        value: this.activeNames2,
                                                        accordion: true
                                                    },
                                                    on: {
                                                        input: val => { this.activeNames2 = val }
                                                    }
                                                }, [
                                                    h('el-collapse-item', {
                                                        class: "text item",
                                                        attrs: {
                                                            name: i.id,
                                                        },
                                                    }, [
                                                        h('template', {
                                                            slot: 'title',
                                                        }, [h('el-checkbox', {
                                                            props: {
                                                                indeterminate: this.isIndeterminateList['id' + i.id],
                                                                value: this.checkAllList['bth' + i.id]
                                                            },
                                                            on: {
                                                                input: value => { this.checkAllList['bth' + i.id] = value },
                                                                change: this.handleCheckAllChange.bind(this, i.id)
                                                            }
                                                        }, ['', i.name])]),
                                                        h('el-checkbox-group', {
                                                            props: {
                                                                value: this.checkedCities['list' + i.id]
                                                            },
                                                            on: {
                                                                input: value => {
                                                                    this.checkedCities['list' + i.id] = value;
                                                                    this.$forceUpdate()
                                                                },
                                                                change: this.handleCheckedCitiesChange.bind(this, i.id)
                                                            }
                                                        }, [

                                                            i.sessions && i.sessions.map(data => {
                                                                return h('el-checkbox', {
                                                                    props: {
                                                                        label: data.id
                                                                    }
                                                                }, [data.note ? `${data.note}( ${data.contact.name} )` : data.contact.name])
                                                            })
                                                        ])
                                                    ])
                                                ])
                                            }),
                                            h('el-input', {
                                                props: {
                                                    type: "textarea",
                                                    autosize: { minRows: 2, maxRows: 5 },
                                                    value: this.textarea2
                                                },
                                                attrs: {
                                                    placeholder: "输入框有文本消息时优先发送输入框内的文本消息",
                                                },
                                                on: {
                                                    input: val => {
                                                        this.textarea2 = val
                                                    }
                                                }
                                            }, [])
                                        ]),
                                        h('div', {
                                            attrs: {
                                                style: "text-align: right;margin-top:20px;"
                                            },
                                        }, [h('el-button', {
                                            props: {
                                                type: 'primary'
                                            },
                                            on: {
                                                click: this.MassMessaging
                                            }
                                        }, ['发送'])])])
                                ]),
                            ]);
                        },
                    }}
                />
                <audio src={mp3} ref="audioTip"></audio>
            </div>
        );
    },
    computed: {},
    watch: {

    },
    created() {
        this.getInfo();
        this.getLabelList()
        this.getEnums();
        this.initWebSocket();
        this.getConfig()
        this.loadingInstance = Loading.service({ fullscreen: true });
        {/* this.get_lable_session_list() */ }
        this.selection.sourceLanguage["Google"] = [{ key: '1', value: '自动识别' }]
        this.selection.sourceLanguage["Deepl"] = [{ key: '1', value: '自动识别' }]
        this.selection.targetLanguage["Google"] = [{ key: '', value: '自动识别' }]
        this.selection.targetLanguage["Deepl"] = [{ key: '', value: '自动识别' }]
        Notification.requestPermission().then(function (permission) {
            if (permission === 'granted') {
                console.log('用户允许通知');
            } else if (permission === 'denied') {
                console.log('用户拒绝通知');
            }
        });
        document.addEventListener("visibilitychange", () => {
            this.visibilityState = document.visibilityState == 'hidden' ? 0 : 1
            // 表示当前页面是显示或者隐藏状态
            if (this.visibilityState === 0) {
                console.log('隐藏')
            } else if (this.visibilityState === 1) {
                console.log('显示')
            }
        }, false);
    },
    mounted() {
        this.idList = [];
        this.messageInfo = [];
        this.setIntervalList = {}
        this.param.page = 1
        this.get_fastReply_list()
        setTimeout(() => {
            this.getList()
        }, 1000)
        this.getExpireSessionList()
        this.$nextTick(()=>{
            this.ListenerScrollWeb(); // 监听会话列表-web
        })
    },
    destroyed() {
        this.timeoutObj && clearInterval(this.timeoutObj);
        this.lockReconnect = false
    },
    methods: {
        // 删除当前会话
        delCurrentContact(data){
            this.$confirm('确定删除当前会话?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(data);
                DEL_SESSION({ session_id: data.id }).then(res => {
                    this.list2.map((item,index)=>{
                        // 删除会话
                        if(item.id == data.id){
                            this.list2.splice(index,1);
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                            // 删除会话对应的session_id
                            let _i = this.idList.indexOf(data.id);
                            this.idList.splice(_i,1);
                        };
                    });
                }).catch(err => {
                    console.log(err);
                    this.$message({
                        type: 'error',
                        message: '操作失败'
                    });
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        recallMessage(instance, hide) {
            const { IMUI, message } = instance;

            RECALLMESSAGE({ message_id: message.id }).then(res => {
                const data = {
                    id: message.id,
                    type: "event",
                    content: (
                        <div>
                            <span>
                                你撤回了一条消息{" "}
                                <span
                                    v-show={message.type == "text"}
                                    style="color:#333;cursor:pointer"
                                    content={message.content}
                                    on-click={e => {
                                        IMUI.setEditorValue(e.target.getAttribute("content"));
                                        e.target.innerText = ''
                                    }}
                                >
                                    重新编辑
                                </span>
                            </span>
                        </div>
                    ),
                    toContactId: message.toContactId,
                    sendTime: getTime(),
                };
                IMUI.removeMessage(message.id);
                IMUI.appendMessage(data, true);
                hide();
                {/* return '成功' */ }
            }).catch(err => {
                this.$message({
                    type: 'error',
                    message: '撤回失败'
                });
                hide();
            })
        },
        handleSelect2(key, keyPath) {
            const IMUI = this.$refs.IMUI;
            this.activeIndex2 = keyPath[0]
            if (this.activeIndex2 == '2') {
                IMUI.initContacts(this.expireList);
                if (this.expireList.length != 0) {
                    IMUI.changeContact(this.expireList[0].id);
                }
            } else if (this.activeIndex2 == '1') {
                IMUI.initContacts(this.list);
                if (this.list.length != 0) {
                    IMUI.changeContact(this.list[0].id);
                }
            }

        },
        handleSelect3(key, keyPath) {
            const IMUI = this.$refs.IMUI;
            this.activeIndex3 = keyPath[0]
            if (this.activeIndex3 == '1') {
                this.badgeShow1 = true
                this.handleSelect2(this.activeIndex2, [this.activeIndex2])
            } else if (this.activeIndex3 == '2') {
                this.badgeShow2 = true

                IMUI.initContacts(this.list2);
                if (this.list2.length != 0) {
                    IMUI.changeContact(this.list2[0].id);
                }
            }
        },
        MassMessaging() {
            let list = []
            for (let i in this.checkedCities) {
                for (let j of this.checkedCities[i]) {
                    list.push(j)
                }
            }
            if (!this.selFastReply && !this.textarea2) {
                return this.$message({
                    type: 'info',
                    message: '请选择群发消息'
                });
            } else if (list.length < 1) {
                return this.$message({
                    type: 'info',
                    message: '请选择发送人'
                });
            }
            let text2 = ''
            if (this.textarea2) {
                text2 = this.textarea2
            } else {
                text2 = this.selFastReply
            }
            list = new Set(list)
            for (let id of list) {
                this.kuaiJieFaSong(text2, { id: id })
            }
            this.selFastReply = ''
            this.textarea2 = ''
            for (let i in this.checkedCities) {
                this.checkedCities[i] = []
            }
            for (let i in this.checkAllList) {
                this.checkAllList[i] = false
            }
            for (let i in this.isIndeterminateList) {
                this.isIndeterminateList[i] = false
            }
            this.$forceUpdate()
        },
        //全选按钮
        handleCheckAllChange(i, val) {
            let a = []
            if (val) {
                for (let j in this.labelList) {
                    if (i == this.labelList[j].id) {
                        this.isIndeterminateList['id' + i] = false;
                        a = this.labelList[j].sessions.map(id => {
                            return id.id
                        })
                    }
                }
            }
            this.checkedCities['list' + i] = a
            this.$forceUpdate()
        },
        //单选按钮
        handleCheckedCitiesChange(i, val) {
            let checkedCount = val.length;
            for (let j in this.labelList) {
                if (i == this.labelList[j].id) {
                    this.checkAllList['bth' + i] = checkedCount === this.labelList[j].sessions.length;
                    this.isIndeterminateList['id' + i] = checkedCount > 0 && checkedCount < this.labelList[j].sessions.length;
                }
            }
            this.$forceUpdate()
        },
        //删除快捷回复
        delFastreply(id) {
            this.$confirm('此操作将永久删除该快捷回复, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                DEL_FASTREPLY({ id: id }).then(res => {
                    this.get_fastReply_list()
                    this.$message({
                        type: 'success',
                        message: '删除成功'
                    });
                }).catch(err => {
                    console.log(err)
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        //快捷发送
        kuaiJieFaSong(e, contact) {
            const IMUI = this.$refs.IMUI
            let data = {
                "session_id": contact.id,
                "type": 'text',
                "body": e,
                "file_id": '',
                "translator": this.sourceLanguage
            };
            SENDMESSAGE(data).then(res => {
                if (res.errno == 0) {
                    this.ziDongSend(e, contact, true, res)
                } else {
                    this.ziDongSend(e, contact, false)
                }
            }).catch(err => {
                this.ziDongSend(e, contact, false)
            })
        },
        //快捷回复自动发送
        ziDongSend(e, contact, bol, res) {
            const IMUI = this.$refs.IMUI
            const datas = {
                id: res ? res.data.id : this.generateRandWord(),
                status: bol ? res.data.status ? res.data.status : 'succeed' : 'failed',
                type: 'text',
                sendTime: new Date(),
                content: e,
                toContactId: contact.id,
                fromUser: this.user,
                translator: this.sourceLanguage
            };
            this.sourceLanguage = ''
            IMUI.appendMessage(datas, true);
        },
        //新增快捷回复
        addFastreply() {
            const h = this.$createElement;
            this.$msgbox({
                title: "设置",
                message: h('div', {}, [h('input', {
                    props: {
                        value: '',
                    },
                    ref: "input2",
                    attrs: {
                        placeholder: "请输入标题",
                        autofocus: true,
                    },
                    class: "input2",
                }, []), h('input', {
                    props: {
                        value: '',
                    },
                    attrs: {
                        placeholder: "请输入快捷回复"
                    },
                    ref: "input3",
                    class: "input2",
                }, []),]),
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                beforeClose: (action, instance, done) => {
                    if (action === 'confirm') {
                        if (!this.$refs.input2.value) {
                            return this.$message({
                                type: 'error',
                                message: '请输入标题'
                            });
                        } else if (!this.$refs.input3.value) {
                            return this.$message({
                                type: 'error',
                                message: '请输入快捷回复'
                            });
                        }
                        instance.confirmButtonLoading = true;
                        instance.confirmButtonText = '添加中...';
                        ADD_FASTREPLY({ note: this.$refs.input2.value, content: this.$refs.input3.value }).then(res => {
                            this.$refs.input2.value = this.$refs.input3.value = ''
                            done();
                            instance.confirmButtonLoading = false;
                            this.$message({
                                type: 'success',
                                message: '添加成功'
                            });
                            this.get_fastReply_list()
                        }).catch(err => {
                            console.log(err)
                        })
                        setTimeout(() => {
                            setTimeout(() => {
                            }, 300);
                        }, 1000);
                    } else {
                        this.$refs.input2.value = this.$refs.input3.value = ''
                        done();
                    }
                }
            }).then(value => {

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        //获取快捷回复列表
        get_fastReply_list() {
            let page = {
                "page": 1,
                "limit": 20,
                "sort": "created_at",
                "order": "desc"
            }
            GET_FASTREPLY_LIST(page).then(res => {
                this.fastReplyList = res.data.list
            }).catch(err => {
                console.log(err)
            })
        },
        //切换导航名字
        handleSelect(tab, event) {
            this.activeIndex = tab.name
        },
        //单独删除标签人
        handleCloseLabel(tabname) {
            {/* this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1); */ }
        },
        //获取标签以及标签下的联系人
        async get_lable_session_list() {
            let res = await GET_LABEL_SESSION_LIST({
                "page": 1, //分页页码，数字类型
                "limit": 100, //分页大小
                "sort": "created_at", //排序字段
                "order": "desc" //排序顺序：asc/desc
            })
            this.lable_session_list = res.data.list.map(i => {
                i.id = i.id ? i.id : 999
                i.index = '标签'
                i.displayName = i.name
                this.isIndeterminateList['id' + i.id] = false
                this.checkAllList['bth' + i.id] = false
                this.checkedCities['list' + i.id] = []
                return i
            })
        },
        //添加到已有标签
        setLabel(e, instance, hide) {
            const h = this.$createElement;
            this.selLabelList = []
            const { IMUI, contact } = instance;
            contact.labels.map(i => {
                this.selLabelList.push(i.id)
            })
            this.$msgbox({
                title: '选择标签',
                message: h('el-select', {
                    props: {
                        value: this.selLabelList,
                        multiple: true,
                    },
                    attrs: {
                        style: "width:100%"
                    },
                    on: {
                        input: this.newInput,
                    }
                }, this.labelList.map(i => {
                    return h('el-option', {
                        props: {
                            label: i.name,
                            value: i.id,
                            key: i.id
                        }
                    })
                })),
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(action => {
                SET_LABEL({ ids: this.selLabelList, note: contact.note, session_id: contact.id }).then(data => {
                    contact.labels = []

                    for (let s of this.labelList) {
                        for (let j in s.sessions) {
                            if (s.sessions[j].id == contact.id) {
                                s.sessions.splice(j, 1)
                            }
                        }
                        if (this.selLabelList.indexOf(s.id) !== -1) {
                            contact.labels.push(s)
                            s.sessions.push({ id: contact.id, note: contact.note, contact: { name: contact.contact.name, id: contact.contact.id } })
                        }
                    }
                    this.selLabelList = []
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                }).catch(err => {
                    console.log(err)
                })
            }).catch(() => {
                this.selLabelList = []
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
            hide()
        },
        //标签列表值增删
        newInput(value) {
            if (value.length > this.selLabelList.length) {
                for (let a of value) {
                    if (this.selLabelList.indexOf(a) == -1) {
                        this.selLabelList.push(a)
                    }
                }
            } else {
                for (let a of this.selLabelList) {
                    if (value.indexOf(a) == -1) {
                        this.selLabelList.splice(this.selLabelList.indexOf(a), 1)
                    }
                }
            }
        },
        //新增标签
        addLabel(e, instance, hide) {
            {/* const { IMUI, contact } = instance; */ }
            this.$prompt('请输入要新增的标签', '新增标签', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                ADD_LABEL({ name: value }).then(res => {
                    let data = res.data
                    data.index = '标签'
                    data.displayName = data.name;
                    data.sessions = []
                    this.labelList.push(data)
                    this.$message({
                        type: 'success',
                        message: res.errmsg
                    });
                    this.isIndeterminateList['id' + data.id] = false
                    this.checkAllList['bth' + data.id] = false
                    this.checkedCities['list' + data.id] = []
                    {/* this.getLabelList() */ }
                }).catch(err => {
                    console.log(err)
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
            // if (IMUI.currentContactId == contact.id) IMUI.changeContact(null);
            if (hide) {
                hide();
            }
        },
        //重命名标签
        reviseLabelName(e, instance, hide) {
            const { IMUI, contact } = instance;
            this.$prompt('请输入要新增的标签', '新增标签', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                EDIT_LABEL({ id: contact.id, name: value }).then(res => {
                    IMUI.updateContact({
                        id: contact.id,
                        displayName: value,
                    });
                    for (let i in this.labelList) {
                        if (this.labelList[i].id == res.data.id) {
                            return this.labelList[i].name = res.data.name
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
            // if (IMUI.currentContactId == contact.id) IMUI.changeContact(null);
            hide();
        },
        //删除标签
        delLabel(e, instance, hide) {
            const { IMUI, contact } = instance;
            this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loadingInstance = Loading.service({ fullscreen: true });
                DEL_LABEL({ id: contact.id }).then(res => {
                    for (let i in this.labelList) {
                        if (this.labelList[i].id == contact.id) {
                            this.labelList.splice(i, 1)
                        }
                    }
                    for (let i of contact.sessions) {
                        for (let j of this.list) {
                            if (i.id == j.id) {
                                for (let w in j.labels) {
                                    if (j.labels[w].id == contact.id) {
                                        j.labels.splice(w, 1)
                                    }
                                }
                            }
                        }
                    }
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        this.loadingInstance.close();
                    });
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(err => {
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        this.loadingInstance.close();
                    });
                    console.log(err)
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
            // if (IMUI.currentContactId == contact.id) IMUI.changeContact(null);
            hide();
        },
        //修改备注
        reviseRemark(e, instance, hide) {
            const { IMUI, contact } = instance;
            let list = contact.labels.map(i => {
                return i.id
            })
            this.$prompt('请输入要修改的备注', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                SET_LABEL({ ids: list, note: value, session_id: contact.id }).then(data => {
                    IMUI.updateContact({
                        id: contact.id,
                        note: value,
                    });
                    this.$message({
                        type: 'success',
                        message: '修改成功'
                    });
                    {/* this.get_lable_session_list() */ }
                }).catch(err => {
                    console.log(err)
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
            // if (IMUI.currentContactId == contact.id) IMUI.changeContact(null);
            hide();
        },
        //切换左侧导航
        changeMenu(Menu, e) {
            this.MenuName = Menu
            const IMUI = this.$refs.IMUI;
            let loading2 = document.querySelector('.loading2')
            if (loading2) {
                loading2.remove()
            }
            if (Menu === 'contacts') {
                this.clickqiehuan = true;
                IMUI.initContacts(this.labelList);
            } else if (Menu === "messages") {
                this.clickqiehuan = false;
                if (this.activeIndex3 == '1') {
                    if (this.activeIndex2 == '1') {
                        IMUI.initContacts(this.list);
                    } else {
                        IMUI.initContacts(this.expireList);
                    }
                } else if (this.activeIndex3 == '2') {
                    IMUI.initContacts(this.list2);
                }
            }
        },
        //获取标签列表
        async getLabelList() {
            let res = await GET_LABEL_LIST(this.labelListPage)
            if (res) {
                this.labelList = res.list.map(i => {
                    i.sessions = []
                    i.id = i.id ? i.id : 999
                    i.index = '标签'
                    i.displayName = i.name
                    this.isIndeterminateList['id' + i.id] = false
                    this.checkAllList['bth' + i.id] = false
                    this.checkedCities['list' + i.id] = []
                    return i
                })
            }
        },
        //获取用户信息
        getInfo() {
            GET_INFO().then(res => {
                if (res.errno == 0) {
                    this.user = res.data
                    this.user.displayName = res.data.username
                    this.user.uid = res.data.id
                    this.user.id = 99999999999
                } else {
                    this.$message.error("获取用户信息失败")
                }
            }).catch(err => {
                console.log(err)
            })
        },
        ///翻译
        async translate() {
            this.isDisabled = true; // ‘翻译按钮置灰’
            const IMUI = this.$refs.IMUI;
            let message = IMUI.getEditorValue();
            let message2 = this.delHtmlTag(message).replace(/^\s*/, "");
            if (message2) {
                {/* this.loading = true */ }
                const IMUI = this.$refs.IMUI;
                let data = {
                    "body": message2,
                    "channel": this.MessagesBox.line2,
                    "lang_source": this.MessagesBox.sourceLanguage2 == "1" ? '' : this.MessagesBox.sourceLanguage2,
                    "lang_target": this.MessagesBox.targetLanguage2,
                }
                await TRANSLATE(data).then(res => {
                    if (res.errno == 0) {
                        IMUI.setEditorValue(res.data);
                        this.sourceLanguage = message2
                    } else {
                        this.$message.error("翻译失败")
                    }
                    this.loading = false;
                    this.isDisabled = false;
                }).catch(err => {
                    this.$message.error("翻译失败")
                    this.loading = false;
                    this.isDisabled = false;
                })
            } else {
                this.$message.error("请输入要翻译的文本")
            }
        },
        /* 获取翻译配置 */
        getConfig() {
            GETCONFIG().then(res => {
                if (res.errno == 0) {
                    this.MessagesBox.line = res.data.translate_config.recive_channel
                    this.MessagesBox.sourceLanguage = res.data.translate_config.recive_lang_source ? res.data.translate_config.recive_lang_source : '1'
                    this.MessagesBox.line2 = res.data.translate_config.send_channel
                    this.MessagesBox.sourceLanguage2 = res.data.translate_config.send_lang_source ? res.data.translate_config.send_lang_source : '1'
                    this.MessagesBox.translationBth = res.data.translate_config.recive_swith ? true : false
                    this.MessagesBox.targetLanguage = res.data.translate_config.recive_lang_target
                    this.MessagesBox.targetLanguage2 = res.data.translate_config.send_lang_target
                } else {
                    this.$message.error("获取翻译配置失败")
                }
            }).catch(err => {
                console.log(err)
            })
        },
        //修改语言配置
        saveConfig() {
            let data = {
                recive_swith: this.MessagesBox.translationBth ? 1 : 0,
                recive_channel: this.MessagesBox.line,
                recive_lang_source: this.MessagesBox.sourceLanguage == "1" ? '' : this.MessagesBox.sourceLanguage,
                recive_lang_target: this.MessagesBox.targetLanguage,
                send_channel: this.MessagesBox.line2,
                send_lang_source: this.MessagesBox.sourceLanguage2 == '1' ? '' : this.MessagesBox.sourceLanguage2,
                send_lang_target: this.MessagesBox.targetLanguage2
            }

            SAVECONFIG(data).then(res => {
                if (res.errno == 0) {
                    this.$message.success("修改成功")
                } else {
                    this.$message.error("修改失败")
                }
            }).catch(err => {
                console.log(err)
            })
        },
        //获取翻译列表
        getEnums() {
            GETENUMS().then(res => {
                if (res.errno == 0) {
                    for (let key in res.data.channel) {
                        this.selection.line.push({ value: res.data.channel[key], key: key, id: key })
                    }
                    this.MessagesBox.line = this.selection.line[0].key
                    let key = Object.keys(res.data.langs)
                    for (let i in key) {
                        this.selection.targetLanguage[key[i]] = []
                        for (let key2 in res.data.langs[key[i]]) {
                            this.selection.sourceLanguage[key[i]].push({ key: key2, value: res.data.langs[key[i]][key2] })
                            this.selection.targetLanguage[key[i]].push({ key: key2, value: res.data.langs[key[i]][key2] })
                        }
                    }
                } else {
                    this.$message.error("获取翻译列表失败")
                }
            }).catch(err => {
                console.log(err)
            })
        },
        //随机获取字符串
        generateRandWord() {
            return Math.random()
                .toString(36)
                .substr(2);
        },
        delHtmlTag(str) {
            return str.replace(/<[^>]+>/g, "")
        },
        /* 获取消息列表 */
        getList() {
            this.fullscreenLoading = true;
            const IMUI = this.$refs.IMUI;
            IMUI.initMenus(this.MenusList);
            let dataList = []
            let dataList2 = []
            GET_SESSIONLIST(this.param).then(res => {
                this.pages = res.data.pages
                if (res.data.list.length != 0) {
                    {/* dataList = res.data.list.map((i) => { */ }
                    for (let i of res.data.list) {
                        this.idList.push(i.id)
                        i.displayName = i.contact ? i.contact.name : '未知用户';
                        i.lastSendTime = i.last_message ? i.last_message.last_send_at : i.updated_at;
                        i.unread = i.messages_count;
                        i.lastContent = IMUI.lastContentRender({ type: i.last_message ? i.last_message.type : 'text', content: i.last_message ? i.last_message.body : ' ' });
                        let messagePage = {
                            "page": 1,
                            "limit": 15,
                            "sort": "created_at",
                            "order": "desc",
                            "session_id": i.id
                        }
                        if (i.type == 'whatsapp') {
                            i.daojishi = this.countdown(i)
                            for (let j of i.labels) {
                                for (let w in this.labelList) {
                                    if (this.labelList[w].id == j.id) {
                                        this.labelList[w]['sessions'].push({ id: i.id, note: i.note, contact: { name: i.contact.name, id: i.contact.id } })
                                    }
                                }
                            }
                            if (new Date(i.expiration_at_unix) > new Date()) {
                                this.setIntervalList[i.id] = setInterval(() => {
                                    let a = this.countdown(i)
                                    IMUI.updateContact({
                                        id: i.id,
                                        daojishi: a
                                    });
                                }, 300000)
                            }
                        }
                        this.messageInfo.push(messagePage)
                        {/* return i */ }
                        if (i.type == 'whatsapp') {
                            dataList.push(i)
                        } else if (i.type == 'web') {
                            i.uid = i.contact.uid
                            dataList2.push(i)
                        }
                    }
                    {/* }) */ }
                    if (this.param.page == 1) {
                        this.list = dataList
                        this.list2 = dataList2
                    } else {
                        this.list.push(...dataList)
                        this.list2.push(...dataList2)
                        {/* IMUI.initContacts(this.list); */}
                    }
                }
                let loading2 = document.querySelector('.loading2')
                if (loading2) {
                    loading2.remove()
                }
                if (this.isOneOn) {
                    IMUI.initContacts(this.list);
                    if (this.list.length != 0) {
                        IMUI.changeContact(this.list[0].id);
                    }
                    this.isOneOn = false
                    IMUI.initEditorTools([{ name: "uploadImage" }]);
                    {/* this.ListenerScroll() */ }
                }
                let dome = document.querySelector('.lemon-editor__input')
                dome.contentEditable = 'plaintext-only'

                {/* 这里分页处理是新改的，下面注释部分是原有的，没分页 */}
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    this.loadingInstance.close();
                });
                return
                {/* if (this.param.page == this.pages) {
                    this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                        this.loadingInstance.close();
                    });
                    return
                } else {
                    this.param.page++
                    this.getList()
                } */}

            }).catch(err => {
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    this.loadingInstance.close();
                });
                console.log(err)
            })

        },
        getExpireSessionList() {
            const IMUI = this.$refs.IMUI;
            let dataList = []
            GET_EXPIRESESSIONLIST(this.param2).then(res => {
                if (res.data.list.length != 0) {
                    this.pages2 = res.data.pages
                    dataList = res.data.list.map((i) => {
                        {/* this.idList.push(i.id) */ }
                        i.displayName = i.contact ? i.contact.name : '未知用户';
                        i.lastSendTime = i.last_message ? i.last_message.last_send_at : i.updated_at;
                        i.unread = i.messages_count;
                        i.lastContent = IMUI.lastContentRender({ type: i.last_message ? i.last_message.type : 'text', content: i.last_message ? i.last_message.body : ' ' });
                        let messagePage = {
                            "page": 1,
                            "limit": 15,
                            "sort": "created_at",
                            "order": "desc",
                            "session_id": i.id
                        }
                        i.daojishi = this.countdown(i)
                        this.messageInfo.push(messagePage)
                        return i
                    })
                    if (this.param2.page == 1) {
                        this.expireList = dataList
                    } else {
                        this.expireList.push(...dataList)
                    }
                    if (this.param2.page == this.pages2) {
                        return
                    } else {
                        this.param2.page++
                        this.getExpireSessionList()
                    }
                }
            }).catch(err => {
                console.log()
            })
        },

         //监听滚动条事件-web
         ListenerScrollWeb() {
            let box = document.querySelectorAll(".lemon-sidebar__scroll")[0];
            box.addEventListener("scroll", (e) => {
                if (box.scrollHeight - box.scrollTop === box.clientHeight) { // 滚动到了底部
                    let loading = box.querySelector('.loading2')
                    if (!loading) {
                        let p = document.createElement('p')
                        p.className = 'loading2';
                        p.innerText = '加载中...';
                        if (this.pages == this.param.page) {
                            p.innerText = '已加载全部';
                            box.appendChild(p);
                        } else {
                            this.param.page++;
                            this.getList()
                        };
                    }
                }
                
            })
        },


        //监听滚动条事件
        ListenerScroll() {
            let box = document.querySelectorAll(".lemon-sidebar__scroll")[0];
            box.addEventListener("scroll", (e) => {
                let scrollTop = e.target.scrollTop;
                let clientHeight = e.target.clientHeight;
                let scrollHeight = e.target.scrollHeight;
                if (scrollTop + clientHeight == scrollHeight) {
                    let loading = box.querySelector('.loading2')
                    if (!loading) {
                        let p = document.createElement('p')
                        p.className = 'loading2'
                        p.innerText = '加载中...'
                        if (this.pages == this.param.page) {
                            p.innerText = '已加载全部'
                        } else {
                            this.param.page++;
                            this.getList()
                        }
                        box.appendChild(p);
                    }
                }
            })
        },
        //监听按键
        keydownFun(e) {
            const IMUI = this.$refs.IMUI;
            if (e.keyCode == 84 && e.altKey === true) {
                this.translate()
            } else if (e.keyCode == 8) {
                setTimeout(() => {
                    let message = IMUI.getEditorValue();
                    let message2 = this.delHtmlTag(message).replace(/^\s*/, "");
                    if (message2 != message) {
                        IMUI.setEditorValue(message2)
                    }
                    if (!message2) {
                        this.sourceLanguage = ''
                        this.isDisabled = true
                        return
                    }
                }, 50)
            } else if (e.ctrlKey && e.keyCode == 86) {
                setTimeout(() => {
                    let message = IMUI.getEditorValue();
                    message = this.delHtmlTag(message)
                    IMUI.setEditorValue(message)
                    message ? this.isDisabled = false : this.isDisabled = true
                }, 10)
            } else {
                setTimeout(() => {
                    let message = IMUI.getEditorValue();
                    message ? this.isDisabled = false : this.isDisabled = true
                }, 10)
            }
        },
        /* 获取消息详情 */
        handlePullMessages(contact, next) {
            for (let s of this.messageInfo) {
                if (contact.id == s.session_id) {
                    return GET_MESSAGE_LIST(s).then(res => {
                        let messages = res.data.list.map((data) => {
                            return {
                                id: data.id,
                                status: data.status,
                                type: data.type,
                                translator: data.translator,
                                sendTime: data.last_send_at,
                                content: data.type == 'text' ? data.body : this.URL + data.file.file_path,
                                toContactId: s.session_id,
                                fromUser: data.from_support_id ? this.user : contact
                            }
                        });
                        console.log('9999',messages)
                        if (s.page < res.data.pages) {
                            s.page++
                            next(messages.reverse(), false);
                        } else {
                            next(messages.reverse(), true);
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }
            }
        },
        //切换用户
        handleChangeContact(Contact) {
            if (this.MenuName === "messages") {
                Contact.unread = 0;
                this.sourceLanguage = ''
                let readevent = {
                    cmd: "read",
                    data: { session_id: Contact.id }
                }
                this.websock.send(JSON.stringify(readevent));
            }

        },
        //点击发送按钮
        handleSend(message, next, file) {
            if (message.type == "image") {
                return this.uploadImage(file, message, next, file)
            } else {
                message.translator = this.sourceLanguage
                this.SendMseeage(message, next, file)
            }
        },
        //发送消息
        SendMseeage(message, next, file, file_id) {
            const IMUI = this.$refs.IMUI;
            this.isDisabled = true
            if (!message) {
                return next({ status: 'failed' })
            }
            {/* message.sendTime = this.timestampToTime(message.sendTime,true) */ }
            let data = {
                "session_id": message.toContactId,
                "type": message.type,
                "body": message.type == 'image' ? "" : this.delHtmlTag(message.content).replace(/^\s*/, ""),
                "file_id": file_id,
                "translator": this.sourceLanguage
            };
            SENDMESSAGE(data).then(res => {
                this.sourceLanguage = ''
                if (res.errno == 0) {
                    message.status = res.data.status
                    message.id = res.data.id;
                    next();
                } else {
                    next({ status: 'failed' })
                }
            }).catch(err => {
                next({ status: 'failed' })
            })
        },
        //上传图片
        uploadImage(e, message, next, file) {
            var formData = new FormData();
            formData.append("file", e)
            UPLOADIMAGE(formData).then(res => {
                if (res.errno == 0) {
                    this.SendMseeage(message, next, file, res.data.file.id)
                } else {
                    this.SendMseeage()
                }
            }).catch(err => {
                console.log(err)
            })
        },
        initWebSocket() {
            //初始化weosocket
            const wsuri = "wss://wschat.micome.vip/ws?token=" + localStorage.getItem('token');
            this.websock = new WebSocket(wsuri);
            // 客户端接收服务端数据时触发
            this.websock.onmessage = this.websocketonmessage;
            // 连接建立时触发
            this.websock.onopen = this.websocketonopen;
            // 通信发生错误时触发
            this.websock.onerror = this.websocketonerror;
            // 连接关闭时触发
            this.websock.onclose = this.websocketclose;
        },
        //是否是今天
        isToday(time) {
            return new Date().getTime() - time < 86400000;
        },
        //是否是十位
        padZero(val) {
            return val < 10 ? `0${val}` : val;
        },
        //时间戳转换
        timestampToTime(t, format) {
            if (!format) format = "y-m-d h:i:s";
            if (t) t = new Date(t);
            else t = new Date();
            const formatArr = [
                t.getFullYear().toString(),
                this.padZero((t.getMonth() + 1).toString()),
                this.padZero(t.getDate().toString()),
                this.padZero(t.getHours().toString()),
                this.padZero(t.getMinutes().toString()),
                this.padZero(t.getSeconds().toString()),
            ];
            const reg = "ymdhis";
            for (let i = 0; i < formatArr.length; i++) {
                format = format.replace(reg.charAt(i), formatArr[i]);
            }
            return format;
        },
        /* 倒计时 */
        countdown(e) {
            let end
            `${e.expiration_at_unix}`.length == 10 ? end = Date.parse(new Date(e.expiration_at_unix * 1000)) : end = Date.parse(new Date(e.expiration_at_unix))
            const now = Date.parse(new Date())
            const msec = end - 1000 - now
            if (msec < 0) return '已过期';
            let day = parseInt(msec / 1000 / 60 / 60 / 24)
            let hr = parseInt(msec / 1000 / 60 / 60 % 24)
            let min = parseInt(msec / 1000 / 60 % 60)
            let dian = parseInt(min / 6)
            let sec = parseInt(msec / 1000 % 60)
            hr = hr > 9 ? hr : '0' + hr
            min = min > 9 ? min : '0' + min
            sec = sec > 9 ? sec : '0' + sec
            if (min >= 0 && sec >= 0) {
                //倒计时结束关闭订单
                if (day == 0 && hr == 0 && min == 0 && sec == 0) {
                    console.log("时间到咯~")
                    clearInterval(this.setIntervalList[e.id])
                    this.setIntervalList[e.id] = ''
                    return '已过期'
                } else if (hr == 0 && min * 1 < 10) {
                    return min + 'min'
                } else {
                    return hr + "." + dian + 'H'
                }
            } else {
                return '已过期'
            }
        },
        // 连接建立时触发
        websocketonopen() {
            //开启心跳
            this.start();
            this.websocketCloseFun = true
            //连接建立之后执行send方法发送数据
            let data = {
                cmd: "checkLogin",
                data: "heartbeat",
                ext: { test: "123123" }
            }
            this.websocketsend(JSON.stringify(data));
        },
        // 通信发生错误时触发
        websocketonerror() {
            console.log("出现错误");
            this.reconnect();
        },
        // 客户端接收服务端数据时触发
        websocketonmessage(e) {
            console.log('-------,客户端接收服务端数据',e);
            const IMUI = this.$refs.IMUI;
            try {
                let data = JSON.parse(e.data)
                if (data.code == 401) {
                    console.log('1-1')
                    clearInterval(this.timeoutObj);
                    this.websocketCloseFun = false
                    if (this.$route.fullPath != '/login') {
                        this.$alert(data.msg, '提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                localStorage.clear()
                                this.$router.replace('/login');
                            }
                        });
                    }

                } else {
                    console.log('2-1')
                    if (data.msg == 'status') {
                        this.updateMessage(data.data);
                        console.log('3-1')
                    } else {
                        console.log('4-1')
                        console.log('执行这里',data);
                        {/* start
                        *
                        * 客户端接收到消息客服端触发响应，标记'已读功能'
                        * 以下逻辑参考handlePullMessages方法的，后面维护看不懂可以参考handlePullMessages方法
                        *
                         */}
                         if(data.cmd == "notice_messread"){
                            for (let s of this.messageInfo) {
                            if (data.data.session_id == s.session_id) {
                                return GET_MESSAGE_LIST({
                                    page: 1,
                                    limit: 15,
                                    sort: 'created_at',
                                    order: 'desc',
                                    session_id: data.data.session_id,
                                }).then(res => {
                                    let messages = res.data.list.map((par) => {
                                        return {
                                            id: par.id,
                                            status: par.status,
                                            type: par.type,
                                            translator: par.translator,
                                            sendTime: par.last_send_at,
                                            content: par.type == 'text' ? par.body : this.URL + par.file.file_path,
                                            toContactId: data.data.session_id,
                                            fromUser:this.user
                                        }
                                    });
                                    const { IMUI } = this.$refs;
                                    const messages_2 = IMUI.getMessages(data.data.session_id);
                                    let message
                                    for (let i of messages_2) {
                                        if (data.data.messages_id == i.id) {
                                            message = i
                                            message.status = 'read'
                                            IMUI.updateMessage(message)
                                        }
                                    };
                                }).catch(err => {
                                    console.log(err)
                                })
                            }
                        }
                         }
                        
                        {/* END */}

                        data = data.data
                        console.log('====================',this.idList)
                        {/* 当接收到用户端的消息时，播放map3 */}
                        this.$refs.audioTip.play();
                        if (this.idList.indexOf(data.session_id) == -1) {
                            console.log('5-1')
                            this.idList.push(data.session_id);
                            let messagesdata = {
                                id: data.session_id,
                                displayName: data.contact.name,
                                unread: 0,
                                /* lastSendTime: this.timestampToTime(data.last_send_at, true), */
                                lastSendTime: data.last_send_at,
                                lastContent: IMUI.lastContentRender({ type: data.type, content: data.type == 'text' ? data.body : "[图片]" }),
                                contact_id: data.contact_id,
                                /* expiration_at_unix: this.timestampToTime(data.session.expiration_at_unix), */
                                expiration_at_unix: data.session.expiration_at_unix,
                                contact: data.contact,
                                translator: data.translator,
                            }
                            if (data.contact.type == 'whatsapp') {
                                console.log('6-1')
                                messagesdata.daojishi = this.countdown(data.session)
                                this.list.push(messagesdata)
                            } else if (data.contact.type == 'web') {
                                console.log('7-1')
                                messagesdata.uid = data.contact.uid
                                this.list2.push(messagesdata);
                            }
                            let messagePage = {
                                "page": 1,
                                "limit": 15,
                                "sort": "created_at",
                                "order": "desc",
                                "session_id": data.session_id
                            }
                            if (new Date(data.session.expiration_at_unix) > new Date() && data.contact.type == 'whatsapp') {
                                this.setIntervalList[data.session_id] = setInterval(() => {
                                    let a = this.countdown(data.session)
                                    IMUI.updateContact({
                                        id: data.session_id,
                                        daojishi: a
                                    });
                                }, 300000)
                            }
                            this.messageInfo.push(messagePage);

                        }
                        const datas = {
                            id: data.id,
                            status: 'succeed',
                            type: data.type,
                            sendTime: data.last_send_at,
                            content: data.type == "text" ? data.body : this.URL + data.file.file_path,
                            toContactId: data.session_id,
                            fromUser: data.contact,
                            translator: data.translator
                        };
                        IMUI.appendMessage(datas, true);
                        let datamessage = {
                            id: data.session_id,
                            expiration_at_unix: data.session.expiration_at_unix,
                            lastSendTime: data.last_send_at,
                            lastContent: IMUI.lastContentRender({ type: data.type, content: data.type == 'text' ? data.body : "[图片]" })
                        }
                        if (data.contact.type == 'whatsapp') {
                            console.log('8-1')
                            datamessage.daojishi = this.countdown(data.session)
                        }
                        if (data.contact.type == 'whatsapp' && this.activeIndex3 != 1) {
                            console.log('9-1')
                            this.badgeShow1 = false
                        } else if (data.contact.type == 'web' && this.activeIndex3 != 2) {
                            console.log('10-1')
                            this.badgeShow2 = false

                        }
                        IMUI.updateContact(datamessage);
                       
                        if (!this.visibilityState) {
                            {/* this.$refs.audioTip.play(); */}
                            const notification = new Notification(data.contact.name, {
                                body: IMUI.lastContentRender({ type: data.type, content: data.type == 'text' ? data.body : "[图片]" }),
                                silent: true
                            });
                        };
                       
                    }

                }

            }
            catch (err) {
                console.log("错误", err);
            }
        },
        updateMessage(e) {
            const { IMUI } = this.$refs;
            const messages = IMUI.getMessages(e.session_id);
            let message
            for (let i of messages) {
                if (e.id == i.id) {
                    message = i
                    message.status = e.status
                    IMUI.updateMessage(message)
                }
            }
        },
        websocketsend(Data) {
            //数据发送
            this.websock.send(Data);
        },
        // 连接关闭时触发
        websocketclose(e) {
            //关闭
            console.log("断开连接", e);
            //重连
            if (this.websocketCloseFun) {
                this.reconnect();
            }
        },
        reconnect() {
            const IMUI = this.$refs.IMUI;
            //重新连接
            var that = this;
            that.lockReconnect = true;
            //没连接上会一直重连，设置延迟避免请求过多
            that.timeoutnum && clearTimeout(that.timeoutnum);
            that.timeoutnum = setTimeout(function () {
                //新连接
                that.initWebSocket();
                that.lockReconnect = false;
            }, 5000);
        },

        start() {
            //开启心跳
            {/* var this = this; */ }
            this.timeoutObj && clearInterval(this.timeoutObj);
            this.timeoutObj = setInterval(() => {
                console.log("开启心跳");
                //这里发送一个心跳，后端收到后，返回一个心跳消息，
                //如果连接正常
                let data = {
                    cmd: "ping",
                    data: "heartbeat",
                    ext: { test: "123123" }
                }
                this.websock.send(JSON.stringify(data)); //这里可以自己跟后端约定
            }, this.timeout);
        },
    },
};
</script>
<style>
.avatarUploader .el-upload--text {
    width: 22px;
    height: 28px;
    background-image: url("/assets/img/image.png");
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

.datu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
}

.datu img {
    width: 500px;
    height: auto;
}

.lemon-vessel__right {
    background-color: #fff;
    box-sizing: border-box;
    padding: 24px;

}

.rightBox {
    width: 300px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    margin-top: 20px;
}

.seleFontstyle {
    line-height: 32px;
    color: #999;
}

.textcolor {
    color: #999;
}

.translateimg {
    font-size: 20px;
    line-height: 24px;
}

.translateImg:hover {
    color: #333;
}

.lxrBox {
    position: relative;
}

.daojishi {
    position: absolute;
    top: -6px;
    left: 6px;
    color: #999;
}

.weidu {
    position: absolute;
    display: inline-block;
    padding: 0px 6px;
    border-radius: 9px;
    background-color: red;
    top: 25px;
    left: 20px;
    color: #fff;
}

.displayName {
    display: none !important;
}

.biaoqian {
    background-color: #1093ff;
    display: inline-block;
    margin-right: 4px;
    padding: 2px 4px;
    color: #fff;
    border-radius: 4px;
}

.labelTop {
    padding: 12px;
    text-align: right;
}

.el-card__body {
    width: 100%;
    display: flex;
    height: calc(100vh - 320px);
    /* justify-content: space-between; */
    flex-direction: column;
}

.input2 {
    height: 32px;
    line-height: 32px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    outline: 0;
    padding: 0 15px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 100%;
    margin-bottom: 20px;
}

.input2:focus {
    outline: none;
    border-color: #409eff !important;
}

.text {
    font-size: 14px;
}

.el-collapse {
    height: 100%;
    border-top: none;
    overflow: auto;
}

::-webkit-scrollbar {
    display: none;
    scrollbar-width: none;
}

.lvse {
    fill: #0fd547;
}

.loading2 {
    text-align: center;
    padding: 0 0 8px;
    color: #ccc;
    font-size: 12px;
}

.el-menu-item {
    width: 50%;
    text-align: center;
}

.el-menu-item2 {
    width: 100%;
}

.badge {
    width: 50%;
}

.el-badge__content {
    right: 20px !important;
    top: 10px !important;
}

.kuaijiehuifu {
    width: 247px;
    height: 49px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    /* autoprefixer: off  */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;

}
</style>
