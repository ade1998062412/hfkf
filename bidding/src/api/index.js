import request from '../utils/request';

// 登录
export const LOGIN = query => {
    return request({
        url: '/support/auth/login',
        method: 'post',
        params: query
    });
};
// 获取用户信息
export const GET_INFO = query => {
    return request({
        url: '/support/auth/info',
        method: 'get',
        params: query
    });
};
// 修改状态
export const CHANGESTATUS = query => {
    console.log(query);
    return request({
        url: '/support/auth/changeStatus',
        method: 'post',
        data: query
    });
};
// 退出登录
export const LOGOUT = query => {
    return request({
        url: '/support/auth/logout',
        method: 'post',
        params: query
    });
};
// 获取会话列表
export const GET_SESSIONLIST = query => {
    return request({
        url: '/support/session/getSessionList',
        method: 'post',
        params: query
    });
};



// 删除某个会话
export const DEL_SESSION = query => {
    return request({
        url: '/support/session/delSession',
        method: 'post',
        data: query
    });
};


// 获取会话详情
export const GET_MESSAGE_LIST = query => {
    return request({
        url: '/support/session/getMessageList',
        method: 'post',
        params: query
    });
};
// 发送消息
export const SENDMESSAGE = query => {
    return request({
        url: '/support/session/sendMessage',
        method: 'post',
        params: query
    });
};
// 上传图片
export const UPLOADIMAGE = query => {
    return request({
        url: '/support/file/upload',
        method: 'post',
        data: query
    });
};
// 获取翻译枚举配置
export const GETENUMS = query => {
    return request({
        url: '/support/translater/getEnums',
        method: 'get',
        data: query
    });
};
// 获取当前客服的翻译设置
export const GETCONFIG = query => {
    return request({
        url: '/support/translater/getConfig',
        method: 'get',
        data: query
    });
};
// 保存翻译设置
export const SAVECONFIG = query => {
    return request({
        url: '/support/translater/saveConfig',
        method: 'post',
        data: query
    });
};
// 翻译文本
export const TRANSLATE = query => {
    return request({
        url: '/support/translater/translate',
        method: 'post',
        data: query
    });
};
// 获取标签列表
export const GET_LABEL_LIST = query => {
    return request({
        url: '/support/label/list',
        method: 'get',
        data: query
    });
};
// 新建标签/重命名标签
export const ADD_LABEL = query => {
    return request({
        url: '/support/label/add',
        method: 'post',
        data: query
    });
};
// 重命名标签
export const EDIT_LABEL = query => {
    return request({
        url: '/support/label/edit',
        method: 'post',
        data: query
    });
};
// 删除标签
export const DEL_LABEL = query => {
    return request({
        url: '/support/label/delete',
        method: 'post',
        data: query
    });
};
// 设置会话标签
export const SET_LABEL = query => {
    return request({
        url: '/support/label/sessionLabelSave',
        method: 'post',
        data: query
    });
};
// 获取标签以及标签下的联系人
export const GET_LABEL_SESSION_LIST = query => {
    return request({
        url: '/support/chat/getLabelSessionList',
        method: 'post',
        data: query
    });
};
// 快速回复列表
export const GET_FASTREPLY_LIST = query => {
    return request({
        url: '/support/fastReply/list',
        method: 'get',
        data: query
    });
};
// 添加快速回复语句
export const ADD_FASTREPLY = query => {
    return request({
        url: '/support/fastReply/add',
        method: 'post',
        data: query
    });
};
// 删除快速回复
export const DEL_FASTREPLY = query => {
    return request({
        url: '/support/fastReply/delete',
        method: 'post',
        data: query
    });
};
// 获取无效会话列表
export const GET_EXPIRESESSIONLIST = query => {
    return request({
        url: '/support/session/getExpireSessionList',
        method: 'post',
        data: query
    });
};

// 撤回消息
export const RECALLMESSAGE = query => {
    return request({
        url: '/support/session/recallMessage',
        method: 'post',
        data: query
    });
};