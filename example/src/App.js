import React from 'react'
import { hot } from 'react-hot-loader'

import './App.css'
import { EyeDropper } from './eyedrop'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      image: false,
      pickedColor: {
        rgb: '',
        hex: ''
      },
      eyedropOnce: true
    }
  }
  
  handleChangeColor = ({ rgb, hex }) => {
    this.setState({ pickedColor: { rgb, hex } })
  }

  handleImage = ({ target }) => {
    const image = target.files[0]

    if (image.type && image.type.includes('image')) {
      this.setState({ image })
    }
  }

  renderImage = () => (
    <div className="uploaded-image-wrapper">
      <img
        src={URL.createObjectURL(this.state.image)} />
    </div>
  )

  toggleOnce = () => {
    this.setState({ eyedropOnce: !this.state.eyedropOnce })
  }

  render() {
    const { image, eyedropOnce } = this.state
    const { rgb, hex } = this.state.pickedColor
    return (
      <div className="image-eyedropper-mode-wrapper">
        <div className="upload-image">
          {image ? (
            <div className="eyedrop-wrapper">
              <EyeDropper once={eyedropOnce} onChange={this.handleChangeColor}>Pick Color</EyeDropper>
              <p>Once: {eyedropOnce.toString()}</p>
              <button onClick={this.toggleOnce}>Toggle `once` prop</button>
              <div style={{ backgroundColor: rgb }} className="eyedrop-color" />
              <p style={{color: 'rgb(123, 155, 22)'}}>RGB</p>
              <p>{rgb}</p>
              <p style={{color: 'rgb(123, 155, 22)'}}>HEX</p>
              <p>{hex}</p>
            </div>
          ) : null}
          {image ? (
            this.renderImage()
          ) : (
            <div className="image-upload-wrapper">
              <h1>Click to upload image!</h1>
              <input className="image-upload-field" type="file" onChange={this.handleImage} />
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default hot(module)(App)