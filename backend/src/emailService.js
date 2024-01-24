import nodemailer from 'nodemailer';

// Configuração do Nodemailer com o servidor SMTP da Sendinblue
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true para a porta 465, false para outras portas
    auth: {
        user: "renovadescriber@gmail.com",
        pass: process.env.SENDINBLUE_API_KEY // Sua chave SMTP da Sendinblue
    }
});

export async function enviarEmailDeAtivacao(emailUsuario, nomeUsuario) {
    const mailOptions = {
        from: 'renovadescriber@gmail.com',
        to: emailUsuario,
        subject: 'Sua conta foi ativada',
        text: `Olá ${nomeUsuario},\n\nSua conta no Renova Image Describer foi ativada. Você já pode fazer login e começar a usar nossos serviços.\n\nAtenciosamente,\nEquipe Renova Games`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail enviado para ${emailUsuario}`);
    } catch (error) {
        console.error(`Erro ao enviar e-mail: ${error}`);
    }
}
