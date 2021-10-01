const coursModel =require("../models/cours");
const express = require( "express");
const router = express.Router();
const multer = require("multer");
const _ = require("lodash");
const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/cours/');
    },
    
    filename : function(req,file,cb){
        imageName=req.body.date_debut+"-"+file.originalname;
        cb(null,  imageName);
    }
})

const upload = multer({storage: storage});
/*  ajouter un offre */
router.post("/",upload.single('coursIamges'), async (req, res) => {
  
    const cours = new coursModel({
        nom_cours: req.body.nom_cours,
        description: req.body.description,
        pictureName:req.body.imagename,
        date_debut: new Date(req.body.date_debut),
        date_fin: new Date(req.body.date_fin),
        nbr_personnes: req.body.nbr_personnes,
        mail_admin: req.body.mail_admin,
        nom_mosquee: req.body.nom_mosquee,
        ville: req.body.ville,

    });
  


    const coursCreated = await cours.save();
  
    res.json(coursCreated);
  
  });
  /** */
  /** afficher touts les offres
   */

   router.get("/", async (req, res) => {
    const coursFind = await coursModel.find();
    res.json(coursFind);
  });
  /** */
/** afficher une  offres selon le nom de mosquee
 */

 router.get("/nom_mosquee/:nom_mosque/:type", async (req, res) => {
  nom_mosquee = req.params.nom_mosque;
  type = req.params.type;

  if(type==="admin"){
  const coursFindByNomMosquee = await coursModel.find({ nom_mosquee });
  res.json(coursFindByNomMosquee);
  }else if (type==="super_admin") {
    const coursFind = await coursModel.find();
    res.json(coursFind);
  }
});
 /** afficher un cours selon le nom
 */

router.get("/getcoursbyname/:nom", async (req,res)=>{
  nom_cours=req.params.nom;
  const mawjoud="mawjoud"
  const mechmawjoud="mechmawjoud"
  const cours = await coursModel.findOne({nom_cours});
  if(cours===null){
    res.json(mechmawjoud);

  }else{
    res.json(mawjoud);

  }

})

  /** */
/** afficher une  offres selon le nom de mosquee 2
 */

 router.get("/nom_mosquee/:nom_mosque", async (req, res) => {
  nom_mosquee = req.params.nom_mosque;
  
  const coursFindByNomMosquee = await coursModel.find({ nom_mosquee });
  res.json(coursFindByNomMosquee);    

});

  /** delete cour */
router.delete("/:nom", async (req, res) => {
    nom_cours=req.params.nom;
    let coursdelete = await coursModel.findOneAndRemove({ nom_cours })
    //console.log(coursdelete);
    res.json(coursdelete);
  });
   /** delete cour with  mosque name */
router.delete("/nom_mosque/:nom", async (req, res) => {
  nom_mosquee=req.params.nom;
  let coursdelete = await coursModel.findOneAndRemove({ nom_mosquee })
  //console.log(coursdelete);
  res.json(coursdelete);
});

router.put("/:id", (async (req, res) => {



  let _id = req.params.id;

  let upCours = await coursModel.findOne({ _id });

    (upCours.nom_cours = req.body.nom_cours),
    (upCours.description = req.body.description),
    (upCours.date_debut = req.body.date_debut),
    (upCours.date_fin = req.body.date_fin),
    (upCours.mail_admin = req.body.mail_admin),
    (upCours.nbr_personnes = req.body.nbr_personnes),
    (upCours.pictureName = req.body.pictureName);
    (upCours.nom_mosquee = req.body.nom_mosquee);
    (upCours.ville = upCours.ville);
    (upCours.prix = req.body.prix);




  const upcours = await upCours.save();
  res.status(200).json(upcours);

})
);
   /** inscription dans  un  offre */
router.put("/inscription/cours/:nom", async (req, res) => {
    nom_cours=req.params.nom;
    const new_condidat= {
        nom_condidat : req.body.nom_condidat,
        prenom_condidat : req.body.prenom_condidat,
        cin_condidat : req.body.cin_condidat,
        email_condidat : req.body.email_condidat,
        numero_condidat : req.body.numero_condidat
    }

    let upCondidat = await coursModel.findOne({ nom_cours })
  if(upCondidat.nbr_personnes > 0){
  const obj = {
    condidats : new_condidat
  }
  upCondidat.nbr_personnes--;
  upCondidat.condidats.push(new_condidat) ;

  const coursupdate =upCondidat.save( );
    res.json(coursupdate);
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
}else{
    res.json("désolé mais ce cours  est complète ")
}
  });
  /******** */
  /*router.post("/sendemail/:email/:nom_condidat", (async (req, res) => {
    console.log("tkhal lel bab3then mte3 el mail");
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
      text: "désolé (monsieur/madame) "+ req.params.nom_condidat+"  nous avons annulé le cours ,  si vous voulez, vous pouvez consulter notre application pour des nouvelles cours" 
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
  );*/
  
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
