import React, { useRef, useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'
import styled, { withTheme } from 'styled-components'
import { themeGet } from '@styled-system/theme-get'
import { useOnClickOutside, useOnKeydown, useScroll, useComponentSize } from 'hooks'
import AngleRight from 'components/Icon/AngleRight'
import AngleUp from 'components/Icon/AngleUp'
import AngleDown from 'components/Icon/AngleDown'
import Check from 'components/Icon/Check'
import Bar from './Bar'
import Card from './Card'
import Span from './Span'
import { DropdownButton } from './Dropdown'

/**
 * getColor - Get color based on hover state.
 *
 * @param  {*} props Props
 * @returns {string} Color
 */
function getColor(props) {
  return props.isHovered
    ? themeGet('colors.lightningOrange')(props)
    : themeGet('colors.primaryText')(props)
}

/**
 * getMutedColor - Get muted color based on hover state.
 *
 * @param  {*} props Props
 * @returns {string} Color
 */
function getMutedColor(props) {
  return props.isHovered
    ? themeGet('colors.lightningOrange')(props)
    : themeGet('colors.gray')(props)
}

const MenuContext = React.createContext({})
const MenuProvider = MenuContext.Provider

const RefType = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
])

const MenuItemsType = PropTypes.arrayOf(
  PropTypes.shape({
    content: PropTypes.node,
    description: PropTypes.node,
    icon: PropTypes.Object,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onClick: PropTypes.function,
    submenu: PropTypes.array,
    title: PropTypes.node,
  })
)

const MenuButton = ({ children }) => (
  <MenuButtonContent alignItems="center" justifyContent="space-between" p={2}>
    {children}
  </MenuButtonContent>
)

MenuButton.propTypes = {
  children: PropTypes.node,
}

const MenuButtonContent = styled(Flex)`
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: ${themeGet('colors.tertiaryColor')};
  }
`

const MenuButtonText = styled(Flex)`
  color: ${getColor};
  user-select: none;
`

const MenuButtonTextMuted = styled(Flex)`
  color: ${getMutedColor};
`

const DropmenuItem = ({
  title,
  description,
  isSelected,
  hasIndent,
  icon,
  onClick,
  submenu,
  ...rest
}) => {
  const { justify, width } = useContext(MenuContext)
  const ref = useRef(null)
  const [isHovered, setHovered] = useState(false)
  const { left, top } = useComponentSize(ref)

  return (
    <Box
      {...rest}
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <MenuButton isHovered={isHovered}>
        <Box>
          <Flex alignItems="center">
            {(hasIndent || (isSelected && !icon)) && (
              <Flex color="superGreen" textAlign="center" width="20px">
                {isSelected && <Check height="0.95em" />}
              </Flex>
            )}
            {icon && (
              <MenuButtonTextMuted isHovered={isHovered} mr={2}>
                {isSelected ? <Span color="superGreen">{icon}</Span> : icon}
              </MenuButtonTextMuted>
            )}
            <MenuButtonText isHovered={isHovered}>{title}</MenuButtonText>
          </Flex>
          {description && <MenuButtonTextMuted mt={1}>{description}</MenuButtonTextMuted>}
        </Box>
        {submenu && (
          <MenuButtonTextMuted isHovered={isHovered}>
            <AngleRight height="8px" />
          </MenuButtonTextMuted>
        )}
      </MenuButton>
      {submenu && isHovered && (
        <DropmenuSubmenu
          items={submenu}
          left={justify === 'right' ? left - width : left + width}
          top={top}
        />
      )}
    </Box>
  )
}

DropmenuItem.propTypes = {
  description: PropTypes.node,
  hasIndent: PropTypes.bool,
  icon: PropTypes.node,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func,
  submenu: PropTypes.array,
  title: PropTypes.node.isRequired,
}

const DropmenuButton = ({ isOpen, children, ...rest }) => {
  const [isHovered, setHovered] = useState(false)

  return (
    <DropdownButton
      type="button"
      {...rest}
      fontWeight="light"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <MenuButtonText isHovered={isHovered || isOpen}>
        <Flex alignItems="flex-end">
          <Box mr={1}>{children}</Box>
          <MenuButtonTextMuted isHovered={isHovered || isOpen}>
            {isOpen ? <AngleUp width="0.6em" /> : <AngleDown width="0.6em" />}
          </MenuButtonTextMuted>
        </Flex>
      </MenuButtonText>
    </DropdownButton>
  )
}

DropmenuButton.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
}

const DropmenuListScrollerBase = styled(Flex)`
  transition: all 0.25s;
  opacity: ${props => props.opacity};
  cursor: pointer;
  z-index: 1;
  position: relative;
`

const DropmenuListScroller = props => (
  <DropmenuListScrollerBase
    bg="primaryColor"
    color="lightningOrange"
    justifyContent="center"
    p={2}
    width={1}
    {...props}
  />
)

DropmenuListScroller.propTypes = {
  direction: PropTypes.oneOf(['up', 'down']).isRequired,
  opacity: PropTypes.number,
}

DropmenuListScroller.defaultProps = {
  opacity: 1,
}

const DropmenuListItem = ({ item }) => {
  const { type, content, ...rest } = item

  const renderContent = () => {
    switch (type) {
      case 'content':
        return (
          <Box as="li">
            <Box p={1}>{content}</Box>
          </Box>
        )
      case 'bar':
        return (
          <Box as="li">
            <Bar mx={-1} my={1} variant="light" />
          </Box>
        )
      default:
        return (
          <Box as="li">
            <DropmenuItem {...rest} />
          </Box>
        )
    }
  }

  return renderContent()
}

const DropmenuListScrollContainer = styled(Box)`
  z-index: 0;
  max-height: 450px;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
`

const DropmenuListUpScroller = styled(DropmenuListScroller)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${props => (props.hasTopScroll ? 'auto' : 0)};
  z-index: ${props => (props.hasTopScroll ? 1 : -1)};
`

const DropmenuList = React.forwardRef((props, forwardRef) => {
  const SCROLL_STEP = 29
  const { width } = useContext(MenuContext)
  const ref = useRef(null)
  const { scrollableHeight, isScrollbarVisible } = useComponentSize(ref)
  const { y: scrollY = 0 } = useScroll(ref) || {}
  const hasTopScroll = Boolean(isScrollbarVisible && scrollY)
  const hasBottomScroll = Boolean(isScrollbarVisible && scrollY < scrollableHeight - SCROLL_STEP)

  const scrollDown = () => {
    ref.current.scrollTop += SCROLL_STEP
  }
  // prevent underlying text from selecting when double clicking elements inside menu list
  const preventDefault = e => e.preventDefault()
  const scrollUp = () => {
    ref.current.scrollTop -= SCROLL_STEP
  }
  return (
    <Card css="position: relative;" onMouseDown={preventDefault} p={0} width={width}>
      <DropmenuListUpScroller
        direction="up"
        hasTopScroll={hasTopScroll}
        onClick={scrollUp}
        opacity={hasTopScroll ? 1 : 0}
      >
        <AngleUp />
      </DropmenuListUpScroller>
      <DropmenuListScrollContainer ref={ref} as="ul" p={1}>
        <Box ref={forwardRef} {...props} />
      </DropmenuListScrollContainer>
      {isScrollbarVisible && (
        <DropmenuListScroller
          direction="down"
          onClick={scrollDown}
          opacity={hasBottomScroll ? 1 : 0}
        >
          <AngleDown />
        </DropmenuListScroller>
      )}
    </Card>
  )
})

DropmenuList.displayName = 'DropmenuList'

const DropmenuListWithTheme = withTheme(DropmenuList)

const DropmenuContent = ({ menuRef, items }) => {
  return (
    <DropmenuListWithTheme ref={menuRef}>
      {items.map((item, index) => (
        <DropmenuListItem key={item.id || index} item={item} />
      ))}
    </DropmenuListWithTheme>
  )
}

DropmenuContent.propTypes = {
  items: MenuItemsType,
  menuRef: RefType,
}

const DropmenuSubmenuWrapper = styled(Box)`
  position: absolute;
  z-index: 10;
  height: 0;
  width: 0;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
`

const DropmenuSubmenu = props => {
  const { top, left, ...rest } = props
  return (
    <DropmenuSubmenuWrapper left={left} top={top}>
      <DropmenuContent {...rest} />
    </DropmenuSubmenuWrapper>
  )
}

DropmenuSubmenu.propTypes = {
  left: PropTypes.number,
  top: PropTypes.number,
}

DropmenuSubmenu.defaultProps = {
  top: 0,
  left: 0,
}

const DropmenuMenu = ({ menuRef, ...rest }) => {
  const { justify } = useContext(MenuContext)
  return (
    <Box sx={{ position: 'relative' }}>
      <Flex
        sx={{
          position: 'absolute',
          zIndex: 1,
          right: justify === 'right' ? 0 : null,
        }}
      >
        <DropmenuContent {...rest} menuRef={menuRef} />
      </Flex>
    </Box>
  )
}

DropmenuMenu.propTypes = {
  menuRef: RefType,
}

const Dropmenu = ({ children, items, width, justify, ...rest }) => {
  // State to track menu open state.
  const [isOpen, setIsOpen] = useState(false)
  const toggleMenu = () => setIsOpen(!isOpen)

  // Close the menu if the user clicks outside our elements.
  const buttonRef = useRef(null)
  const menuRef = useRef(null)
  useOnClickOutside([buttonRef, menuRef], () => setIsOpen(false))

  // Close the menu if the escape key is pressed.
  useOnKeydown('Escape', () => setIsOpen(false))

  return (
    <MenuProvider value={{ width, justify }}>
      <Flex
        alignItems={justify === 'right' ? 'flex-end' : 'flex-start'}
        flexDirection="column"
        {...rest}
      >
        {children && (
          <Box ref={buttonRef}>
            <DropmenuButton isOpen={isOpen} mb={1} onClick={toggleMenu}>
              {children}
            </DropmenuButton>
          </Box>
        )}
        {(!children || isOpen) && (
          <DropmenuMenu items={items} justify={justify} menuRef={menuRef} />
        )}
      </Flex>
    </MenuProvider>
  )
}

Dropmenu.propTypes = {
  children: PropTypes.node,
  items: MenuItemsType,
  justify: PropTypes.oneOf(['left', 'right']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

Dropmenu.defaultProps = {
  width: 265,
  justify: 'left',
  items: [],
}

export default Dropmenu
