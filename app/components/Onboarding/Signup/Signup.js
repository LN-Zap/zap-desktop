import React from 'react'
import PropTypes from 'prop-types'
import FaCircle from 'react-icons/lib/fa/circle'
import FaCircleThin from 'react-icons/lib/fa/circle-thin'
import styles from './Signup.scss'

const Signup = ({ signupForm, setSignupCreate, setSignupImport }) => (
  <div className={styles.container}>
    <section className={`${styles.enable} ${signupForm.create ? styles.active : undefined}`}>
      <div onClick={setSignupCreate}>
        {signupForm.create ? <FaCircle /> : <FaCircleThin />}
        <span className={styles.label}>Create new wallet</span>
      </div>
    </section>
    <section className={`${styles.disable} ${signupForm.import ? styles.active : undefined}`}>
      <div onClick={setSignupImport}>
        {signupForm.import ? <FaCircle /> : <FaCircleThin />}
        <span className={styles.label}>Import existing wallet</span>
      </div>
    </section>
  </div>
)

Signup.propTypes = {
  signupForm: PropTypes.object.isRequired,
  setSignupCreate: PropTypes.func.isRequired,
  setSignupImport: PropTypes.func.isRequired
}

export default Signup
