import React from 'react'
import { shallow, mount } from 'enzyme'
import { EyeDropper } from '../src'
import rgbToHex from '../src/rgbToHex'

describe('React-EyeDrop should', () => {
  it('render', () => {
    const wrapper = shallow(<EyeDropper />)
    expect(wrapper).toMatchSnapshot()
  })

  it('return colors to given callback', () => {
    const onChangeSpy = jest.fn()
    const wrapper = shallow(<EyeDropper onChange={onChangeSpy} />)
    wrapper.setColors({ r: 0, g: 0, b: 0 })
    expect(onChangeSpy).toHaveBeenCalledTimes(1)
    expect(onChangeSpy).toHaveBeenCalledWith({
      rgb: `rgb(0, 0, 0)`,
      hex: '#000000'
    })
  })

  it('use custom button component when given', () => {
    const customButton = ({onClick}) => <div className='custom-btn' onClick={onClick} style={{backgroundColor: 'red'}}>OMEGA BUTTON</div>
    const wrapper = shallow(<EyeDropper customComponent={customButton} />)
    expect(wrapper.children().html()).toEqual("<div class=\"custom-btn\" style=\"background-color:red\">OMEGA BUTTON</div>")
  })

  it('pass down colors to custom button component if given prop', () => {
    const customButton = ({ colorObject: { rgb } }) => (
      <div className='custom-btn' style={{backgroundColor: rgb ? rgb : 'red'}}>OMEGA BUTTON</div>
    )
    const wrapper = shallow(<EyeDropper onChange={() => {}} customComponent={customButton} passThrough={'colorObject'} />)
    expect(wrapper.children().html()).toEqual("<div class=\"custom-btn\" style=\"background-color:red\">OMEGA BUTTON</div>")
    wrapper.setColors({ r: 0, g: 0, b: 0 })
    expect(wrapper.children().html()).toEqual("<div class=\"custom-btn\" style=\"background-color:rgb(0, 0, 0)\">OMEGA BUTTON</div>")
  })

  describe('set given classes:', () => {
    it('wrapper classes', () => {
      const wrapper = shallow(<EyeDropper wrapperClasses="super-wrapper-class" />)
      expect(wrapper.find('div.super-wrapper-class').length).toBe(1)
    })
    it('button classes', () => {
      const wrapper = shallow(<EyeDropper buttonClasses="mega-button-class" />)
      expect(wrapper.find('button.mega-button-class').length).toBe(1)
    })
  })

  describe('replace default value when given prop:', () => {
    it('once', () => {
      let wrapper = shallow(<EyeDropper />)
      expect(wrapper.once).toBe(true)
      wrapper = shallow(<EyeDropper once={false} />)
      expect(wrapper.once).toBe(false)
    })
    it('cursorActive', () => {
      let wrapper = shallow(<EyeDropper />)
      expect(wrapper.cursorActive).toBe('copy')
      wrapper = shallow(<EyeDropper cursorActive='cursor' />)
      expect(wrapper.cursorActive).toBe('cursor')
    })
    it('cursorInactive', () => {
      let wrapper = shallow(<EyeDropper />)
      expect(wrapper.cursorInactive).toBe('auto')
      wrapper = shallow(<EyeDropper cursorInactive={'copy'} />)
      expect(wrapper.cursorInactive).toBe('copy')
    })
  })

  describe('call given callback when the time is right:', () => {
    it('onInit', () => {
      const onInitSpy = jest.fn()
      mount(<EyeDropper onInit={onInitSpy} />)
      expect(onInitSpy).toHaveBeenCalledTimes(1)
    })
    it('onPickStart', () => {
      const onPickStartSpy = jest.fn()
      const wrapper = mount(<EyeDropper onPickStart={onPickStartSpy} />)
      expect(onPickStartSpy).toHaveBeenCalledTimes(0)
      wrapper.find('#react-eyedrop-button').simulate('click')
      expect(onPickStartSpy).toHaveBeenCalledTimes(1)
    })
  })
})

describe('rgbToHex should', () => {
  it('convert RGB color to HEX color', () => {
    const whiteRGB = { r: 255, g: 255, b: 255 }
    const { r, g, b } = whiteRGB

    const whiteHEX = rgbToHex(r, g, b)

    expect(whiteHEX).toBe('#ffffff')
  })
})