import { shell } from 'electron'
import React from 'react'
import PropTypes from 'prop-types'
import Isvg from 'react-inlinesvg'
import MdNavigateBefore from 'react-icons/lib/md/navigate-before'
import MdNavigateNext from 'react-icons/lib/md/navigate-next'
import zapLogo from 'icons/zap_logo.svg'
import { FormattedMessage } from 'react-intl'
import Button from 'components/UI/Button'
import zapLogoBlack from 'icons/zap_logo_black.svg'
import messages from './messages'
import styles from './FormContainer.scss'

const FormContainer = ({ title, description, back, next, children, theme }) => (
  <div className={styles.container}>
    <div className={styles.titleBar} />
    <header className={styles.header}>
      <section>
        <Isvg src={theme === 'light' ? zapLogoBlack : zapLogo} />
      </section>
      <section>
        <div
          className={styles.help}
          onClick={() =>
            shell.openExternal('https://ln-zap.github.io/zap-tutorials/zap-desktop-getting-started')
          }
        >
          <FormattedMessage {...messages.help} />
        </div>
      </section>
    </header>

    <div className={styles.info}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>

    <div className={styles.content}>{children}</div>

    <footer className={styles.footer}>
      <div className={styles.buttonsContainer}>
        <section>
          {back && (
            <Button onClick={back} bg="transparent" pl="0">
              <MdNavigateBefore size="1.5em" />
              <FormattedMessage {...messages.back} />
            </Button>
          )}
        </section>
        <section>
          {next && (
            <Button onClick={next}>
              <FormattedMessage {...messages.next} />
              <MdNavigateNext size="1.5em" />
            </Button>
          )}
        </section>
      </div>
    </footer>
  </div>
)

FormContainer.propTypes = {
  title: PropTypes.object.isRequired,
  description: PropTypes.object.isRequired,
  theme: PropTypes.string.isRequired,

  back: PropTypes.func,
  next: PropTypes.func,

  children: PropTypes.object.isRequired
}

export default FormContainer
