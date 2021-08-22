const mongoose =require ("mongoose");

const offresSchema = mongoose.Schema({
  nom_offre: { type: String, required: true ,  unique: true},

  description: { type: String, required: true },

  type: { type: String,
     required: true, 
     enum: ["omra", "haja"]},
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
  mail_admin :{type:String , required :true},

  date_fin: { type: Date, required: true}, 

  nbr_personnes: {type: Number},
  pictureName:{type:String},
  nom_mosquee:{type:String , required : true },
  ville:{type:String , required : true },
  
  prix: { type: Number},

});
offresSchema.index({  "date_debut": 1 },    {expireAfterSeconds: 00} )
const offres = mongoose.model("offres", offresSchema);
 module.exports = offres;
