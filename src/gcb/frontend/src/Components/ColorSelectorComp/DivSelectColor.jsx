import React, { useState } from 'react'
import { SketchPicker } from 'react-color'

const DivSelectColor = ({ color, onChangeColorState }) => {
  const [open, setOpen] = useState(false)

  const styles = {
    swatch: {
      padding: '5px',
      background: '#fff',
      borderRadius: '4px',
      cursor: 'pointer',
      display: 'inline-block',
    },
    color: {
      width: '36px',
      height: '14px',
      borderRadius: '2px',
      background: color, // já é HEX direto
    },
    popover: {
      position: 'absolute',
      zIndex: 2,
    },
    cover: {
      position: 'fixed',
      inset: 0,
    },
  }

  return (
    <div>
      <div style={styles.swatch} onClick={() => setOpen(!open)}>
        <div style={styles.color} />
      </div>

      {open && (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={() => setOpen(false)} />
          <SketchPicker
            color={color}
            onChange={(c) => {
              console.log(" onChangeColorState: ", onChangeColorState)
              onChangeColorState(c.hex)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default DivSelectColor;