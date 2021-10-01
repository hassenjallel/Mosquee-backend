const AdminModel = require("../models/admin");
const OfferModel = require("../models/offres");
const CoursModel = require("../models/cours");
const nodemailer = require("nodemailer");
const _ = require("lodash");

var bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_EXPIRES = process.env.JWT_EXPIRES;
const JWT_SECRET = process.env.JWT_SECRET;

const decryptJwt = async (token) => {
  const jwtVerify = promisify(jwt.verify);
  return await jwtVerify(token, process.env.JWT_SECRET);
};

// create valid jwt
const signJwt = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const sendToken = (user, statusCode, req, res) => {
  const token = signJwt(user._id);

  const options = {
    expires: new Date(Date.now() + process.env.JWT_EXPIRATION_NUM),
    secure: process.env.NODE_ENV === "prodution" ? true : false,
    httpOnly: true,
  };
  res.cookie("jwtToken", token, options);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};
/*  ajouter un admin */
router.post("/add_user", async (req, res) => {
 var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.mot_de_passe, salt);
  console.log("ha")
  try {
  const Admin = new AdminModel({
    pseudo: req.body.pseudo,
    email: req.body.email,
    mot_de_passe: hash,
    nom: req.body.nom,
    prenom: req.body.prenom,
    cin: req.body.cin,
    nom_mosquee: req.body.nom_mosquee,
    ville: req.body.ville,
    type: "admin",
    pictureName: req.body.imagename,
    numero_telephone: req.body.numero_telephone,
    verifier: "true"
  });
  
    await Admin.save();
    sendToken(Admin, 201, req, res);
    res.json(Admin);

  } catch (err) {
    res.status(400).json(err.message);

  }




});
/**update profil */

router.put("/:pseudo", (async (req, res) => {



  let pseudo = req.params.pseudo;
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.mot_de_passe, salt);
  let upUser = await AdminModel.findOne({ pseudo });

  (upUser.pseudo = req.body.pseudo),
    (upUser.email = req.body.email),
    (upUser.mot_de_passe = hash),
    (upUser.nom_mosquee = req.body.nom_mosquee),
    (upUser.nom = req.body.nom),
    (upUser.pictureName = req.body.pictureName),

    (upUser.prenom = req.body.prenom),
    (upUser.cin = req.body.cin),
    (upUser.numero_telephone = req.body.numero_telephone);

  const upuser = await upUser.save();
  res.status(200).json(upuser);

})
);
/**update mosquee */

router.put("/super_admin/mosque/:pseudo", (async (req, res) => {



  let pseudo = req.params.pseudo;

  let upUser = await AdminModel.findOne({ pseudo });

  (upUser.pseudo = req.body.pseudo),
    (upUser.email = req.body.email),
    (upUser.mot_de_passe = req.body.mot_de_passe),
    (upUser.nom_mosquee = req.body.nom_mosquee),
    (upUser.nom = req.body.nom),
    (upUser.pictureName = req.body.pictureName),

    (upUser.prenom = req.body.prenom),
    (upUser.cin = req.body.cin),
    (upUser.numero_telephone = req.body.numero_telephone);

  const upuser = await upUser.save();
  res.status(200).json(upuser);

})
);
/**ban profil */

router.put("/ban_mosquee/:pseudo", (async (req, res) => {



  let pseudo = req.params.pseudo;

  let upUser = await AdminModel.findOne({ pseudo });


  (upUser.verifier = "false")


  const upuser = await upUser.save();

  res.status(200).json(upuser);

})
);
/**reactiver profil */

router.put("/reactiver_mosquee/:pseudo", (async (req, res) => {



  let pseudo = req.params.pseudo;

  let upUser = await AdminModel.findOne({ pseudo });


  (upUser.verifier = "true")


  const upuser = await upUser.save();

  res.status(200).json(upuser);

})
);
/** */
router.post("/login", async (req, res) => {

  let pseudo = req.body.pseudo;
  let mot_de_passe = req.body.mot_de_passe;
 
  try {

    const user = await AdminModel.findOne({ pseudo });
    const passwordCorrect = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (passwordCorrect) {

      sendToken(user, 200, req, res);
    } else {
      res.status(400).json({ message: "login Failed" })
    }
  } catch (err) {
    res.status(400).json(err.message)
  }
})
/**  */

router.get("/", async (req, res) => {
  let type = "admin"
  const AdminFind = await AdminModel.find({ type });
  res.json(AdminFind);
});
router.get("/:email", async (req, res) => {
  let email = req.params.email;
  const AdminFind = await AdminModel.find({ email });
  res.json(AdminFind);
});
router.get("/nom_mosque/:nom_mosque", async (req, res) => {
  let nom_mosquee = req.params.nom_mosque;
  const MosqueFind = await AdminModel.find({ nom_mosquee });
  res.json(MosqueFind);
});
router.get("/pseudo/:pseudo", async (req, res) => {
  let pseudo = req.params.pseudo;
  const pseudoFind = await AdminModel.find({ pseudo });
  res.json(pseudoFind);
});
/** get user his name start with */
router.get("/getnamestartwith/:pseudo", async (req, res) => {
  console.log("hha")
  let pseudo = req.params.pseudo;
  const pseudoFind = await AdminModel.find({ pseudo:"/^E/" });
  console.log(pseudoFind)
  res.json(pseudoFind);
});
/**/
router.delete("/:pseudo", async (req, res) => {
  pseudo = req.params.pseudo;
  let adminDelete = await AdminModel.findOneAndRemove({ pseudo })
  res.json(adminDelete);
});

/**get all mosque in city */
router.get("/all_mosquee/:ville", async (req, res) => {
  let ville = req.params.ville;


  const AdminFind = await AdminModel.find({ ville });



  res.json(AdminFind);
});


/** get villes  */
router.get("/all/villes", async (req, res) => {
  let type = "admin";
  console.log("hah")
  const AdminFind = await AdminModel.find({ type });

  let listDeVille = [];
  let same = false;
  for (var i = 0; i < AdminFind.length; i++) {
    for (var j = 0; j < listDeVille.length; j++) {
      if (AdminFind[i].ville.localeCompare(listDeVille[j]) === 0) {
        same = true;
      }
    }
    if (!same) {
      listDeVille.push(AdminFind[i].ville)

    }
    same = false;
  }
  res.json(listDeVille);
});
router.post("/mailResetPassword/:email/:code", (async (req, res) => {
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
    subject: "Reset Password",
    text: "to tchange your password you have  to put this code  " + req.params.code
  };
  transp.sendMail(options, function (err, info) {
    if (err) {
      return;
    }
  })
  res.json()
})
);

router.put("/forg-password/:email/:password", async (req, res) => {

  let email = req.params.email;
  let password = req.params.password;

  /*var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.mot_de_passe, salt);*/
  let upUser = await AdminModel.findOne({ email })

  try {
    (upUser.mot_de_passe = password)


  const upuser = await upUser.save();

  res.status(200).json(upuser);
   

  } catch (err) {
    res.status(400).json(err.message);

  }




}




);
module.exports = router;
