Date.prototype.toUTC = function(){
    var s = this,
        year = s.getFullYear(),
        month = s.getMonth(),
        date = s.getDate();
    return Date.UTC(year, month, date);
};
CS.chart = (function () {
    var chart = {};
    chart.workHours = function (renderTo, data) {
        return new Highcharts.Chart({
            chart:{
                renderTo:renderTo,
                type:'line',
                marginRight:130,
                marginBottom:25
            },
            title:{
                text:'Work hours',
                x:-20 //center
            },
            subtitle:{
                text:'Sprint work hours',
                x:-20
            },
            xAxis:{
                type:'datetime',
                maxZoom:14 * 24 * 3600000, // fourteen days
                title:{
                    text:null
                }
            },
            yAxis:{
                title:{
                    text:'hour'
                },
                showFirstLabel:false
            },
            tooltip:{
                shared:true
            },
            legend:{
                layout:'vertical',
                align:'right',
                verticalAlign:'top',
                x:-10,
                y:100,
                borderWidth:0
            },
            series:[
                {
                    type:'area',
                    name:'work hours',
                    pointInterval:24 * 3600 * 1000,
                    pointStart: data[0],
                    data:data
                }
            ]
        });
    };

    return chart;
})();