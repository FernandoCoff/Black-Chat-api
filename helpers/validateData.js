export const validateName = (name) => {
  if (!name || !name.trim()) {
    return 'O nome não pode ser vazio!'
  }

  if (name.trim().length < 3) {
    return 'O nome deve ter no mínimo 3 caracteres'
  }

  return true
}

export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'O email não pode ser vazio!'
  }

  return true
}

export const validatePassword = (password) => {
  if (!password || !password.trim()) {
    return 'A senha não pode ser vazia!'
  }

  if (password.trim().length < 6) {
    return 'A senha deve ter no mínimo 6 caracteres.'
  }

  return true
}


