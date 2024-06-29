export const formatToClientDay = (date?: Date | string) => {
  if (!date) {
    return ""
  }

  return new Date(date).toLocaleDateString()
}
