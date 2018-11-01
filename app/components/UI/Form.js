import system from '@rebass/components'
import { styles } from 'styled-system'
import { Form as InformedForm } from 'informed'
// Create an html input element that accepts all style props from styled-system.
const Form = system(
  {
    extend: InformedForm
  },
  ...Object.keys(styles)
)

export default Form
