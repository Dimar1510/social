function createError() {
  const controller = (controllerName) => {
    return `Error in controller: ${controllerName}`;
  };
  const internal = () => {
    return "Internal server error";
  };
  const fieldMissing = () => {
    return "All fields are required!";
  };

  return { controller, internal, fieldMissing };
}

module.exports = createError;
