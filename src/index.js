import React from 'react'
import { render } from 'react-dom'
import DualSlider from './lib/dual-slider'

class Example extends React.Component {
  render () {
    return (
      <div style={{marginTop: '100px', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'}}>
        <div>
          <DualSlider
            min={0}
            max={100}
            values={[5, 15]}
            onChange={(values) => { console.log(values) }}
            trackRangeColor='#39ff14'
            quickLinks={[{name: 'foo', values: [1, 19]}, {name: 'bar', values: [81, 99]}]}
          />
        </div>

      </div>
    )
  }
}

const container = document.createElement('div')
document.body.appendChild(container)
render(<Example />, container)
