import { line as d3Line } from 'd3-shape'
import { select as d3Select } from 'd3-selection'

export default function annotations (options) {
  let annotations
  const xScale = options.owner.meta.xScale
  const yScale = options.owner.meta.yScale

  const line = d3Line()
    .x(function (d) { return d[0] })
    .y(function (d) { return d[1] })

  annotations = function (parentSelection) {
    parentSelection.each(function () {
      // join
      const current = d3Select(this)
      const selection = current.selectAll('g.annotations')
        .data(function (d) { return d.annotations || [] })

      // enter
      selection.enter()
        .append('g')
        .attr('class', 'annotations')

      // enter + update
      // - path
      const yRange = yScale.range()
      const xRange = xScale.range()
      const path = selection.selectAll('path')
        .data(function (d) {
          if (d.hasOwnProperty('x')) {
            return [ [[0, yRange[0]], [0, yRange[1]]] ]
          } else {
            return [ [[xRange[0], 0], [xRange[1], 0]] ]
          }
        })
      path.enter()
        .append('path')
        .attr('stroke', '#eee')
        .attr('d', line)
      path.exit().remove()

      // enter + update
      // - text
      const text = selection.selectAll('text')
        .data(function (d) {
          return [{
            text: d.text || '',
            hasX: d.hasOwnProperty('x')
          }]
        })
      text.enter()
        .append('text')
        .attr('y', function (d) {
          return d.hasX ? 3 : 0
        })
        .attr('x', function (d) {
          return d.hasX ? 0 : 3
        })
        .attr('dy', function (d) {
          return d.hasX ? 5 : -5
        })
        .attr('text-anchor', function (d) {
          return d.hasX ? 'end' : ''
        })
        .attr('transform', function (d) {
          return d.hasX ? 'rotate(-90)' : ''
        })
        .text(function (d) { return d.text })
      text.exit().remove()

      // enter + update
      // move group
      selection
        .attr('transform', function (d) {
          if (d.hasOwnProperty('x')) {
            return 'translate(' + xScale(d.x) + ', 0)'
          } else {
            return 'translate(0, ' + yScale(d.y) + ')'
          }
        })

      // exit
      selection.exit()
        .remove()
    })
  }

  return annotations
}
