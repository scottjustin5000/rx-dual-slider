import React from 'react'
import PropTypes from 'prop-types'
import './styles.css'

const sortValues = (a, b) => { return a - b }

export default class DualSlider extends React.Component {
  constructor (props) {
    super(props)
    this.oldX = 0
    this.startX = 0

    const values = props.values.slice().sort(sortValues)

    const size = Math.abs(props.max - props.min)

    values[0] = this.getMinValue(values[0], props.min, props.max)
    values[1] = this.getMaxValue(values[1], props.max, props.min)

    const offsetVals = [values[0] - props.min, values[1] - props.min]
    const positions = [offsetVals[0] / size * 100, offsetVals[1] / size * 100]

    const range = positions.slice().sort(sortValues)
    range[1] = 100 - range[1]

    let handleOnePos = positions[0]
    let handleTwoPos = positions[1]
    if (Math.round(positions[0] - 1) >= Math.round(positions[1])) {
      handleOnePos = positions[1]
    }
    if (Math.round(positions[1]) <= Math.round(positions[0])) {
      handleTwoPos = positions[0]
    }
    this.state = {
      min: props.min,
      max: props.max,
      size: size,
      values: values,
      selectionDown: false,
      selectedHandle: 0,
      startValue: 0,
      currentValue: 0,
      boxWidth: 0,
      rangeLeft: range[0] + '%',
      rangeRight: range[1] + '%',
      rangeColor: props.rangeColor,
      handleOnePos: handleOnePos + '%',
      handleTwoPos: handleTwoPos + '%',
      tipDisplay: 'none',
      selectedRange: []
    }

    this.onMouseDown = this.onMouseDown.bind(this)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onSliderClick = this.onSliderClick.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.quickLink = this.quickLink.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
  }

  getMinValue (val, min, max) {
    if (val < min) {
      return min
    } else if (val > max) {
      return max
    } else {
      return val
    }
  }

  getMaxValue (val, max, min) {
    if (val > max) {
      return max
    } else if (val < min) {
      return min
    } else {
      return val
    }
  }

  getCurrentValue (currentX, width) {
    const proportion = (currentX - this.startX) / width
    const limit = this.state.size * proportion
    let value = this.state.startValue + limit
    if (value < this.state.min) {
      return this.state.min
    } else if (value > this.state.max) {
      return this.state.max
    }
    return value
  }

  onSliderClick (e) {
    if (this.state.selectionDown) return

    const cursorX = e.pageX

    const values = this.state.values.map((v) => { return v })
    const newValue = this.getCurrentValue(cursorX, e.currentTarget.parentElement.offsetWidth)
    const mod = [values[0] - newValue, newValue - values[1]]

    const index = mod.findIndex((e) => { return e > 0 })
    values[index] = this.getCurrentValue(cursorX, e.currentTarget.parentElement.offsetWidth)

    const size = this.state.size

    const offsetVals = [values[0] - this.state.min, values[1] - this.state.min]
    const positions = [offsetVals[0] / size * 100, offsetVals[1] / size * 100]
    const handleOnePos = positions[0]
    const handleTwoPos = positions[1]

    const range = positions.slice().sort(sortValues)
    range[1] = 100 - range[1]

    this.setState({
      values,
      currentValue: this.getCurrentValue(cursorX, this.state.boxWidth),
      rangeLeft: range[0] + '%',
      rangeRight: range[1] + '%',
      handleOnePos: handleOnePos + '%',
      handleTwoPos: handleTwoPos + '%'
    })
  }

  beginDrag (event, index) {
    this.startX = event.touches && event.touches.length > 0 ? event.touches[0].clientX : event.clientX
    this.setState({
      selectionDown: true,
      tipDisplay: 'block',
      selectedHandle: index,
      startValue: this.state.values[index],
      currentValue: this.state.values[index],
      boxWidth: event.currentTarget.parentElement.offsetWidth
    })
    event.stopPropagation()
  }

  onMouseDown (event, index) {
    event.stopPropagation()
    this.beginDrag(event, index)
  }

  onTouchMove (event) {
    this.dragging(event)
  }

  onTouchEnd (event, index) {
    this.beginDrag(event, index)
  }

  onTouchStart (event, index) {
    this.beginDrag(event, index)
  }

  onMouseMove (event) {
    this.dragging(event)
  }

  dragging (event) {
    let direction = ''
    if (event.pageX < this.oldx) {
      direction = 'left'
    } else if (event.pageX > this.oldx) {
      direction = 'right'
    }

    this.oldx = event.pageX

    if (this.state.selectionDown && direction) {
      const values = this.getRoundValues()

      const position = this.getPositions()

      let handleOnePos = position[0]
      let handleTwoPos = position[1]

      const rangePosition = position.slice().sort(sortValues)
      rangePosition[1] = 100 - rangePosition[1]
      const clientX = event.touches && event.touches.length > 0 ? event.touches[0].clientX : event.clientX
      let tt = ''
      let handleOneZ = 1
      let handleTwoZ = 1
      const tip0Display = this.state.selectedHandle === 0 ? 'block' : 'none'
      const tip1Display = this.state.selectedHandle === 1 ? 'block' : 'none'
      tt = values[this.state.selectedHandle]
      this.setState({
        currentX: clientX,
        currentValue: this.getCurrentValue(clientX, this.state.boxWidth),
        rangeLeft: rangePosition[0] + '%',
        rangeRight: rangePosition[1] + '%',
        handleOnePos: handleOnePos + '%',
        handleTwoPos: handleTwoPos + '%',
        tip0Display: tip0Display,
        tip1Display: tip1Display,
        tipText: tt,
        handleOneZ: handleOneZ,
        handleTwoZ: handleTwoZ
      })
    }
  }

  stopDrag (event) {
    if (this.state.selectionDown) {
      let values = this.getValues()

      this.setState({
        values: values,
        selectionDown: false,
        tip0Display: 'none',
        tip1Display: 'none'
      })
      this.onChange()
    }
    event.stopPropagation()
  }

  onMouseLeave (event) {
    this.stopDrag(event)
  }

  onMouseUp (event) {
    this.stopDrag(event)
  }

  getValues () {
    const values = this.state.values.slice()

    if (this.state.selectionDown) {
      values[this.state.selectedHandle] = this.state.currentValue
    }

    return values
  }

  getRoundValues () {
    const values = this.getValues()
    return values.map((v) => { return Math.round(v) })
  }

  getPositions () {
    const values = this.getValues()

    const size = this.state.size

    const offsetVals = [values[0] - this.state.min, values[1] - this.state.min]

    return [offsetVals[0] / size * 100, offsetVals[1] / size * 100]
  }

  quickLink (ql) {
    console.log('hi', ql)

    const values = ql.values.sort(sortValues)

    const size = Math.abs(this.props.max - this.props.min)

    values[0] = this.getMinValue(values[0], this.props.min, this.props.max)
    values[1] = this.getMaxValue(values[1], this.props.max, this.props.min)

    const offsetVals = [values[0] - this.props.min, values[1] - this.props.min]
    const positions = [offsetVals[0] / size * 100, offsetVals[1] / size * 100]

    const range = positions.slice().sort(sortValues)
    range[1] = 100 - range[1]

    let handleOnePos = positions[0]
    let handleTwoPos = positions[1]
    if (Math.round(positions[0] - 1) >= Math.round(positions[1])) {
      handleOnePos = positions[1]
    }
    if (Math.round(positions[1]) <= Math.round(positions[0])) {
      handleTwoPos = positions[0]
    }

    this.setState({
      values,
      rangeLeft: range[0] + '%',
      rangeRight: range[1] + '%',
      handleOnePos: handleOnePos + '%',
      handleTwoPos: handleTwoPos + '%'
    })
  }

  render () {
    const trackStyle = {
      left: this.state.rangeLeft,
      right: this.state.rangeRight,
      backgroundColor: this.props.trackRangeColor
    }

    const handle0 = {
      left: this.state.handleOnePos,
      zIndex: this.state.handleOneZ
    }

    const handle1 = {
      left: this.state.handleTwoPos,
      zIndex: this.state.handleTwoZ
    }

    const tooltip0 = {
      marginTop: '-15px',
      marginLeft: '-5px',
      display: this.state.tip0Display,
      left: this.state.handleOnePos,
      position: 'absolute'
    }

    const tooltip1 = {
      marginTop: '-15px',
      marginLeft: '-5px',
      display: this.state.tip1Display,
      left: this.state.handleTwoPos,
      position: 'absolute'
    }

    return (
      <div className='container'
        onMouseMove={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
        onMouseUp={this.onMouseUp}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}>

        <div className='sliders'>
          <div className='track' onClick={this.onSliderClick}><div className='range' style={trackStyle} /></div>
          <div className='tip' style={tooltip0}><span>{this.state.tipText}</span></div>
          <div
            className='handle'
            style={handle0}
            onMouseDown={(e) => { this.onMouseDown(e, 0) }}
            onTouchStart={(e) => { this.onTouchStart(e, 0) }}
          >
            <div />
          </div>
          <div className='tip' style={tooltip1}><span>{this.state.tipText}</span></div>

          <div
            className='handle'
            style={handle1}
            onMouseDown={(e) => { this.onMouseDown(e, 1) }}
            onTouchStart={(e) => { this.onTouchStart(e, 1) }}
          >
            <div />
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
          {this.props.quickLinks.map((ql, index) => {
            return (<span className='quick-link' key={`ql_${index}`} onClick={() => { this.quickLink(ql) }}>{ql.name}</span>)
          })}
        </div>
      </div>
    )
  }
}

DualSlider.propTypes = {
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  rangeColor: PropTypes.string,
  values: PropTypes.arrayOf(PropTypes.number),
  quickLinks: PropTypes.array

}

DualSlider.defaultProps = {
  min: 0,
  max: 100,
  values: [0, 100],
  onChange: function () {},
  trackRangeColor: '#39ff14',
  quickLinks: []
}
