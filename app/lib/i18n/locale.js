import { addLocaleData } from 'react-intl'

// Load locale data.
import bg from 'react-intl/locale-data/bg'
import cs from 'react-intl/locale-data/cs'
import de from 'react-intl/locale-data/de'
import el from 'react-intl/locale-data/el'
import en from 'react-intl/locale-data/en'
import es from 'react-intl/locale-data/es'
import fr from 'react-intl/locale-data/fr'
import ga from 'react-intl/locale-data/ga'
import hr from 'react-intl/locale-data/hr'
import ja from 'react-intl/locale-data/ja'
import nl from 'react-intl/locale-data/nl'
import pt from 'react-intl/locale-data/pt'
import ro from 'react-intl/locale-data/ro'
import ru from 'react-intl/locale-data/ru'
import sv from 'react-intl/locale-data/sv'
import tr from 'react-intl/locale-data/tr'
import uk from 'react-intl/locale-data/uk'
import zh from 'react-intl/locale-data/zh'

// Add locale data.
addLocaleData([
  ...bg,
  ...cs,
  ...de,
  ...el,
  ...en,
  ...es,
  ...fr,
  ...ga,
  ...hr,
  ...ja,
  ...nl,
  ...pt,
  ...ro,
  ...ru,
  ...sv,
  ...tr,
  ...uk,
  ...zh
])
