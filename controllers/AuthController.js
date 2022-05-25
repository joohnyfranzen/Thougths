const User = require('../models/User')

// criptogravar senha
const bcrypt = require('bcryptjs')

module.exports = class AuthController {

    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {
        const { email, password } = req.body

        // find user
        const user = await User.findOne({where: {email: email}})
    
        if (!user) {
            req.flash('message', 'Usuário não encontrado!')
            res.render('auth/login')

            return
        }

        // chech if passwords match
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch) {
            req.flash('message', 'Senha inválida!')
            res.render('auth/login')

            return
        }
         // initialize session
         req.session.userid = user.id

        req.flash('message', 'Autenticação realizada com sucesso!')
        req.session.save(() => {
        res.redirect('/')
        })
    }

    static register(req, res) {
        res.render('auth/register')
    }

    // Função de registro
    static async registerpost(req, res) {

        const { name, email, password, confirmpassword } = req.body

        // password match validation
        if(password != confirmpassword) {
            //mensagem
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')

            return
        }

        // check if user exists
        const chechIfUserExists = await User.findOne({ where: {email: email}})

        if(chechIfUserExists) {
            req.flash('message', 'Email já em uso, tente outro!')
            res.render('auth/register')

        }

        // create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword,
        }

        try {
            const createdUser = await User.create(user)

            // initialize session
            req.session.userid = createdUser.id
            console.log(createdUser.id)

            req.flash('message', 'Cadastro realizado com sucesso!')
            req.session.save(() => {
                res.redirect('/')
            })

        } catch(err) {
            console.log(err)
        }
    }
    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }
}