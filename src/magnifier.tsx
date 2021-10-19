import * as React from 'react'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { RgbObj, TargetRef } from './types'

import {
  DEFAULT_MAGNIFIER_SIZE,
  DEFAULT_PIXELATE_VALUE,
  DEFAULT_ZOOM_AMOUNT,
  PIXEL_BOX_MULTIPLIER,
  PIXEL_BOX_OFFSET,
  PIXELATE_THRESHOLD,
  ZOOM_THRESHOLD,
} from './constants/Constants'
import { setUpMagnifier } from './magnifierUtils/setUpMagnifier'
import { pixelateCanvas } from './magnifierUtils/pixelateCanvas'
import { getSyncedPosition } from './magnifierUtils/getSyncedPosition'
import { isDescendant } from './magnifierUtils/isDescendant'
import { isMouseMovingOut } from './magnifierUtils/isMouseMovingOut'
import { getColorFromMousePosition } from './magnifierUtils/getColorFromMousePosition'

interface EyeDropperProps {
  areaSelector?: string;
  pixelateValue?: number;
  magnifierSize?: number;
  zoom?: number;
}

interface MagnifierProps extends EyeDropperProps {
  active: boolean;
  canvas: HTMLCanvasElement | null;
  setColorCallback: (rgbObj: RgbObj) => void
  target: MutableRefObject<TargetRef>;
}

export const Magnifier = (props: MagnifierProps) => {
  const {
    active,
    canvas,
    magnifierSize: size = DEFAULT_MAGNIFIER_SIZE,
    setColorCallback,
    target,
  } = props
  let { pixelateValue = DEFAULT_PIXELATE_VALUE, zoom = DEFAULT_ZOOM_AMOUNT } = props

  zoom = zoom > ZOOM_THRESHOLD ? ZOOM_THRESHOLD : zoom
  pixelateValue = pixelateValue > PIXELATE_THRESHOLD ? PIXELATE_THRESHOLD : pixelateValue
  const pixelBoxSize = PIXEL_BOX_MULTIPLIER * pixelateValue + PIXEL_BOX_OFFSET
  const initialPosition = {
    top: -1 * size,
    left: -1 * size,
  }
  const magnifierRef = useRef<HTMLDivElement>(document.createElement('div'))
  const magnifierContentRef = useRef<HTMLDivElement>(document.createElement('div'))
  const [magnifierPos, setMagnifierPos] = useState({ ...initialPosition })
  const [magnifierContentPos, setMagnifierContentPos] = useState({
    top: 0,
    left: 0,
  })
  const [magnifierContentDimension, setMagnifierContentDimension] = useState({
    width: 0,
    height: 0,
  })
  const [magnifierDisplay, setMagnifierDisplay] = useState('none')

  const prepareContent = () => {
    const magnifier = magnifierRef.current
    const magnifierContent = magnifierContentRef.current
    setUpMagnifier(magnifier, magnifierContent)

    if (!target.current.rect) {
      return
    }
    const {
      height,
      width,
    } = target.current.rect
    setMagnifierContentDimension({ width, height })

    if (canvas) {
      magnifierContent.appendChild(canvas)
      const image = new Image()
      image.src = canvas.toDataURL()
      image.onload = () => pixelateCanvas(image, canvas, pixelateValue)
    }
  }

  const syncViewport = () => {
    const { left, top } = getSyncedPosition(
      magnifierRef.current,
      target.current.rect,
      size,
      zoom
    )
    setMagnifierContentPos({
      top,
      left,
    })
  }

  const syncScroll = (ctrl: any) => {
    const selectors = []
    if (ctrl.getAttribute) {
      ctrl.getAttribute('id') && selectors.push('#' + ctrl.getAttribute('id'))
      if(ctrl.className) {
        selectors.push('.' + ctrl.className.split(' ').join('.'))
      }
      const t = ctrl.ownerDocument.body.querySelectorAll(selectors[0])
      t[0].scrollTop = ctrl.scrollTop
      t[0].scrollLeft = ctrl.scrollLeft
      return true
    } else if (ctrl === document) {
      syncViewport()
    }
    return false
  }

  const syncScrollBars = (e?: Event) => {
    const ownerDocument = magnifierRef.current.ownerDocument
    if (e && e.target) {
      syncScroll(e.target)
    } else {
      const elements = ownerDocument && ownerDocument.querySelectorAll('div')
      const scrolled = Array.prototype.reduce.call(
        elements,
        (acc, element) => {
          element.scrollTop > 0 && acc.push(element)
          return acc
        },
        []
      )

      scrolled.forEach((scrolledElement: any) => {
        !isDescendant(magnifierRef.current, scrolledElement) &&
          syncScroll(scrolledElement)
      })
    }
  }

  const syncContent = () => {
    prepareContent()
    syncViewport()
    syncScrollBars()
  }

  const moveHandler = (e: MouseEvent) => {
    const { clientX, clientY } = e

    if (!isMouseMovingOut(e, target.current.rect)) {
      const left = clientX - size / 2
      const top = clientY - size / 2
      setMagnifierPos({
        top,
        left,
      })
      syncViewport()
    }
  }

  const makeDraggable = () => {
    const dragHandler = magnifierRef.current
    const currentWindow = dragHandler.ownerDocument.defaultView

    currentWindow.addEventListener('mousemove', moveHandler)
    currentWindow.addEventListener('resize', syncContent, false)
    currentWindow.addEventListener('scroll', syncScrollBars, true)
  }

  const getColorFromCanvas = (e: React.MouseEvent<HTMLDivElement>) => {
    const rgbObj = getColorFromMousePosition(
      e,
      magnifierRef.current,
      target.current.rect,
      zoom
    )
    setColorCallback(rgbObj)
    setMagnifierPos({ ...initialPosition })
  }

  useEffect(() => {
    const currentWindow = magnifierRef.current.ownerDocument.defaultView
    if (active && canvas && target.current) {
      prepareContent()
      setMagnifierDisplay('block')
      makeDraggable()
      syncViewport()
      syncScrollBars()
    } else {
      setMagnifierPos({ ...initialPosition })
      setMagnifierDisplay('none')
    }
    return () => {
      currentWindow.removeEventListener('mousemove', moveHandler)
      currentWindow.removeEventListener('resize', syncContent, false)
      currentWindow.removeEventListener('scroll', syncScrollBars, true)
    }
  }, [active, canvas, target])

  return active ? (
    <div
      ref={magnifierRef}
      className="magnifier"
      style={{
        backgroundColor: '#fff',
        border: '2px solid #ccc',
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'fixed',
        zIndex: 100000,
        display: magnifierDisplay,
        height: `${size}px`,
        left: `${magnifierPos.left}px`,
        top: `${magnifierPos.top}px`,
        width: `${size}px`,
      }}
    >
      <div
        ref={magnifierContentRef}
        className="magnifier-content"
        style={{
          display: 'block',
          marginLeft: '0px',
          marginTop: '0px',
          overflow: 'visible',
          paddingTop: '0px',
          position: 'absolute',
          transformOrigin: 'left top',
          userSelect: 'none',
          height: `${magnifierContentDimension.height}px`,
          left: `${magnifierContentPos.left}px`,
          top: `${magnifierContentPos.top}px`,
          transform: `scale(${zoom})`,
          width: `${magnifierContentDimension.width}px`,
        }}
      />
      <div
        onClick={getColorFromCanvas}
        className="magnifier-glass"
        style={{
          alignItems: 'center',
          backgroundImage:
            'linear-gradient(to right, gray 1px, transparent 1px), linear-gradient(to bottom, gray 1px, transparent 1px)',
          backgroundPosition: 'center',
          cursor: 'none',
          display: 'grid',
          height: '100%',
          justifyContent: 'center',
          left: '0px',
          opacity: 1,
          position: 'absolute',
          top: '0px',
          width: '100%',
          backgroundSize: `${pixelBoxSize}px ${pixelBoxSize}px`,
        }}
      >
        <svg
          className="cursor-svg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 12 12"
          width={pixelBoxSize}
          height={pixelBoxSize}
          style={{
            border: '2px solid #fff',
            boxShadow: 'inset 0 0 0 1px #000',
            margin: '0 auto',
            position: 'relative',
          }}
        />
      </div>
    </div>
  ) : (
    <div ref={magnifierRef} />
  )
}
