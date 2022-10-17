import * as React from 'react'
import { hot } from 'react-hot-loader'

import './App.css'
import { EyeDropper, OnChangeEyedrop, useEyeDrop } from 'react-eyedrop'
import { ChangeEvent, useEffect } from 'react'
const { useState } = React

type StateType = {
  image: File | null,
  pickedColor: {
    rgb: string,
    hex: string
  },
  eyedropOnce: boolean
}

const App = () => {
  const [state, setState] = useState<StateType>({
    image: null,
    pickedColor: {
      rgb: '',
      hex: ''
    },
    eyedropOnce: true
  })
  const { image, eyedropOnce } = state
  const [ colors, pickColor, cancelPickColor ] = useEyeDrop({
    once: eyedropOnce
  })

  const handleChangeColor = ({ rgb, hex }: OnChangeEyedrop) => {
    setState({ ...state, pickedColor: { rgb, hex } })
  }

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    if(!e.currentTarget.files) return
    const image = (e.currentTarget.files as FileList)[0]

    if (image.type && image.type.includes('image')) {
      setState({ ...state, image })
    }
  }

  const renderImage = () => (
    <div className="uploaded-image-wrapper">
      <img
        src={URL.createObjectURL(state.image as File)} />
    </div>
  )

  const toggleOnce = () => {
    setState({ ...state, eyedropOnce: !state.eyedropOnce })
  }

  useEffect(() => {
    setState({ ...state, pickedColor: colors })
  }, [colors])

  const { rgb, hex } = state.pickedColor
  return (
    <div className="image-eyedropper-mode-wrapper">
      <div className="upload-image">
        {image ? (
          <div className="eyedrop-wrapper">
            <EyeDropper once={eyedropOnce} onChange={handleChangeColor}>Pick Color</EyeDropper>
            <button onClick={pickColor}>Pick Color With Hook</button>
            <p>Once: {eyedropOnce.toString()}</p>
            <button onClick={toggleOnce}>Toggle `once` prop</button>
            <div style={{ backgroundColor: rgb }} className="eyedrop-color" />
            <p style={{color: 'rgb(123, 155, 22)'}}>RGB</p>
            <p>{rgb}</p>
            <p style={{color: 'rgb(123, 155, 22)'}}>HEX</p>
            <p>{hex}</p>
          </div>
        ) : null}
        {image ? (
          renderImage()
        ) : (
          <div className="image-upload-wrapper">
            <h1>Click to upload image!</h1>
            <input className="image-upload-field" type="file" onChange={handleImage} />
          </div>
        )}
      </div>
    </div>
  )
}

export default hot(module)(App)
