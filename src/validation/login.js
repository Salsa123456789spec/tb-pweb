import Joi from 'joi';

export const validateLogin = (data) => {
    const schema = Joi.object({
        nim: Joi.string().required().messages({
            'any.required': 'NIM wajib diisi',
            'string.empty': 'NIM tidak boleh kosong'
        }),
        password: Joi.string().required().messages({
            'any.required': 'Password wajib diisi',
            'string.empty': 'Password tidak boleh kosong'
        })
    });

    return schema.validate(data, { abortEarly: false });
};
