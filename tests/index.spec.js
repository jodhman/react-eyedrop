import React from 'react'
import { shallow, mount } from 'enzyme'
import App from '../src'
import rgbToHex from '../src/rgbToHex'

/**
 * passThrough
 * buttonComponent
 */

describe('React-EyeDrop should', () => {
  it('render', () => {
    const wrapper = shallow(<App />)
    expect(wrapper).toMatchSnapshot()
  })

  it('return colors to given callback', () => {
    const onChangeSpy = jest.fn()
    const instance = shallow(<App onChange={onChangeSpy} />).instance()
    instance.setColors({ r: 0, g: 0, b: 0 })
    expect(onChangeSpy).toHaveBeenCalledTimes(1)
    expect(onChangeSpy).toHaveBeenCalledWith({
      rgb: `rgb(0, 0, 0)`,
      hex: '#000000'
    })
  })

  it('use custom button component when given', () => {
    const customButton = () => <div className='custom-btn' style={{backgroundColor: 'red'}}>OMEGA BUTTON</div>
    const wrapper = shallow(<App buttonComponent={customButton} />)
    expect(wrapper.children().html()).toEqual("<div class=\"custom-btn\" style=\"background-color:red\">OMEGA BUTTON</div>")
  })

  it('pass down colors to custom button component if given prop', () => {
    const customButton = ({ colorObject: { rgb } }) => (
      <div className='custom-btn' style={{backgroundColor: rgb ? rgb : 'red'}}>OMEGA BUTTON</div>
    )
    const wrapper = shallow(<App onChange={() => {}} buttonComponent={customButton} passThrough={'colorObject'} />)
    expect(wrapper.children().html()).toEqual("<div class=\"custom-btn\" style=\"background-color:red\">OMEGA BUTTON</div>")
    wrapper.instance().setColors({ r: 0, g: 0, b: 0 })
    expect(wrapper.children().html()).toEqual("<div class=\"custom-btn\" style=\"background-color:rgb(0, 0, 0)\">OMEGA BUTTON</div>")
  })

  describe('set given classes:', () => {
    it('wrapper classes', () => {
      const wrapper = shallow(<App wrapperClasses="super-wrapper-class" />)
      expect(wrapper.find('div.super-wrapper-class').length).toBe(1)
    })
    it('button classes', () => {
      const wrapper = shallow(<App buttonClasses="mega-button-class" />)
      expect(wrapper.find('button.mega-button-class').length).toBe(1)
    })
  })

  describe('replace default value when given prop:', () => {
    it('once', () => {
      let instance = shallow(<App />).instance()
      expect(instance.once).toBe(true)
      instance = shallow(<App once={false} />).instance()
      expect(instance.once).toBe(false)
    })
    it('cursorActive', () => {
      let instance = shallow(<App />).instance()
      expect(instance.cursorActive).toBe('copy')
      instance = shallow(<App cursorActive='cursor' />).instance()
      expect(instance.cursorActive).toBe('cursor')
    })
    it('cursorInactive', () => {
      let instance = shallow(<App />).instance()
      expect(instance.cursorInactive).toBe('auto')
      instance = shallow(<App cursorInactive={'copy'} />).instance()
      expect(instance.cursorInactive).toBe('copy')
    })
  })

  describe('call given callback when the time is right:', () => {
    it('onInit', () => {
      const onInitSpy = jest.fn()
      const wrapper = shallow(<App onInit={onInitSpy} />)
      expect(onInitSpy).toHaveBeenCalledTimes(1)
    })
    it('onPickStart', () => {
      const onPickStartSpy = jest.fn()
      const instance = shallow(<App onPickStart={onPickStartSpy} />).instance()
      expect(onPickStartSpy).toHaveBeenCalledTimes(0)
      instance.pickColor()
      expect(onPickStartSpy).toHaveBeenCalledTimes(1)
    })
    it('onPickEnd', () => {
      const onPickEndSpy = jest.fn()
      const instance = shallow(<App onChange={() => {}} onPickEnd={onPickEndSpy} passThrough='hi' />).instance()
      expect(onPickEndSpy).toHaveBeenCalledTimes(0)
      instance.setColors({ r: 0, g: 255, b: 0 })
      expect(onPickEndSpy).toHaveBeenCalledTimes(1)
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