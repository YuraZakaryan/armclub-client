import { boolean, number, object, ref, string, array } from 'yup';

export const userSchema = (t: (key: string) => string) => {
  return object({
    activated: boolean().optional().default(false),
    banned: boolean().optional().default(false),
    role: object({
      value: string(),
      label: string(),
    }).typeError(t('user.role_required')),
  });
};

export const clubSchema = (t: (key: string) => string) => {
  return object({
    name: string().required(t('club.crud_errors.address_required')),
    address: string().required(t('club.crud_errors.address_required')),
    region: object({
      label: string(),
      value: string(),
    }).typeError(t('club.crud_errors.region_required')),
    city: object({
      label: string(),
      value: string(),
    }).typeError(t('club.crud_errors.city_required')),
    info: string().required(t('club.crud_errors.address_required')),

    // Optional fields with default values
    picture: string().nullable().optional(),
    posterPicture: string().nullable().optional(),
    additionalInfo: string().optional(),
    countryCode: string().required(t('auth.errors.country_code_required')).oneOf(['+7', '+374', '+1'], 'Code error'),
    phone: string()
      .optional()
      .test('phone-pattern', t('auth.errors.phone_pattern'), (value) => {
        if (!value) return true;
        return /^(?:\(\d{3}\)\s?\d{3}-\d{4}|\(\d{2}\)\s?\d{2}-\d{2}-\d{2}|\(\d{3}\)\s?\d{2}-\d{4}-\d{3})$/.test(value);
      }),
    latitudeMap: string()
      .matches(
        /^$|^(\+|-)?((\d((\.)|\.\d{1,6})?)|(0*?[0-8]\d((\.)|\.\d{1,6})?)|(0*?90((\.)|\.0{1,6})?))$/,
        t('club.crud_errors.invalid_latitude'),
      )
      .test('lat-long', t('club.crud_errors.lat_or_long_required'), function (value) {
        const { longitudeMap } = this.parent;
        if (value && !longitudeMap) {
          return this.createError({
            message: t('club.crud_errors.lat_or_long_required'),
            path: 'longitudeMap',
          });
        }
        return true;
      }),
    longitudeMap: string()
      .matches(
        /^$|^(\+|-)?((\d((\.)|\.\d{1,6})?)|(0*?\d\d((\.)|\.\d{1,6})?)|(0*?1[0-7]\d((\.)|\.\d{1,6})?)|(0*?180((\.)|\.0{1,6})?))$/,
        t('club.crud_errors.invalid_longitude'),
      )
      .test('lat-long', t('property.crud_errors.lat_or_long_required'), function (value) {
        const { latitudeMap } = this.parent;
        if (value && !latitudeMap) {
          return this.createError({
            message: t('club.crud_errors.lat_or_long_required'),
            path: 'latitudeMap',
          });
        }
        return true;
      }),
    prices: array()
      .optional()
      .of(
        object({
          id: string().optional(),
          name: string().optional(),
          amount: number().required(t('validation.required')).min(0, t('validation.min_amount')),
        }),
      ),

    // Boolean fields
    isChildAllowed: boolean().optional().default(false),
  });
};

export const registrationSchema = (t: (key: string) => string) => {
  return object({
    firstName: string().required(t('auth.errors.first_name_required')).min(2, t('auth.errors.first_name_min_length')),

    lastName: string()
      .optional()
      .test('last-name-min-length', t('auth.errors.last_name_min_length'), (value) => {
        if (!value) return true;
        return value.length >= 2;
      }),

    username: string()
      .required(t('auth.errors.username_required'))
      .min(8, t('auth.errors.username_min_length'))
      .matches(/^[a-zA-Z0-9]+$/, t('auth.errors.username_pattern')),

    email: string().required(t('auth.errors.email_required')).email(t('auth.errors.email_format')),

    countryCode: string().required(t('auth.errors.country_code_required')).oneOf(['+7', '+374', '+1'], 'Code error'),

    phone: string()
      .optional()
      .test('phone-pattern', t('auth.errors.phone_pattern'), (value) => {
        if (!value) return true;
        return /^(?:\(\d{3}\)\s?\d{3}-\d{4}|\(\d{2}\)\s?\d{2}-\d{2}-\d{2}|\(\d{3}\)\s?\d{2}-\d{4}-\d{3})$/.test(value);
      }),

    password: string()
      .required(t('auth.errors.password_required'))
      .min(8, t('auth.errors.password_min_length'))
      .matches(/[A-Z]/, t('auth.errors.password_uppercase'))
      .matches(/[a-z]/, t('auth.errors.password_lowercase'))
      .matches(/\d/, t('auth.errors.password_number'))
      .matches(/[\W_]/, t('auth.errors.password_special')),
  });
};

export const updateProfileSchema = (t: (key: string) => string) => {
  return object({
    firstName: string().required(t('auth.errors.first_name_required')).min(2, t('auth.errors.first_name_min_length')),

    lastName: string()
      .transform((value) => (value === '' ? null : value))
      .nullable()
      .min(2, t('auth.errors.last_name_min_length')),

    username: string()
      .required(t('auth.errors.username_required'))
      .min(8, t('auth.errors.username_min_length'))
      .matches(/^[a-zA-Z0-9]+$/, t('auth.errors.username_pattern')),

    email: string().required(t('auth.errors.email_required')).email(t('auth.errors.email_format')),

    countryCode: string().required(t('auth.errors.country_code_required')).oneOf(['+7', '+374', '+1'], 'Code error'),

    phone: string()
      .optional()
      .test('phone-pattern', t('auth.errors.phone_pattern'), (value) => {
        if (!value) return true;
        return /^(?:\(\d{3}\)\s?\d{3}-\d{4}|\(\d{2}\)\s?\d{2}-\d{2}-\d{2}|\(\d{3}\)\s?\d{2}-\d{4}-\d{3})$/.test(value);
      }),
  });
};

export const updatePasswordSchema = (t: (key: string) => string) => {
  return object({
    oldPassword: string()
      .required(t('auth.errors.password_required'))
      .min(8, t('auth.errors.password_min_length'))
      .matches(/[A-Z]/, t('auth.errors.password_uppercase'))
      .matches(/[a-z]/, t('auth.errors.password_lowercase'))
      .matches(/\d/, t('auth.errors.password_number'))
      .matches(/[\W_]/, t('auth.errors.password_special')),
    newPassword: string()
      .required(t('auth.errors.password_required'))
      .notOneOf([ref('oldPassword')], t('auth.errors.new_password_same_as_old')),
  });
};

export const setPasswordSchema = (t: (key: string) => string) => {
  return object({
    newPassword: string()
      .required(t('auth.errors.password_required'))
      .min(8, t('auth.errors.password_min_length'))
      .matches(/[A-Z]/, t('auth.errors.password_uppercase'))
      .matches(/[a-z]/, t('auth.errors.password_lowercase'))
      .matches(/\d/, t('auth.errors.password_number'))
      .matches(/[\W_]/, t('auth.errors.password_special')),
  });
};

export const requestEmailSchema = (t: (key: string) => string) => {
  return object({
    email: string().required(t('auth.errors.email_required')).email(t('auth.errors.email_format')),
  });
};

export const setPasswordResetSchema = (t: (key: string) => string) => {
  return object({
    password: string()
      .required(t('auth.errors.password_required'))
      .min(8, t('auth.errors.password_min_length'))
      .matches(/[A-Z]/, t('auth.errors.password_uppercase'))
      .matches(/[a-z]/, t('auth.errors.password_lowercase'))
      .matches(/\d/, t('auth.errors.password_number'))
      .matches(/[\W_]/, t('auth.errors.password_special')),
    rePassword: string()
      .required(t('auth.errors.password_required'))
      .notOneOf([ref('oldPassword')], t('auth.errors.new_password_same_as_old')),
  });
};

export const contactUsSchema = (t: (key: string) => string) => {
  return object({
    firstName: string().required(t('auth.errors.first_name_required')).min(2, t('auth.errors.first_name_min_length')),

    message: string()
      .required(t('about_us.errors.message_required'))
      .min(10, t('about_us.errors.message_min_length'))
      .max(1000, t('about_us.errors.message_max_length')),

    email: string().required(t('auth.errors.email_required')).email(t('auth.errors.email_format')),

    website: string().optional(),
  });
};
