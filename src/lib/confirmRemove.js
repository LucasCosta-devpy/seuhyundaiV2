// Envolve as ações de lista (useListEditing) pedindo confirmação antes de remover.
// Usado em região/país/cidade, que levam os itens de dentro junto.
export function withConfirmRemove(list, getMessage) {
  if (!list) return null
  return {
    ...list,
    remove: (i) => {
      if (window.confirm(getMessage(i))) list.remove(i)
    },
  }
}
