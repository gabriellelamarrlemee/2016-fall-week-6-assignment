console.log('6.1');

//First, append <svg> element and implement the margin convention
var m = {t:50,r:50,b:50,l:50};
var outerWidth = document.getElementById('canvas').clientWidth,
    outerHeight = document.getElementById('canvas').clientHeight;
var w = outerWidth - m.l - m.r,
    h = outerHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width',outerWidth)
    .attr('height',outerHeight)
    .append('g')
    .attr('transform','translate(' + m.l + ',' + m.t + ')');

//Import data and parse
d3.csv('../data/olympic_medal_count.csv', parse, function(err, rows){
  //console.table(rows);
  //console.log(scaleY.domain());
  //console.log(scaleX.domain());

  var rowsSorted = rows.sort(function(a,b){
    return b.Year2012 - a.Year2012;
  });

  var topFive = rowsSorted.slice(0,5);

  var minY = d3.min(topFive, function(d){ return d.Year2012 }),
      maxY = d3.max(topFive, function(d){ return d.Year2012 });

      console.log(minY,maxY);

  var scaleY = d3.scaleLinear()
      .domain([0,maxY])
      .range([h,0]);
  var scaleX = d3.scaleOrdinal()
      .domain(topFive.map(function(d) { return d.country; }))
      .range(d3.range(40, w, w/5));

  var countries = plot.selectAll('.country')
      .data(topFive)
      .enter()
      .append('g')
      .attr('class', 'country')
      .attr('transform', function(d,i){
        return 'translate(' + scaleX(i) + ' ,0)';
      });

    countries
      .append('rect')
      .attr('x', -20)
      .attr('y', function(d) { return scaleY(d.Year2012) })
      .attr('width', 40)
      .attr('height', function(d) { return h - scaleY(d.Year2012) });

    countries
      .append('text')
      .attr('y', h + 20)
      .attr('text-anchor', 'middle')
      .text(function(d){ return d.country });

    //create the axis function
    var axisY = d3.axisLeft()
        .scale(scaleY)
        .tickSize(-w-100);

    plot.append('g')
        .attr('class','axis')
        .attr('transform', 'translate(-20,0)')
        .call(axisY);

  /*topFive.forEach(function(topFive,i){

      //console.table(topFive);

      plot.append('rect')
        .attr('x', scaleX(i))
        .attr('y', 0 + (h - scaleY(topFive.Year2012)))
        .attr('width', 30)
        .attr('height', scaleY(topFive.Year2012));

    });*/

});

function parse(d){
  return {
    country: d['Country'],
    Year2012: (+d['2012'])?(+d['2012']):undefined
  };

}
