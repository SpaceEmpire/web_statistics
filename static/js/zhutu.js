/**
 * 柱状图
 */
function loadZhuZhuangTu(title, data1, data2) {
    var myChart = echarts.init(document.getElementById('zhuzhuangtu'));
    // 指定图表的配置项和数据
    option = {
        color: ['#3398DB'],
        title: {
            text: title
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: data1,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '直接访问',
                type: 'bar',
                barWidth: '60%',
                data: data2
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

/**
 * 折线图
 */
function loadZhexianTu(title, data1, data2, data3) {

    var myChart2 = echarts.init(document.getElementById('zhexiantu'));
    // 指定图表的配置项和数据
    option2 = {
        title: {
            text: title
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['PV', 'UV']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data1
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'PV',
                type: 'line',
                stack: '总量',
                data: data2
            },
            {
                name: 'UV',
                type: 'line',
                stack: '总量',
                data: data3
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart2.setOption(option2);
}

$("input[name='options']").click(function () {
    var channel = this.value;
    $("#zhuzhuangtu").html('<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>');
    $(".main-foot").show();
    $.ajax({
        url: "/mhcensus/zhuZhuangTu",
        type: 'get',
        data: {
            channel: channel
        },
        dataType: "json",
        success: function (data) {
            if (data.status == 200) {
                var data1 = new Array();
                var data2 = new Array();
                for (var i = data.result.length - 1; i > -1; i--) {
                    data1.push(data.result[i]['_id']);
                    data2.push(data.result[i]['count']);
                }
                loadZhuZhuangTu(channel + "渠道柱状图堆叠", data1, data2);
            } else {
                loadZhuZhuangTu(channel + "渠道柱状图堆叠", [], []);
            }
        }
    });

    $("#zhexiantu").html('<div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>');
    $.ajax({
        url: "/mhcensus/zheXianTu",
        type: 'get',
        data: {
            channel: channel
        },
        dataType: "json",
        success: function (data) {
            if (data.status == 200) {
                loadZhexianTu(channel + "渠道折线图堆叠", data.dateArr, data.pvDataArr, data.uvDataArr);
            } else {
                loadZhexianTu(channel + "渠道折线图堆叠", [], [], []);
            }
        }
    });
});

function del(channel) {
    $("#my-confirm>.am-modal-dialog>.am-modal-hd").html(channel);
    $("#my-confirm").modal('open');
}

$("#confirmBtn").click(function () {
    var channel = $("#my-confirm>.am-modal-dialog>.am-modal-hd").html();
    $.ajax({
        url: "/mhcensus/remove",
        type: 'POST',
        data: {
            channel: channel
        },
        dataType: "json",
        success: function (data) {
            if (data.status == 200) {
                $("#recordsTr" + channel).hide();
            } else {

            }
        }
    });
});

/**
 * 统计pv
 * @param channel
 */
function getPvRecordsCount(channel) {
    $.ajax({
        url: "/mhcensus/PvCount",
        type: 'GET',
        data: {
            channel: channel
        },
        dataType: "json",
        success: function (data) {
            if (data.status == 200) {
                if ($("#PVCount" + data.channel).html() != data.PvCount) {
                    $("#PVCount" + data.channel).animate({height: 'toggle', opacity: 'toggle'}, "slow");
                    $("#PVCount" + data.channel).html(data.PvCount);
                    $("#PVCount" + data.channel).animate({opacity: 'show'});
                }
            } else {
                $("#PVCount" + data.channel).html(data.PvCount);
            }
        }
    });
};

/**
 * 统计uv
 * @param channel
 */
function getUVRecordsCount(channel) {
    $.ajax({
        url: "/mhcensus/UvCount",
        type: 'GET',
        data: {
            channel: channel
        },
        dataType: "json",
        success: function (data) {
            if (data.status == 200) {
                if ($("#UVCount" + data.channel).html() != data.UvCount) {
                    $("#UVCount" + data.channel).animate({height: 'toggle', opacity: 'toggle'});
                    $("#UVCount" + data.channel).html(data.UvCount);
                    $("#UVCount" + data.channel).animate({opacity: 'show'});
                }
            } else {
                $("#UVCount" + data.channel).html(data.UvCount);
            }
        }
    });
};

setInterval(function () {
    $(".records").each(function (index, obj) {
        getPvRecordsCount($(obj).attr("data-value"));
        getUVRecordsCount($(obj).attr("data-value"));
    });
}, 5000);

$(function () {
    /**
     * init
     */
    $(".records").each(function (index, obj) {
        getPvRecordsCount($(obj).attr("data-value"));
        getUVRecordsCount($(obj).attr("data-value"));
    });
});

