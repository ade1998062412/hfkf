<template>
    <div class="pc_customerServer">
        <div class="fixed" v-if="upperData.noCanClose == 1"></div>
        <div class="pc_customerServer_container max-width_con"
            :class="{ 'max-width_advertisement': upperData.noCanClose == 1 || upperData.windowStyle == `center` }">
            <!-- 客服头部开始 -->
            <div class="pc_customerServer_container_header">
                <div class="pc_customerServer_container_header_title">
                    <svg t="1689145468031" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="2352" width="32" height="32">
                        <path
                            d="M927.616 465.6C923.328 236.704 745.888 51.808 528 51.808h-32c-217.888 0-395.328 184.896-399.616 413.76C58.112 487.744 32 528.672 32 576v64c0 70.592 57.408 128 128 128s128-57.408 128-128v-64a128.064 128.064 0 0 0-126.784-127.872C173.728 262.688 318.912 115.808 496 115.808h32c177.12 0 322.272 146.88 334.784 332.32A128.064 128.064 0 0 0 736 576v64c0 57.792 38.72 106.176 91.392 122.016a337.504 337.504 0 0 1-191.936 124.48A79.712 79.712 0 0 0 560 832a80 80 0 1 0 0 160 79.68 79.68 0 0 0 67.872-38.112 402.432 402.432 0 0 0 278.24-193.6C955.968 742.816 992 695.776 992 640v-64c0-47.328-26.112-88.256-64.384-110.4zM224 576v64c0 35.296-28.704 64-64 64s-64-28.704-64-64v-64c0-35.296 28.704-64 64-64s64 28.704 64 64z m704 64c0 34.304-27.2 62.176-61.12 63.712l-2.496-1.184c-0.224 0.512-0.576 0.928-0.8 1.408A64 64 0 0 1 800 640v-64c0-35.296 28.704-64 64-64s64 28.704 64 64v64z"
                            p-id="2353" fill="#ffffff"></path>
                    </svg>
                    <span style="margin-left: 12px;">{{ chatServerData.to_user_nickname }}</span>
                </div>
                <div class="pc_customerServer_container_header_handle" @click="closeIframe">
                    <span class="iconfont">&#xe6c5;</span>
                </div>
            </div>
            <!-- 客服头部结束 -->
            <div class="layout_content">

                <div class="layout_customerServer_content">
                    <!-- 聊天内容开始 -->
                    <div class="pc_customerServer_container_content">
                        <happy-scroll size="1" resize hide-horizontal :scroll-top="scrollTop"
                            @vertical-start="scrollHandler">
                            <div class="scroll_content" id="chat_scroll"
                                :class="{ 'pt140': isShowProductModel || inputConType == 2 }">
                                <!-- 滑动到容器顶部时，动画加载 -->
                                <Spin v-show="isLoad">
                                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                                    <div>{{ $t('loadingText') }}</div>
                                </Spin>
                                <div class="lishi" @click="getRecord" v-if="!lishibth">{{ $t('loadHistory') }}</div>
                                <!-- 动画结束 -->

                                <!-- 聊天内容列表 -->
                                <div class="chart_list">
                                    <div class="chart_list_item" v-for="(item, index) in records" :key="index">
                                        <div class="chart_list_item_time" v-show="item.show">{{ item.time }}</div>
                                        <div class="chart_list_item_content"
                                            :class="{ 'right-box': item.user_id == chatServerData.user_id }">
                                            <div class="chart_list_item_avatar">
                                                <!-- <img :src="item.avatar" alt=""> -->
                                                <svg t="1689148012722" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                                    xmlns="http://www.w3.org/2000/svg" p-id="2651" width="32" height="32"
                                                    v-if="item.user_id != chatServerData.user_id">
                                                    <path
                                                        d="M517.6 877.7v-16c185.2 0 335.9-155.9 335.9-347.4v-96.6c0-191.6-150.7-347.4-335.9-347.4S181.7 226.1 181.7 417.7v96.6h-16v-96.6c0-48.8 9.3-96.3 27.7-141 17.8-43.2 43.2-82.1 75.5-115.5 32.4-33.5 70-59.7 111.9-78.1 43.4-19.1 89.4-28.7 136.8-28.7s93.4 9.7 136.8 28.7c41.9 18.4 79.5 44.7 111.9 78.1 32.4 33.4 57.8 72.3 75.5 115.5 18.4 44.8 27.7 92.2 27.7 141v96.6c0 48.8-9.3 96.3-27.7 141-17.8 43.2-43.2 82.1-75.5 115.5-32.4 33.5-70 59.7-111.9 78.1-43.5 19.1-89.5 28.8-136.8 28.8z"
                                                        p-id="2652" fill="#1296db"></path>
                                                    <path
                                                        d="M366.6 171.8c-1.3 0-2.6-0.6-3.3-1.8-1.2-1.8-0.7-4.3 1.1-5.5 45.8-30.6 98.7-46.7 153.2-46.7 54.2 0 107 16 152.7 46.4 1.8 1.2 2.3 3.7 1.1 5.5-1.2 1.8-3.7 2.3-5.5 1.1-44.4-29.5-95.6-45.1-148.3-45.1-52.8 0-104.3 15.7-148.7 45.4-0.7 0.5-1.5 0.7-2.3 0.7z"
                                                        p-id="2653" fill="#1296db"></path>
                                                    <path
                                                        d="M202.2 653.6h-71.9c-29.5 0-53.6-23.3-53.6-51.9V428.9c0-28.5 24.1-51.9 53.6-51.9h71.9c6.9 0 12.5 5.4 12.5 12.1v252.4c0 6.7-5.6 12.1-12.5 12.1z"
                                                        fill="#1296db" p-id="2654"></path>
                                                    <path
                                                        d="M202.2 661.6h-71.9c-33.9 0-61.6-26.9-61.6-59.9V428.9c0-33 27.6-59.9 61.6-59.9h71.9c11.3 0 20.5 9 20.5 20.1v252.4c0 11.1-9.2 20.1-20.5 20.1z m-71.9-276.5c-25.1 0-45.6 19.7-45.6 43.9v172.9c0 24.2 20.4 43.9 45.6 43.9h71.9c2.5 0 4.5-1.8 4.5-4.1V389.2c0-2.3-2-4.1-4.5-4.1h-71.9z"
                                                        p-id="2655" fill="#1296db"></path>
                                                    <path d="M153.1 620.5c-22.6 0-41.1-17.9-41.1-39.8" fill="#1296db"
                                                        p-id="2656"></path>
                                                    <path
                                                        d="M153.1 624.5c-24.9 0-45.1-19.6-45.1-43.8 0-2.2 1.8-4 4-4s4 1.8 4 4c0 19.7 16.6 35.8 37.1 35.8 2.2 0 4 1.8 4 4s-1.8 4-4 4z"
                                                        p-id="2657" fill="#1296db"></path>
                                                    <path
                                                        d="M839.3 651.7h71.9c29.5 0 53.6-23.3 53.6-51.9V427c0-28.5-24.1-51.9-53.6-51.9h-71.9c-6.9 0-12.5 5.4-12.5 12.1v252.4c0 6.7 5.5 12.1 12.5 12.1z"
                                                        fill="#1296db" p-id="2658"></path>
                                                    <path
                                                        d="M911.1 659.7h-71.9c-11.3 0-20.5-9-20.5-20.1V387.3c0-11.1 9.2-20.1 20.5-20.1h71.9c33.9 0 61.6 26.9 61.6 59.9V600c0 32.9-27.6 59.7-61.6 59.7z m-71.8-276.5c-2.5 0-4.5 1.8-4.5 4.1v252.4c0 2.3 2 4.1 4.5 4.1h71.9c25.1 0 45.6-19.7 45.6-43.9V427c0-24.2-20.4-43.9-45.6-43.9h-71.9z"
                                                        p-id="2659" fill="#1296db"></path>
                                                    <path
                                                        d="M598.6 922.6h-162c-16.5 0-30-13.5-30-30v-50.7c0-16.5 13.5-30 30-30h162c16.5 0 30 13.5 30 30v50.7c0 16.5-13.5 30-30 30z"
                                                        fill="#1296db" p-id="2660"></path>
                                                    <path
                                                        d="M598.6 930.6h-162c-21 0-38-17-38-38v-50.7c0-21 17-38 38-38h162c21 0 38 17 38 38v50.7c0 20.9-17 38-38 38zM436.7 819.9c-12.1 0-22 9.9-22 22v50.7c0 12.1 9.9 22 22 22h162c12.1 0 22-9.9 22-22v-50.7c0-12.1-9.9-22-22-22h-162zM518.5 723.5c-34.5 0-68.2-9.2-97.7-26.7-8.7-5.2-17.1-11.1-25-17.6-3.4-2.8-3.9-7.9-1-11.3 2.8-3.4 7.9-3.9 11.3-1 7.2 6 14.9 11.4 22.9 16.2 27 16 58 24.5 89.6 24.5 41.5 0 81.8-14.8 113.5-41.5 3.4-2.9 8.4-2.4 11.3 0.9 2.9 3.4 2.4 8.4-0.9 11.3-34.7 29.1-78.7 45.2-124 45.2zM181.5 569.6h6.1c1.7 0 3 1.3 3 3v52.1c0 1.7-1.3 3-3 3h-6.1c-1.7 0-3-1.3-3-3v-52.1c0-1.7 1.3-3 3-3z"
                                                        p-id="2661" fill="#1296db"></path>
                                                    <path
                                                        d="M540.7 894.3v-6.1c0-1.7 1.3-3 3-3h52.1c1.7 0 3 1.3 3 3v6.1c0 1.7-1.3 3-3 3h-52.1c-1.6 0-3-1.3-3-3zM569.8 866.7v-6.1c0-1.7 1.3-3 3-3h23.1c1.7 0 3 1.3 3 3v6.1c0 1.7-1.3 3-3 3h-23.1c-1.6 0-3-1.3-3-3zM181.5 525.7h6.1c1.7 0 3 1.3 3 3v23.4c0 1.7-1.3 3-3 3h-6.1c-1.7 0-3-1.3-3-3v-23.4c0-1.6 1.3-3 3-3z"
                                                        p-id="2662" fill="#1296db"></path>
                                                    <path
                                                        d="M858.5 569.6h6.1c1.7 0 3 1.3 3 3v52.1c0 1.7-1.3 3-3 3h-6.1c-1.7 0-3-1.3-3-3v-52.1c0-1.7 1.3-3 3-3z"
                                                        p-id="2663" fill="#1296db"></path>
                                                    <path
                                                        d="M858.5 525.7h6.1c1.7 0 3 1.3 3 3v23.4c0 1.7-1.3 3-3 3h-6.1c-1.7 0-3-1.3-3-3v-23.4c0-1.6 1.3-3 3-3z"
                                                        p-id="2664" fill="#1296db"></path>
                                                    <path d="M889.3 620.5c22.6 0 41.1-17.9 41.1-39.8" fill="#1296db"
                                                        p-id="2665"></path>
                                                    <path
                                                        d="M889.3 624.5c-2.2 0-4-1.8-4-4s1.8-4 4-4c20.4 0 37.1-16 37.1-35.8 0-2.2 1.8-4 4-4s4 1.8 4 4c0 24.2-20.2 43.8-45.1 43.8z"
                                                        p-id="2666" fill="#1296db"></path>
                                                    <path
                                                        d="M771.3 448.5c-0.3 0-0.6 0-0.9-0.1-41.2-4.7-73-49.4-92.5-86.2-14.6-27.7-25.4-56.6-31-76.9-22.8 36.5-52.9 65.4-89.8 86.3-34.2 19.4-74.2 31.8-118.8 37-75.6 8.7-137.7-6.2-140.3-6.9a8.1 8.1 0 0 1-5.9-9.7 8.1 8.1 0 0 1 9.7-5.9c0.6 0.2 62.3 15 135.1 6.5 96.6-11.3 166-56.1 206.4-133.3 1.7-3.2 5.3-4.9 8.8-4.1 3.5 0.8 6.1 3.8 6.3 7.4 0.7 11.2 12.8 52.7 33.7 92.2 24.9 47.1 53.4 74.7 80.1 77.7 4.4 0.5 7.5 4.5 7.1 8.8-0.5 4.2-4 7.2-8 7.2z"
                                                        p-id="2667" fill="#1296db"></path>
                                                </svg>
                                                <svg v-else t="1689148184083" class="icon" viewBox="0 0 1024 1024"
                                                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4047" width="32"
                                                    height="32">
                                                    <path
                                                        d="M513.536 628.6336c101.6832 0 280.8832 38.7072 310.8864 193.7408 77.5168-77.5168 124.928-185.9584 124.928-305.0496 0-241.152-194.6624-435.8144-435.8144-435.8144S77.7216 277.0944 77.7216 517.2224c0 119.0912 47.4112 227.6352 124.928 306.0736 30.0032-154.9312 209.2032-194.6624 310.8864-194.6624z m0-439.7056c112.3328 0 204.3904 91.0336 204.3904 204.3904 0 112.3328-91.0336 204.3904-204.3904 204.3904a203.776 203.776 0 0 1-204.3904-204.3904c0.1024-112.4352 92.0576-204.3904 204.3904-204.3904z m0 0"
                                                        fill="#1296db" p-id="4048"></path>
                                                    <path
                                                        d="M515.4816 1006.8992c-65.8432 0-129.8432-12.9024-189.952-38.4-58.1632-24.576-110.2848-59.8016-155.136-104.5504A485.56032 485.56032 0 0 1 65.8432 708.8128c-25.6-60.2112-38.5024-124.1088-38.5024-189.952 0-65.8432 12.9024-129.8432 38.4-189.952 24.576-58.1632 59.8016-110.2848 104.5504-155.136 44.8512-44.8512 96.9728-79.9744 155.136-104.5504C385.6384 43.6224 449.536 30.72 515.4816 30.72c65.8432 0 129.8432 12.9024 189.952 38.4 58.1632 24.576 110.2848 59.8016 155.136 104.5504 44.8512 44.8512 79.9744 96.9728 104.5504 155.136C990.6176 389.0176 1003.52 452.9152 1003.52 518.8608c0 65.8432-12.9024 129.8432-38.4 189.952-24.576 58.1632-59.8016 110.2848-104.5504 155.136a485.56032 485.56032 0 0 1-155.136 104.5504 484.39296 484.39296 0 0 1-189.952 38.4z m0-936.8576c-60.6208 0-119.3984 11.8784-174.6944 35.2256a447.76448 447.76448 0 0 0-142.6432 96.1536A444.42624 444.42624 0 0 0 101.9904 344.064a446.70976 446.70976 0 0 0-35.2256 174.6944c0 60.6208 11.8784 119.3984 35.2256 174.6944 22.6304 53.4528 54.9888 101.4784 96.1536 142.6432 41.1648 41.2672 89.1904 73.6256 142.6432 96.1536 55.296 23.3472 114.0736 35.2256 174.6944 35.2256 60.6208 0 119.3984-11.8784 174.6944-35.2256 53.4528-22.6304 101.4784-54.9888 142.6432-96.1536 41.2672-41.1648 73.6256-89.1904 96.1536-142.6432 23.3472-55.296 35.2256-114.0736 35.2256-174.6944 0-60.6208-11.8784-119.3984-35.2256-174.6944a447.76448 447.76448 0 0 0-96.1536-142.6432 444.42624 444.42624 0 0 0-142.6432-96.1536 447.44704 447.44704 0 0 0-174.6944-35.2256z m0 0"
                                                        fill="#1296db" p-id="4049"></path>
                                                </svg>
                                            </div>
                                            <!-- 文字及表情信息 -->
                                            <div class="chart_list_item_text" v-if="item.msn_type <= 2">
                                                <span v-html="replace_em(item.msn)"></span>
                                            </div>
                                            <!-- 图片信息 -->
                                            <div class="chart_list_item_img" v-if="item.msn_type == 3">
                                                <img v-lazy="item.msn" @load="imageLoad" />
                                            </div>
                                            <!-- 已读标记 -->
                                            <!-- <img style="width:16px;height:15px;margin-left:10px;" v-if='!item.user_id' src="@/assets/images/customerServer/read.png" alt=""> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </happy-scroll>
                    </div>
                    <!-- 聊天内容结束 -->

                    <!-- 内容输入开始 -->
                    <div class="pc_customerServer_container_footer">
                        <div class="pc_customerServer_container_footer_header">
                            <div class="pc_customerServer_container_footer_header_handle">
                                <div>
                                    <img src="@/assets/images/customerServer/picture.png" alt="">
                                    <input type="file" accept=".jp2,.jpe,.jpeg,.jpg,.png,.svf,.tif,.tiff" class="type_file"
                                        @change="uploadFile" :title="$t('selectImage')">
                                </div>
                            </div>
                        </div>

                        <!-- 输入框容器 -->
                        <div class="pc_customerServer_container_footer_input" @click="inputConType = 1">
                            <!-- <textarea v-model="userMessage" @keyup.enter="sendText" class="pc_customerServer_container_footer_input-textarea opacity0" rows="5" placeholder="请输入文字"></textarea> -->
                            <div v-paste="handleParse" ref="inputDiv" @keyup.enter="sendText" contenteditable
                                class="pc_customerServer_container_footer_input-textarea"
                                :class="{ 'readyEmojiHeight': inputConType == 2 }">
                            </div>
                        </div>
                        <!-- 输入框容器结束 -->
                        <!-- 表情及图片容器结束 -->
                        <!-- 相关操作 -- 点击发送 -->
                        <div class="pc_customerServer_container_footer_handle">
                            <div class="pc_customerServer_container_footer_handle_send" @click="sendText">
                                <span>{{ $t('send') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { HappyScroll } from 'vue-happy-scroll'
import socketServer from './minix/socketServer';
export default {
    components: {
        HappyScroll
    },
    mixins: [socketServer],
    data() {
        return {
            happyScroll: false,
            isLoad: false,
            scrollTop: 0,
            inputConType: 1,
            deviceType: 'pc',
        }
    },
    created() {
    },
    computed: {
        records() {
            return this.chatServerData.serviceList.map((item, index) => {
                item.time = this.formatDate(item.add_time * 1000);
                if (index) {
                    if (
                        item.add_time -
                        this.chatServerData.serviceList[index - 1].add_time >=
                        300
                    ) {
                        item.show = true;
                    } else {
                        item.show = false;
                    }
                } else {
                    item.show = true;
                }
                return item;
            });
        }
    },
    methods: {
      

        getScrollTop() {
        },
        getScrollEnd() {
        },
        // 聊天表情转换
        replace_em(str) {
            str = str.replace(/\[em-([\s\S]*)\]/g, "<span class='em em-$1'/></span>");
            return str;
        },
    }
}
</script>
<style lang="less" scoped>
.max-width_con {
    max-width: 600px;
}

.max-width_advertisement {
    max-width: 840px;
}

.pc_customerServer_container {
    width: 100%;
    height: 100%;
    max-height: 654px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #fff;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 1px 1px 15px 0px rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    overflow: hidden;

    &_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(270deg, #1890ff, #3875ea);
        padding: 14px 14px;
        box-sizing: border-box;
        height: 56px;
        font-size: 16px;
        color: #fff;

        &_title {
            display: flex;
            align-items: center;

            img {
                width: 30px;
                height: 30px;
                border-radius: 50%;
                margin-right: 10px;
            }
        }

        &_handle {
            cursor: pointer;
        }
    }

    &_content {
        flex: 1;
        overflow: hidden;

        .scroll_content {
            width: 100%;
            height: 100%;
            overflow-y: auto;
            padding-bottom: 20px;
            box-sizing: border-box;
            position: relative;

            .chart_list {
                &_item {
                    &_content {
                        display: flex;
                        align-items: center;
                        padding: 8px;
                        box-sizing: border-box;
                    }

                    &_avatar {
                        width: 33px;
                        height: 33px;
                        border-radius: 50%;
                        overflow: hidden;
                        margin-right: 10px;
                        align-self: flex-start;

                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    &_text {
                        max-width: 60%;
                        word-wrap: break-word;
                        background: #f5f5f5;
                        padding: 7px 14px;
                        font-size: 15px;
                        border-radius: 4px;
                    }

                    &_img {
                        max-width: 60%;

                        img {
                            width: 100%;
                            height: auto;
                        }
                    }

                    .chart_list_item_imgOrText {
                        background: #ccc;
                        padding: 4px 10px;
                        border-radius: 8px;
                        width: 226px;
                        box-sizing: border-box;

                        .order-wrapper {
                            .img-box {
                                width: 100%;

                                img {
                                    width: 100%;
                                    height: auto;
                                }
                            }

                            .order-info {
                                .price-box {
                                    color: #ff0000;
                                    font-size: 18px;
                                }

                                .name {
                                    font-size: 14px;
                                }
                            }
                        }
                    }

                    &_time {
                        text-align: center;
                        margin: 10px auto;
                    }

                    .right-box {
                        flex-direction: row-reverse;

                        .chart_list_item_avatar {
                            margin-left: 10px;
                        }

                        .chart_list_item_text {
                            text-align: left;
                            background: #cde0ff;
                            color: #000000;
                        }

                        .chart_list_item_img {
                            text-align: right;
                            background: #fff;

                            img {
                                width: 100%;
                                height: auto;
                            }
                        }

                        .chart_list_item_imgOrText {
                            background: #fff;
                            padding: 10px;
                            border-radius: 8px;
                            width: 226px;
                            box-sizing: border-box;

                            .order-wrapper {
                                .img-box {
                                    width: 100%;

                                    img {
                                        width: 100%;
                                        height: auto;
                                    }
                                }

                                .order-info {
                                    .price-box {
                                        color: #ff0000;
                                        font-size: 18px;
                                    }

                                    .name {
                                        font-size: 14px;
                                    }
                                }
                            }
                        }
                    }

                    &_text {}
                }
            }
        }
    }

    &_footer {
        background: #fff;
        padding: 14px 18px;
        min-height: 180px;
        border-top: 1px solid #ececec;

        &_header {
            position: relative;

            &_handle {
                display: flex;

                >div {
                    margin-right: 19px;
                    position: relative;

                    img {
                        width: 18px;
                        height: 18px;
                    }

                    .type_file {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        top: 0;
                        left: 0;
                        opacity: 0;
                    }
                }
            }
        }

        &_input {
            &-textarea {
                width: 100%;
                height: 100%;

                border: none;
                outline: none;
                padding-top: 4px;
                font-size: 14px;
                line-height: 16px;
            }

            >div {
                max-width: 543px;
                min-width: 304px;
                height: 90px;
                max-height: 90px;
                overflow-y: auto;
            }

            .opacity0 {
                opacity: 0;
            }

            .readyEmojiHeight {
                height: 90px;
            }
        }

        &_emoji {
            max-width: 420px;
            display: grid;
            grid-template-columns: repeat(9, 1fr);
            padding-top: 10px;
            max-height: 150px;
            overflow-y: auto;
            background: #fff;
            position: absolute;
            bottom: 50px;
            left: 0;

            .emoji-item {
                padding: 6px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        &_handle {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-bottom: 10px;

            &_send {
                width: 56px;
                height: 26px;
                background: #3875ea;
                border-radius: 3px;
                color: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                position: relative;
                z-index: 100;
                margin: 0 20px 20px 0;
            }
        }

        &_copyright {
            position: absolute;
            left: -8%;
            width: 110%;
            display: block;
            text-align: center;
            bottom: 0;
            color: #bbb;
            padding: 5px 10px;
            /*background-color: #eee;*/
        }
    }
}

.layout_content {
    flex: 1;
    display: flex;

    // justify-content: space-between;
    .layout_customerServer_content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-right: 1px solid #ececec;
    }

    .pc_customerServer_container_advertisement {
        width: 260px;
        background: #fff;

        .advertisement {
            padding: 5px;
            box-sizing: border-box;
            height: 550px;
            overflow-y: auto;

            img {
                max-width: 100% !important;
            }
        }

        .copyright {
            position: fixed;
            bottom: 20px;
            text-align: center;
            width: 230px;
            transition: 0.3s;
            z-index: 99;
            cursor: pointer;

            span {
                color: #ccc;
            }

            span:hover {
                color: #007aff;
            }
        }
    }
}

.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
}

.productMessage_container {
    height: 94px;
    width: 100%;
    padding: 12px;
    box-sizing: border-box;
    background: #fff;
    display: flex;
    justify-content: space-between;

    &_image {
        margin-right: 12px;

        img {
            width: 77px;
            height: 77px;
        }
    }

    &_content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &_title {
            font-size: 14px;
            color: #333;
            height: 42px;
            font-weight: 800;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-align: left !important;
        }

        &_priceOrHandle {
            display: flex;
            justify-content: space-between;

            >div:nth-child(1) {
                font-size: 18px;
                color: #e93323;
                text-align: left;
            }

            >div:nth-child(2) {
                width: 65px;
                height: 25px;
                background: #e83323;
                opacity: 1;
                border-radius: 62px;
                color: #fff;
                font-size: 12px;
                text-align: center;
                line-height: 25px;
                cursor: pointer;
            }
        }
    }
}

.fixed {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
}

.pt140 {
    padding-bottom: 140px !important;
}

@keyframes ani-demo-spin {
    from {
        transform: rotate(0deg);
    }

    50% {
        transform: rotate(180deg);
    }

    to {
        transform: rotate(360deg);
    }
}

/deep/ .happy-scroll-content {
    width: 100% !important;
    box-sizing: border-box;
}
</style>
<style lang="less">
.advertisement {

    img,
    p,
    div,
    span {
        max-width: 100%;
    }
}

.happy-scroll-container {
    width: 100% !important;
}

.advertisement {
    overflow: auto !important;
}

.advertisement::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 1px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
}

.advertisement::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background-color: skyblue;
    background-image: -webkit-linear-gradient(45deg,
            rgba(255, 255, 255, 0.2) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.2) 75%,
            transparent 75%,
            transparent);
}

.advertisement::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #ededed;
    border-radius: 10px;
}

.lishi{
    text-align: center;
    margin: 10px;
    color: #1890ff;
    cursor: pointer;
}
.lishi:hover{
    color: #007aff;
}
</style>
