export const handleFileUpload = (
  e: React.ChangeEvent<HTMLInputElement>,
  setError: (arg: string) => void,
  setSelectedFile: (arg: File) => void,
) => {
  if (e.target.files !== null) {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i

    if (e.target.files[0].size > 5 * 1048576) {
      setError("Maximum file size is 5Mb")
      e.target.value = ""
    } else if (!allowedExtensions.exec(e.target.value)) {
      setError("Invalid file type")
      e.target.value = ""
    } else {
      setError("")
      setSelectedFile(e.target.files[0])
    }
  }
}
