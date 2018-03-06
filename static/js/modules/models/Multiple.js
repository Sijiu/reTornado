define(function (require, module, exports) {
    return {
        //提取审批倍数
        Multiple: function (data) {
            console.log("data:", data)
            // cpu 20C    内存 40G    带宽 20M   试用时长 1个月  (云公司审批条件)
            var cpu_total = 0;
            var memory_total = 0;
            var bw_total = 0;
            var cycle_total = 0;
            var sale_priceTotal = 0;
            var standard_priceTotal = 0;
            for (var i = 0; i < data.length; i++) {
                // 试用
                var data_Single_count = Number(data[i].count);
                if (data[i].resource_type == "vm") {
                    var data_Single_str = data[i].business_order_item_config
                    var data_Single = eval("(" + data_Single_str + ")");
                    if (data_Single.cpu) {
                        cpu_total += parseFloat(data_Single.cpu) * data_Single_count;
                    }
                    if (data_Single.memory) {
                        memory_total += parseFloat(data_Single.memory) * data_Single_count;
                    }
                    if (data_Single.bw) {
                        bw_total += parseFloat(data_Single.bw) * data_Single_count;
                    }
                    if (data_Single.cycleType == "day") {   // 订购周期 天
                        cycle_total += parseFloat(data_Single.cycleCnt) / 30;
                    } else if (data_Single.cycleType == "week") { // 订购周期 周
                        cycle_total += (parseFloat(data_Single.cycleCnt) * 7) / 30;
                    } else if (data_Single.cycleType == "month") { // 订购周期 月
                        cycle_total += parseFloat(data_Single.cycleCnt);
                    } else if (data_Single.cycleType == "year") { // 订购周期 年
                        cycle_total += parseFloat(data_Single.cycleCnt) * 12;
                    }
                }
                if (data[i].resource_type == "network") {
                    var data_Single_str2 = data[i].business_order_item_config
                    var data_Single_network = eval("(" + data_Single_str2 + ")");
                    if (data_Single_network.bw) {
                        bw_total += parseFloat(data_Single_network.bw) * data_Single_count;
                    }
                    if (data_Single_network.cycleType == "day") {   // 订购周期 天
                        cycle_total += ((parseFloat(data_Single_network.cycleCnt)) / 30);
                    } else if (data_Single_network.cycleType == "week") { // 订购周期 周
                        cycle_total += ((parseFloat(data_Single_network.cycleCnt) * 7) / 30);
                    } else if (data_Single_network.cycleType == "month") { // 订购周期 月
                        cycle_total += parseFloat(data_Single_network.cycleCnt);
                    } else if (data_Single_network.cycleType == "year") { // 订购周期 年
                        cycle_total += parseFloat(data_Single_network.cycleCnt) * 12;
                    }
                }

                // 商用
                sale_priceTotal += parseFloat(data[i].sale_price)
                standard_priceTotal += parseFloat(data[i].standard_price)
            }

            // 算倍数 试用
            var cpu_Multiple = (cpu_total / 20).toFixed(2);
            var memory_Multiple = (memory_total / 40).toFixed(2);
            var bw_Multiple = (bw_total / 20).toFixed(2);
            var cycle_Multiple = (cycle_total).toFixed(2);
            var max_Multiple = Math.max(cpu_Multiple, memory_Multiple, bw_Multiple, cycle_Multiple);

            // 算倍数 商用
            var Busin_totalMultiple = (sale_priceTotal / standard_priceTotal).toFixed(4);

            var infos = {
                "cpu_total": cpu_total,
                "memory_total": memory_total,
                "bw_total": bw_total,
                "cycle_total": cycle_total,
                "cpu_Multiple": cpu_Multiple,
                "memory_Multiple": memory_Multiple,
                "bw_Multiple": bw_Multiple,
                "cycle_Multiple": cycle_Multiple,
                "max_Multiple": max_Multiple,
                "Busin_totalMultiple": Busin_totalMultiple,
            }
            return infos
        },
    }
})