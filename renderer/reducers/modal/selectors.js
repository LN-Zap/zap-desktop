const getModalState = state => state.modal.modals

const isDialogOpen = (state, id) => Boolean(state.modal.dialogs[id])

export default {
  getModalState,
  isDialogOpen,
}
