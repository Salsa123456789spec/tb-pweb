import Joi from 'joi';

export const validateLogin = (data) => {
    const schema = Joi.object({
        role: Joi.string().valid('mahasiswa', 'asisten_lab', 'admin').required().messages({
            'any.required': 'Role wajib dipilih',
            'any.only': 'Role tidak valid'
        }),
        identifier: Joi.string().required().messages({
            'any.required': 'NIM atau No. Aslab wajib diisi',
            'string.empty': 'NIM atau No. Aslab tidak boleh kosong'
        }),
        password: Joi.string().required().messages({
            'any.required': 'Password wajib diisi',
            'string.empty': 'Password tidak boleh kosong'
        })
    });

    return schema.validate(data, { abortEarly: false });
};
