const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
    pseudo: { type: String, required: true, unique: true },

    email: { type: String, required: true },
    mot_de_passe: { type: String, required: true },
    nom_mosquee: { type: String },

    ville: { type: String },
    pictureName: { type: String },

    nom: { type: String, required: true },

    prenom: { type: String, required: true },
    numero_telephone: { type: String, required: true },
    cin: { type: Number },
    type: {
        type: String,
        required: true,
        enum: ["admin", "super_admin"]
    },
    verifier: {
        type: String,
        required: true,
        enum: ["true", "false"]
    },
});

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
