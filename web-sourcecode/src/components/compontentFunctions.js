/* eslint-disable no-console */
export default {
    getCounts: function(countsarray, location, parens=true) {
        var currentcount = "";
        if (countsarray){
            var allcounts = !location ? countsarray['counts'] : countsarray['counts'].filter(element => element.location == location);
            const zerocountssort = allcounts.reduce(function(total, objitem) {
                objitem.number != 0 ? total['nonzerocounts'].push(objitem) : total['zerocounts'].push(objitem)
                return total
            }, {'zerocounts': [], 'nonzerocounts': []})
            var zerocounts = zerocountssort['zerocounts'].length;
            var nonzerocounts = zerocountssort['nonzerocounts'];
            if (nonzerocounts.length > 0){
                var computecounts = nonzerocounts.reduce(function(total, elem){
                    return total + elem['number']
                }, 0);
                currentcount = computecounts;
            } else if (zerocounts > 0){
                if (location){
                    currentcount = 0;
                } else if (!location) {
                    currentcount = currentcount != '' ? currentcount + zerocounts : zerocounts;
                }
            }
        } 
        return parens && currentcount !== '' ? ` (${currentcount}) ` : currentcount;
    }
}