const offresModel = require("../models/offres");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const nodemailer = require("nodemailer");
const _ = require("lodash");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'C:/Users/hasse/StudioProjects/mosquee/app/src/main/res/drawable-v24/');
  },

  filename: function (req, file, cb) {
    imageName = req.body.date_debut + "-" + file.originalname;
    cb(null, imageName);
  }
})

const upload = multer({ storage: storage });
/*  ajouter un offre */
router.post("/", upload.single('offresIamges'), async (req, res) => {


  const offre = new offresModel({
    nom_offre: req.body.nom_offre,
    description: req.body.description,
    type: req.body.type,
    pictureName: req.body.imagename,
    date_debut: new Date(req.body.date_debut),
    date_fin: new Date(req.body.date_fin),
    mail_admin: req.body.mail_admin,
    nbr_personnes: req.body.nbr_personnes,
    nom_mosquee: req.body.nom_mosquee,
    prix: req.body.prix,
    ville: req.body.ville,

  });


  const offreCreated = await offre.save();

  res.json(offreCreated);

});
/** */
/** afficher touts les offres
 */

router.get("/", async (req, res) => {
  const offreFind = await offresModel.find();
  res.json(offreFind);
});
/** */
/** afficher touts les omra
 */
router.get("/omra", async (req, res) => {
  type="omra"
  const offreFind = await offresModel.find({type});
  res.json(offreFind);
});
/** */
/** afficher touts les haja
 */
 router.get("/haja", async (req, res) => {
  type="haja"
  const offreFind = await offresModel.find({type});
  res.json(offreFind);
});
/** */
/** afficher une  offres selon le nom
 */

router.get("/getoffrebyname/:nom", async (req,res)=>{
  nom_offre=req.params.nom;
  const mawjoud="mawjoud"
  const mechmawjoud="mechmawjoud"
  const offre = await offresModel.findOne({nom_offre});
  if(offre===null){
    res.json(mechmawjoud);

  }else{
    res.json(mawjoud);

  }

})
/** */
/** afficher une  offres selon le nom de mosquee
 */

 router.get("/nom_mosquee/:nom_mosque/:type", async (req, res) => {
  nom_mosquee = req.params.nom_mosque;
  type = req.params.type;
  
  const offreFindByNomMosquee = await offresModel.find({ nom_mosquee });
  res.json(offreFindByNomMosquee);    

});

/** */
/** afficher une  offres selon le nom de mosquee 2
 */

 router.get("/nom_mosquee/:nom_mosque", async (req, res) => {
  nom_mosquee = req.params.nom_mosque;
  
  const offreFindByNomMosquee = await offresModel.find({ nom_mosquee });
  res.json(offreFindByNomMosquee);    

});

/** delete offre */
router.delete("/:nom", async (req, res) => {
  nom_offre = req.params.nom;
  let offredelete = await offresModel.findOneAndRemove({ nom_offre })
  res.json(offredelete);
});
   /** delete offre with  mosque name */
   router.delete("/nom_mosque/:nom", async (req, res) => {
    nom_mosquee=req.params.nom;
    let offredelete = await offresModel.findOneAndRemove({ nom_mosquee })
    //console.log(coursdelete);
    res.json(offredelete);
  });
/** inscription dans  un  offre */
router.put("/inscription/offres/:nom", async (req, res) => {
  nom_offre = req.params.nom;
  console.log(nom_offre)
  const new_condidat = {
    nom_condidat: req.body.nom_condidat,
    prenom_condidat: req.body.prenom_condidat,
    cin_condidat: req.body.cin_condidat,
    email_condidat: req.body.email_condidat,
    numero_condidat: req.body.numero_condidat
  }

  let upCondidat = await offresModel.findOne({nom_offre})
  console.log(upCondidat);
  if (upCondidat.nbr_personnes > 0) {
    const obj = {
      condidats: new_condidat
    }
    upCondidat.nbr_personnes--;
    upCondidat.condidats.push(new_condidat);

    const offrepdate = upCondidat.save();
    res.json(offrepdate);
    /** send  mail  */

    const transp = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "mosqueefrance2021@gmail.com",
        pass: "azerty@1234"
      }
    });
    const options = {
      from: "mosqueefrance2021@gmail.com",
      to: upCondidat.mail_admin,
      subject: "test mail",
      text: "ther is a new reservation ",
    };
    transp.sendMail(options, function (err, info) {
      if (err) {
        return;
      }
    })
    /**/

  } else {
    res.json("désolé mais cette offre est complète ")
  }
});

router.put("/:id", (async (req, res) => {



  let _id = req.params.id;

  let upOffre = await offresModel.findOne({ _id });

    (upOffre.nom_offre = req.body.nom_offre),
    (upOffre.description = req.body.description),
    (upOffre.type = req.body.type),
    (upOffre.date_debut = req.body.date_debut),
    (upOffre.date_fin = req.body.date_fin),
    (upOffre.mail_admin = req.body.mail_admin),
    (upOffre.nbr_personnes = req.body.nbr_personnes),
    (upOffre.pictureName = req.body.pictureName);
    (upOffre.nom_mosquee = req.body.nom_mosquee);
    (upOffre.ville = upOffre.ville);
    (upOffre.prix = req.body.prix);




  const upoffre = await upOffre.save();
  res.status(200).json(upoffre);

})
);
/*************/ 
router.post("/sendemail/:email/:nom_condidat", (async (req, res) => {
  const transp = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "mosqueefrance2021@gmail.com",
      pass: "azerty@1234"
    }
  });
  const options = {
    from: "mosqueefrance2021@gmail.com",
    to: req.params.email,
    subject: "Mosquee",
    text: "désolé (monsieur/madame) "+ req.params.nom_condidat+
    "  nous avons annulé (l'offre/cours) , votre argent sera remboursé,"+ 
    "si vous voulez, vous pouvez consulter notre application pour de nouvelles offres" 
  };
  transp.sendMail(options, function (err, info) {
    if (err) {
      return;
    }
  })
res.json()
})
);

router.post("/sendemailOnUpdate/:email/:nom_condidat", (async (req, res) => {
  const transp = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "mosqueefrance2021@gmail.com",
      pass: "azerty@1234"
    }
  });
  const options = {
    from: "mosqueefrance2021@gmail.com",
    to: req.params.email,
    subject: "Mosquee",
    html:`
    <h2>désolé (monsieur/madame) `+ req.params.nom_condidat+` </h2>
    <h3> nous avons Modifier (l'offre/cours) , et voici les nouvelles  informations  de  notre offre </h3>
    <br/>
    <h4> nom offre : `+req.body.nom_offre+ ` </h4>
    <h4> description : `+req.body.description+ ` </h4>
    <h4> date debut : `+req.body.date_debut+ ` </h4>
    <h4> date fin : `+req.body.date_fin+ ` </h4>
    <h4> prix : `+req.body.prix+ ` </h4>
    <h4> type : `+req.body.type+ ` </h4>
    

    `,
    
    
  };
  transp.sendMail(options, function (err, info) {
    if (err) {
      return;
    }
  })
res.json()
})
);

module.exports = router;
