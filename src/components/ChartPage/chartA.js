import React from 'react';
import styles from './styles1.scss';
import Renderer from './renderer.js'

const One = () => {
  return (
    <Renderer styles={styles} />
  )
}

export default One;
