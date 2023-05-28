import validator from "validator";
import isEmpty from "../is-empty.js";
const { isLength, isEmpty: _isEmpty, isEmail, equals } = validator;

export default function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!isLength(data.name, { min: 3, max: 50 })) {
    errors.name = "Nama Harus diantara 3 dan 50 Karakter";
  }

  if (!isLength(data.password, { min: 6, max: 50 })) {
    errors.password = "Password minimal 6 karakter";
  }


  if (_isEmpty(data.name)) {
    errors.name = "Data nama dibutuhkan";
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

  if (!equals(data.password2, data.password)) {
    errors.password2 = "Data password dan confirmed password harus sama";
  }

  if (_isEmpty(data.password2)) {
    errors.password2 = "Data Confirm Password dibutuhkan";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}