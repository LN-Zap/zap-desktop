/* eslint-disable react/no-multi-comp */

import React, { createContext } from 'react'
import PropTypes from 'prop-types'
import { Transition, config } from 'react-spring'
import { Box, Flex } from 'rebass'
import ArrowLeft from 'components/Icon/ArrowLeft'
import ArrowRight from 'components/Icon/ArrowRight'
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
                <Flex justifyContent="center" style={props}>
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

class NextButton extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    navigateTo: PropTypes.number,
  }

  static defaultProps = {
    children: 'Next',
    navigateTo: null,
  }

  render() {
    const { children, navigateTo } = this.props

    return (
      <WizardContext.Consumer>
        {({ wizardApi, wizardState }) => {
          const { formState } = wizardState
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
    component: PropTypes.func.isRequired,
  }

  render() {
    const { component, ...rest } = this.props
    return (
      <WizardContext.Consumer>
        {({ wizardApi, wizardState }) =>
          React.createElement(component, { ...rest, wizardApi, wizardState })
        }
      </WizardContext.Consumer>
    )
  }
}

class Wizard extends React.Component {
  /* eslint react/no-unused-state: 0 */
  static Steps = Steps
  static Step = Step
  static NextButton = NextButton
  static BackButton = BackButton
  static Debug = Debug

  static propTypes = {
    children: PropTypes.node,
    steps: PropTypes.array,
  }

  constructor(props) {
    super(props)
    const { steps } = this.props
    this.state = {
      currentItem: steps && steps[0] && steps[0].key,
      currentStep: 0,
      direction: 'next',
      isSubmitting: false,
      formState: {},
    }
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
        formState: {},
      })
    }
  }

  handlePrevious = () => {
    this.previousStep()
  }

  handleNext = () => {
    if (this.formApi) {
      this.setState({ isSubmitting: true })
      this.formApi.submitForm()
    } else {
      this.nextStep()
    }
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
            getApi: this.getApi,
            getState: () => this.state,
          },
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
