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
                    pointStart:Date.UTC(2006, 0, 1),
                    data:data
                }
            ]
        });
    };

    return chart;
})();