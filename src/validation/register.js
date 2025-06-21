import Joi from 'joi';

export function validateRegister(data) {
    const schema = Joi.object({
        name: Joi.string().required().messages({
            'string.empty': 'Nama tidak boleh kosong'
        }),
        nim: Joi.string().required().messages({
            'string.empty': 'NIM tidak boleh kosong'
        }),
        email: Joi.string().email().required().messages({
            'string.empty': 'Email tidak boleh kosong',
            'string.email': 'Email tidak valid'
        }),
        password: Joi.string().pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*\\d).{8,}$')).required().messages({
            'string.pattern.base': 'Password minimal 8 karakter dan terdiri dari huruf & angka',
            'string.empty': 'Password tidak boleh kosong'
        }),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
            'any.only': 'Konfirmasi password tidak sama',
            'any.required': 'Konfirmasi password tidak boleh kosong'
        })
    });

    return schema.validate(data, { abortEarly: false });
}