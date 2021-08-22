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
  console.log("dakhlet lel  fonc")


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

  console.log("dakhlet lel  fonc")

  const offreCreated = await offre.save();

  res.json(offreCreated);

});
/** */
/** afficher touts les offres
 */

router.get("/", async (req, res) => {
  console.log("dkhal lel get all offres");
  const offreFind = await offresModel.find();
  res.json(offreFind);
});
/** */
/** afficher touts les omra
 */
router.get("/omra", async (req, res) => {
  console.log("dkhal lel get all offres omra");
  type="omra"
  const offreFind = await offresModel.find({type});
  res.json(offreFind);
});
/** */
/** afficher touts les haja
 */
 router.get("/haja", async (req, res) => {
  console.log("dkhal lel get all offres haja");
  type="haja"
  const offreFind = await offresModel.find({type});
  res.json(offreFind);
});
/** */
/** afficher une  offres selon le nom
 */

router.get("/:nom", async (req, res) => {
  nom_offre = req.params.nom;

  console.log("dkhal lel get  offres by name");
  console.log(nom_offre)
  const offreFindone = await offresModel.findOne({ nom_offre });
  
  res.json(offreFindone);
});
/** */
/** afficher une  offres selon le nom de mosquee
 */

 router.get("/nom_mosquee/:nom_mosque/:type", async (req, res) => {
  nom_mosquee = req.params.nom_mosque;
  type = req.params.type;
  console.log("dkhal lel get  offres by name");
  
  const offreFindByNomMosquee = await offresModel.find({ nom_mosquee });
  res.json(offreFindByNomMosquee);    

});

/** */
/** afficher une  offres selon le nom de mosquee 2
 */

 router.get("/nom_mosquee/:nom_mosque", async (req, res) => {
  nom_mosquee = req.params.nom_mosque;
  console.log("dkhal lel get  offres by name");
  
  const offreFindByNomMosquee = await offresModel.find({ nom_mosquee });
  res.json(offreFindByNomMosquee);    

});

/** delete offre */
router.delete("/:nom", async (req, res) => {
  nom_offre = req.params.nom;
  console.log(nom_offre);
  let offredelete = await offresModel.findOneAndRemove({ nom_offre })
  console.log(offredelete);
  res.json(offredelete);
});
   /** delete offre with  mosque name */
   router.delete("/nom_mosque/:nom", async (req, res) => {
    nom_mosquee=req.params.nom;
    console.log(nom_mosquee);
    let offredelete = await offresModel.findOneAndRemove({ nom_mosquee })
    //console.log(coursdelete);
    res.json(offredelete);
  });
/** inscription dans  un  offre */
router.put("/inscription/offres/:nom", async (req, res) => {
  nom_offre = req.params.nom;
  const new_condidat = {
    nom_condidat: req.body.nom_condidat,
    prenom_condidat: req.body.prenom_condidat,
    cin_condidat: req.body.cin_condidat,
    email_condidat: req.body.email_condidat,
    numero_condidat: req.body.numero_condidat
  }

  let upCondidat = await offresModel.findOne({ nom_offre })
  if (upCondidat.nbr_personnes > 0) {
    const obj = {
      condidats: new_condidat
    }
    upCondidat.nbr_personnes--;
    upCondidat.condidats.push(new_condidat);

    const offrepdate = upCondidat.save();
    console.log(offrepdate);
    res.json(offrepdate);
    /** send  mail  */

    const transp = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "hassen.jalleli@esprit.tn",
        pass: "hassen161jmt0715"
      }
    });
    const options = {
      from: "hassen.jalleli@esprit.tn",
      to: upCondidat.mail_admin,
      subject: "test mail",
      text: "ther is a new reservation ",
    };
    transp.sendMail(options, function (err, info) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("sent : " + info.response);
    })
    /**/

  } else {
    res.json("désolé mais cette offre est complète ")
  }
});
/*************/ 
router.post("/sendemail/:email/:nom_condidat", (async (req, res) => {
  const transp = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "hassen.jalleli@esprit.tn",
      pass: "hassen161jmt0715"
    }
  });
  const options = {
    from: "hassen.jalleli@esprit.tn",
    to: req.params.email,
    subject: "Mosquee",
    text: "désolé (monsieur/madame) "+ req.params.nom_condidat+"  nous avons annulé (l'offre/cours) , votre argent sera remboursé, si vous voulez, vous pouvez consulter notre application pour de nouvelles offres" 
  };
  transp.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("sent : " + info.response);
  })
res.json()
})
);

module.exports = router;
