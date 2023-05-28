export default (error) => {

  if (error.name === "ValidationError") {
    let errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return {
      statusCode: 400,
      errors,
    }
  }

  return null;
}