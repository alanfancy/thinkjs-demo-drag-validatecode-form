module.exports = [
    ['/',"index"],//首页
    ["/movies/:type","index/lists"],//name=1 电影列表
    ["/player","movies/player"],//电影播放 播放器
    ["/sale","sale/sale"],//照片列表
    ["/album","photos/album"],//照片预览 相册
    ["/games/:type","index/lists"],//name=2 游戏列表
    ["/hall/:id","games/hall"],//游戏 大厅
    ["/duudle","games/duudle"],//游戏开始 （你画我猜）
    ["/system","system/system"],//设置
    ["/search","index/search"],//搜索页
    ["/result","search/result"],//搜索结果而

    ["/login/:state","login/login"],
    ["/loginvalidate","login/loginvalidate"],

    ["/admin","admin/index"],
    ["/manage/:state","admin/manage"],
    ["/manageform","admin/manageform"],
    ["/formupload","admin/formupload"],///表单上传
    ["/loadfiles","admin/loadfiles"],///加载文件列表
    ["/addfiles","admin/addfiles"],////上传文件
    ["/deletefile","admin/deletefile"],//删除文件
    [/\/user\/(\w+)(?:\/(\d+))?/, 'user/:1?id=:2', 'rest'],//restful
    [/\/user(?:\/(\d+))?/, 'user?id=:1', 'rest'],//restful
    [/\/user(?:\/(\d+))?/, 'user?id=:1', 'rest'],//restful

    ["/error/:state","error/error"],
];
