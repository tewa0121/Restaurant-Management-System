const AppError = require('./AppError');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

const isEmpty = (value) =>
  value === undefined || value === null || (typeof value === 'string' && value.trim() === '');

function validateObject(input, schema, prefix = '') {
  const data = {};
  const errors = [];
  const source = input && typeof input === 'object' && !Array.isArray(input) ? input : {};

  Object.keys(schema).forEach((field) => {
    const rule = schema[field];
    const label = rule.label || field;
    const path = prefix ? `${prefix}.${field}` : field;
    const raw = source[field];

    if (isEmpty(raw)) {
      if (rule.required) errors.push({ field: path, message: `${label} is required` });
      else if (rule.default !== undefined) data[field] = rule.default;
      else if (raw === null && rule.nullable) data[field] = null;
      return;
    }

    const result = validateValue(raw, rule, label, path);
    if (result.errors) errors.push(...result.errors);
    else data[field] = result.value;
  });

  return { data, errors };
}

function fail(path, message) {
  return { errors: [{ field: path, message }] };
}

function validateValue(raw, rule, label, path) {
  let value = raw;
  const type = rule.type || 'string';

  switch (type) {
    case 'string': {
      if (typeof value === 'number' || typeof value === 'boolean') value = String(value);
      if (typeof value !== 'string') return fail(path, `${label} must be text`);
      if (rule.trim !== false) value = value.trim();
      if (rule.lowercase) value = value.toLowerCase();
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        return fail(path, `${label} must be at least ${rule.minLength} characters`);
      }
      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        return fail(path, `${label} must be at most ${rule.maxLength} characters`);
      }
      break;
    }
    case 'email': {
      if (typeof value !== 'string') return fail(path, `${label} must be a valid email`);
      value = value.trim().toLowerCase();
      if (!EMAIL_RE.test(value) || value.length > 100) return fail(path, `${label} must be a valid email`);
      break;
    }
    case 'number':
    case 'integer': {
      if (typeof value === 'string') {
        const text = rule.strip ? value.replace(rule.strip, '') : value;
        value = text.trim() === '' ? NaN : Number(text);
      }
      if (typeof value !== 'number' || !Number.isFinite(value)) return fail(path, `${label} must be a number`);
      if (type === 'integer' && !Number.isInteger(value)) return fail(path, `${label} must be a whole number`);
      if (rule.min !== undefined && value < rule.min) return fail(path, `${label} must be at least ${rule.min}`);
      if (rule.max !== undefined && value > rule.max) return fail(path, `${label} must be at most ${rule.max}`);
      break;
    }
    case 'boolean': {
      if (value === true || value === 'true' || value === 1 || value === '1') value = true;
      else if (value === false || value === 'false' || value === 0 || value === '0') value = false;
      else return fail(path, `${label} must be true or false`);
      break;
    }
    case 'date': {
      if (typeof value !== 'string' || !DATE_RE.test(value.trim())) return fail(path, `${label} must be a date (YYYY-MM-DD)`);
      value = value.trim();
      if (Number.isNaN(Date.parse(value))) return fail(path, `${label} must be a valid date`);
      break;
    }
    case 'time': {
      if (typeof value !== 'string' || !TIME_RE.test(value.trim())) return fail(path, `${label} must be a time (HH:MM)`);
      value = value.trim();
      if (value.length === 5) value = `${value}:00`;
      break;
    }
    case 'array': {
      if (!Array.isArray(value)) return fail(path, `${label} must be a list`);
      if (rule.minItems !== undefined && value.length < rule.minItems) {
        return fail(path, `${label} must contain at least ${rule.minItems} item(s)`);
      }
      if (rule.maxItems !== undefined && value.length > rule.maxItems) {
        return fail(path, `${label} must contain at most ${rule.maxItems} item(s)`);
      }
      const cleaned = [];
      const errors = [];
      value.forEach((item, index) => {
        const itemPath = `${path}[${index}]`;
        if (rule.schema) {
          const nested = validateObject(item, rule.schema, itemPath);
          if (nested.errors.length) errors.push(...nested.errors);
          else cleaned.push(nested.data);
        } else if (rule.items) {
          const nested = validateValue(item, rule.items, label, itemPath);
          if (nested.errors) errors.push(...nested.errors);
          else cleaned.push(nested.value);
        } else {
          cleaned.push(item);
        }
      });
      if (errors.length) return { errors };
      value = cleaned;
      break;
    }
    case 'object': {
      if (typeof value !== 'object' || Array.isArray(value)) return fail(path, `${label} must be an object`);
      if (rule.schema) {
        const nested = validateObject(value, rule.schema, path);
        if (nested.errors.length) return { errors: nested.errors };
        value = nested.data;
      }
      break;
    }
    default:
      return fail(path, `${label} has an unsupported rule`);
  }

  if (rule.in && !rule.in.includes(value)) {
    return fail(path, `${label} must be one of: ${rule.in.join(', ')}`);
  }
  if (rule.pattern && !rule.pattern.test(value)) {
    return fail(path, rule.patternMessage || `${label} has an invalid format`);
  }

  return { value };
}

function validate(schemas) {
  return (req, res, next) => {
    const errors = [];
    ['params', 'query', 'body'].forEach((location) => {
      if (!schemas[location]) return;
      const { data, errors: found } = validateObject(req[location], schemas[location]);
      if (found.length) errors.push(...found);
      else req[location] = data;
    });

    if (errors.length) {
      return next(new AppError(errors[0].message, 422, 'VALIDATION_ERROR', errors));
    }
    return next();
  };
}

const idParam = { id: { type: 'integer', required: true, min: 1 } };

module.exports = { validate, validateObject, idParam };