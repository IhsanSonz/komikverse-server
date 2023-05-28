import validator from "validator";
import isEmpty from "../is-empty.js";
const { isLength, isEmpty: _isEmpty, isEmail } = validator;

export default function validatePopulateInput(data) {
  let errors = {};

  console.log(!Array.isArray(data.episodes), data.episodes === 0);

  if (!Array.isArray(data.episodes) || data.episodes === 0) {
    errors.episodes = 'Please provide a valid resources (array)';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}