import validator from "validator";
import isEmpty from "../is-empty.js";
const { isLength, isEmpty: _isEmpty, isEmail } = validator;

export default function validateRegisterInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!isLength(data.password, { min: 6, max: 50 })) {
    errors.password = "Password minimal 6 karakter";
  }

  if (_isEmpty(data.email)) {
    errors.email = "Data Email dibutuhkan";
  }

  if (!isEmail(data.email)) {
    errors.email = "Email tidak valid";
  }

  if (_isEmpty(data.password)) {
    errors.password = "Data Password dibutuhkan";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}