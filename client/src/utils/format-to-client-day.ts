export const formatToClientDay = (date?: Date) => {
  if (!date) {
    return ""
  }

  return new Date(date).toLocaleDateString()
}
