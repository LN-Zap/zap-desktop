import React, { useRef, useState, useContext } from 'react'

import { themeGet } from '@styled-system/theme-get'
import PropTypes from 'prop-types'
import { Box, Flex } from 'rebass/styled-components'
import styled from 'styled-components'

import AngleDown from 'components/Icon/AngleDown'
import AngleRight from 'components/Icon/AngleRight'
import AngleUp from 'components/Icon/AngleUp'
import Check from 'components/Icon/Check'
import {
  useOnClickOutside,
  useOnKeydown,
  useScroll,
  useComponentSize,
  useMaxScreenHeight,
} from 'hooks'

import Bar from './Bar'
import Card from './Card'
import { DropdownButton } from './Dropdown'
import Span from './Span'

/**
 * getColor - Get color based on hover state.
 *
 * @param {*} props Props
 * @returns {string} Color
 */
function getColor(props) {
  return props.isHovered
    ? themeGet('colors.primaryAccent')(props)
    : themeGet('colors.primaryText')(props)
}

/**
 * getMutedColor - Get muted color based on hover state.
 *
 * @param {*} props Props
 * @returns {string} Color
 */
function getMutedColor(props) {
  return props.isHovered ? themeGet('colors.primaryAccent')(props) : themeGet('colors.gray')(props)
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
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={ref}
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
        <Flex alignItems="center">
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
    color="primaryAccent"
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
  const { children, height } = props
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
  const BOTTOM_SCROLLER_HEIGHT = 25
  const listHeight = height ? height - BOTTOM_SCROLLER_HEIGHT * isScrollbarVisible : 'auto'
  return (
    <Card
      onMouseDown={preventDefault}
      p={0}
      ref={forwardRef}
      sx={{ position: 'relative' }}
      width={width}
    >
      <DropmenuListUpScroller
        direction="up"
        hasTopScroll={hasTopScroll}
        onClick={scrollUp}
        opacity={hasTopScroll ? 1 : 0}
      >
        <AngleUp />
      </DropmenuListUpScroller>
      <DropmenuListScrollContainer as="ul" height={listHeight} p={1} ref={ref}>
        <Box>{children}</Box>
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
DropmenuList.propTypes = {
  children: PropTypes.node,
  height: PropTypes.number,
}
DropmenuList.displayName = 'DropmenuList'

const DropmenuContent = ({ menuRef, items, height }) => {
  return (
    <DropmenuList height={height} ref={menuRef}>
      {items.map((item, index) => (
        <DropmenuListItem item={item} key={item.id || index} />
      ))}
    </DropmenuList>
  )
}

DropmenuContent.propTypes = {
  height: PropTypes.number,
  items: MenuItemsType,
  menuRef: RefType,
}

const DropmenuSubmenuWrapper = styled(Box)`
  position: absolute;
  z-index: 10;
  width: 0;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
`

const DropmenuSubmenu = props => {
  const { top, left, ...rest } = props
  const [measuredRef, maxHeight] = useMaxScreenHeight()
  return (
    <DropmenuSubmenuWrapper height={maxHeight} left={left} top={top}>
      <DropmenuContent {...rest} height={maxHeight} menuRef={measuredRef} />
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
