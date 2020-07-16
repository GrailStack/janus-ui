export const ApplyStatusEnum = {
    AUDITED: 'AUDITED',
    REJECTED: 'REJECTED',
    CANCELED: "CANCELED",
    WAIT_AUDIT: "WAIT_AUDIT",
    RELEASING: 'RELEASING',
    RELEASED: "RELEASED"
}
// 发布 全量、灰度
export const PublishTypeEnum = {
    GRAY: 'GRAY',
    FULL: 'FULL',
}
// 下发状态
export const PublishItemStatusEnum = {
    WAIT_PULL: "WAIT_PULL",// "待拉出"),==>显示拉出
    PULLING: "PULLING", //"拉出中"),
    PULL_FAILED: "PULL_FAILED", //"拉出成功"), ==>显示拉出
    PULL_SUCCESS: "PULL_SUCCESS", //"拉出失败"),

    WAIT_RELEASE: "WAIT_RELEASE",// "待下发"),==>显示下发
    RELEASING: "RELEASING", //"下发中"),
    RELEASE_FAIL: "RELEASE_FAIL", //"下发失败");==>显示下发
    RELEASE_SUCCESS: "RELEASE_SUCCESS", //"下发成功");

    COMPLETED: 'COMPLETED'
}
//结束下发到服务器 igore
export const OverPublishEnum = {
    COMPLETED: 'COMPLETED',
    IGNORED: 'IGNORED'
}
