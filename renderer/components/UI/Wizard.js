/* eslint-disable react/no-multi-comp */
import React, { createContext, useRef, useCallback } from 'react'

import PropTypes from 'prop-types'
import { Transition, config } from 'react-spring/renderprops.cjs'
import { Box, Flex } from 'rebass/styled-components'

import ArrowLeft from 'components/Icon/ArrowLeft'
import ArrowRight from 'components/Icon/ArrowRight'
import { useOnKeydown } from 'hooks'

import Button from './Button'

export const WizardContext = createContext()

class Steps extends React.Component {
  render() {
    return (
      <WizardContext.Consumer>
        {({ steps, wizardState }) => {
          const fade = {
            from: { opacity: 0, height: '100%' },
            enter: { opacity: 1 },
            leave: { opacity: 0, height: 0 },
          }
          const animationProps = fade

          return (
            <Transition
              config={config.gentle}
              initial={null}
              items={steps[wizardState.currentStep]}
              keys={item => item.key}
              {...animationProps}
            >
              {item => props => (
                <Flex justifyContent="center" style={props} {...this.props}>
                  {item}
                </Flex>
              )}
            </Transition>
          )
        }}
      </WizardContext.Consumer>
    )
  }
}

// eslint-disable-next-line jsdoc/require-jsdoc
function SkipButton({ children }) {
  return (
    <WizardContext.Consumer>
      {({ wizardApi, wizardState }) => {
        if (!wizardApi.canSkip()) {
          return null
        }

        return (
          <Button
            isDisabled={wizardState.isSubmitting}
            isProcessing={wizardState.isSubmitting}
            mr={3}
            onClick={() => wizardApi.skip(true)}
            type="button"
            variant="secondary"
          >
            <Flex>
              <Box mr={1}>{children}</Box>
            </Flex>
          </Button>
        )
      }}
    </WizardContext.Consumer>
  )
}

SkipButton.propTypes = {
  children: PropTypes.node,
}

const NextButton = props => {
  const { children, navigateTo } = props
  const formApiRef = useRef(null)
  const onEnter = useCallback(() => {
    const { current: formApi } = formApiRef
    if (formApi) {
      formApi.submitForm()
    }
  }, [formApiRef])
  useOnKeydown('Enter', onEnter, true)
  return (
    <WizardContext.Consumer>
      {({ wizardApi, wizardState, formApi }) => {
        const { formState } = wizardState
        formApiRef.current = formApi
        return (
          <Button
            isDisabled={wizardState.isSubmitting || (formState && formState.invalid)}
            isProcessing={wizardState.isSubmitting}
            onClick={() => {
              if (navigateTo === null) {
                wizardApi.next()
              } else {
                wizardApi.navigateTo(navigateTo)
              }
            }}
            type="submit"
          >
            <Flex>
              <Box mr={1}>{children}</Box>
              <Box>
                <ArrowRight />
              </Box>
            </Flex>
          </Button>
        )
      }}
    </WizardContext.Consumer>
  )
}

NextButton.propTypes = {
  children: PropTypes.node,
  navigateTo: PropTypes.number,
}

NextButton.defaultProps = {
  children: 'Next',
  navigateTo: null,
}

class BackButton extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    navigateTo: PropTypes.number,
  }

  static defaultProps = {
    children: 'Back',
    navigateTo: null,
  }

  render() {
    const { children, navigateTo } = this.props
    return (
      <WizardContext.Consumer>
        {({ wizardApi, wizardState }) => {
          if (!wizardState.currentStep) {
            return null
          }
          return (
            <Button
              isDisabled={wizardState.isSubmitting}
              onClick={() => {
                if (navigateTo === null) {
                  wizardApi.previous()
                } else {
                  wizardApi.navigateTo(navigateTo)
                }
              }}
              type="button"
              variant="secondary"
            >
              <Flex>
                <Box>
                  <ArrowLeft />
                </Box>
                <Box ml={1}>{children}</Box>
              </Flex>
            </Button>
          )
        }}
      </WizardContext.Consumer>
    )
  }
}

class Debug extends React.Component {
  render() {
    return (
      <WizardContext.Consumer>
        {({ wizardApi }) => <pre>{JSON.stringify(wizardApi.getState(), null, 2)}</pre>}
      </WizardContext.Consumer>
    )
  }
}

class Step extends React.Component {
  static propTypes = {
    component: PropTypes.object.isRequired,
  }

  render() {
    const { component } = this.props
    return (
      <WizardContext.Consumer>
        {({ wizardApi, wizardState }) => React.cloneElement(component, { wizardApi, wizardState })}
      </WizardContext.Consumer>
    )
  }
}

class Wizard extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    steps: PropTypes.array,
  }

  /* eslint react/no-unused-state: 0 */
  /* eslint react/sort-comp: 0 */
  static Steps = Steps

  static Step = Step

  static NextButton = NextButton

  static SkipButton = SkipButton

  static BackButton = BackButton

  static Debug = Debug

  state = {
    currentItem: null,
    currentStep: 0,
    direction: 'next',
    isSkip: false, // if the wizard is currently in skip mode
    isSubmitting: false,
    formState: {},
  }

  constructor(props) {
    super(props)
    const { steps } = this.props
    this.state.currentItem = steps && steps[0] && steps[0].key
  }

  previousStep = () => {
    const { steps } = this.props
    const { currentStep } = this.state
    const nextStep = Math.max(currentStep - 1, 0)
    if (currentStep !== nextStep) {
      this.setState({
        currentItem: steps[nextStep].key,
        currentStep: nextStep,
        direction: 'previous',
        isSkip: false,
        formState: {},
      })
    }
  }

  nextStep = () => {
    const { steps } = this.props
    const { currentStep } = this.state
    const nextStep = Math.min(currentStep + 1, steps.length - 1)
    if (currentStep !== nextStep) {
      this.setState({
        currentItem: steps[nextStep].key,
        currentStep: nextStep,
        direction: 'next',
        isSkip: false,
        formState: {},
      })
    }
  }

  handlePrevious = () => {
    this.previousStep()
  }

  handleNext = () => {
    const { isSkip } = this.state
    if (isSkip || !this.formApi) {
      this.nextStep()
    } else {
      this.setState({ isSubmitting: true })
      this.formApi.submitForm()
    }
  }

  getCurrentStepProps = () => {
    const { currentStep } = this.state
    const { steps } = this.props
    return steps[currentStep].props
  }

  /**
   *  handleSkip - Toggles skip mode.
   *
   * @param {boolean} isSkip Boolean indicating if skip mode is currently active
   */
  handleSkip = isSkip => {
    this.setState({ isSkip })
  }

  navigateTo = stepId => {
    const { steps } = this.props
    this.setState({
      currentItem: steps[stepId].key,
      currentStep: stepId,
      direction: 'previous',
      formState: {},
    })
  }

  onSubmit = () => {
    this.setState({ isSubmitting: false })
    this.nextStep()
  }

  onSubmitFailure = () => {
    this.setState({ isSubmitting: false })
  }

  setFormApi = formApi => {
    this.formApi = formApi
    this.setFormState(formApi.getState())
  }

  setFormState = formState => {
    this.setState({ formState })
  }

  getApi = formApi => {
    this.setFormApi(formApi)
  }

  /**
   * canSkip - Checks whether current step is skipable.
   *
   * @returns {boolean} true if current step can be skipped
   * @memberof Wizard
   */
  canSkip = () => {
    const { canSkip } = this.getCurrentStepProps()
    return Boolean(canSkip)
  }

  onChange = (formState, stepId) => {
    const { currentItem } = this.state
    if (currentItem && stepId === currentItem) {
      this.setFormState(formState)
    }
  }

  render() {
    const { children, steps } = this.props

    return (
      <WizardContext.Provider
        value={{
          wizardApi: {
            previous: this.handlePrevious,
            next: this.handleNext,
            navigateTo: this.navigateTo,
            onSubmit: this.onSubmit,
            onSubmitFailure: this.onSubmitFailure,
            onChange: this.onChange,
            skip: this.handleSkip,
            getApi: this.getApi,
            canSkip: this.canSkip,
            getState: () => this.state,
          },
          formApi: this.formApi,
          wizardState: this.state,
          steps,
        }}
      >
        {children}
      </WizardContext.Provider>
    )
  }
}

export default Wizard
