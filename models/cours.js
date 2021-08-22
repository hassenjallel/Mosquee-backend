const mongoose =require ("mongoose");

const coursSchema = mongoose.Schema({
    nom_cours: { type: String, required: true ,  unique: true},

  description: { type: String, required: true },
  mail_admin :{type:String , required :true},
  nom_mosquee:{type:String , required : true },
  ville:{type:String , required : true },

 
     condidats: [
        {
          nom_condidat: { type: String, required: true },
          prenom_condidat: { type: String, required: true },
          cin_condidat: { type: String, required: true },
          email_condidat: { type: String, required: true },
          numero_condidat:{type:Number , required:true}
        },
      ],
  date_debut: { type: Date, required: true},

  date_fin: { type: Date, required: true}, 

  nbr_personnes: {type: Number},
  pictureName:{type:String},

 
  
});
coursSchema.index({  "date_fin": 1 },    {expireAfterSeconds: 20} )
const cours = mongoose.model("cours", coursSchema);
 module.exports = cours;
