import React from 'react'
import PropTypes from 'prop-types'
import { Box } from 'rebass'
import MenuItem from 'components/UI/MenuItem'

const Menu = ({ items, selectedItem, ...rest }) => {
  return (
    <Box {...rest}>
      {items.map(({ id, title, onClick }) => {
        const handleClick = e => {
          if (onClick) {
            onClick(e.target.value)
          }
        }
        return (
          <MenuItem key={id} isActive={id === selectedItem} onClick={handleClick} value={id}>
            {title}
          </MenuItem>
        )
      })}
    </Box>
  )
}

Menu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      onClick: PropTypes.func,
      title: PropTypes.node.isRequired,
    })
  ),
  selectedItem: PropTypes.string,
}

Menu.defaultProps = {
  items: [],
}

export default Menu
