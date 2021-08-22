const AdminModel = require("../models/admin");
const OfferModel = require("../models/offres");
const CoursModel = require("../models/cours");

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
    console.log("token")

    console.log(token)
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
  
  console.log(req.body.pseudo);
    const Admin = new AdminModel({
        pseudo: req.body.pseudo,
        email: req.body.email,
        mot_de_passe: req.body.mot_de_passe,
        nom: req.body.nom,
        prenom: req.body.prenom,
        cin: req.body.cin,
        nom_mosquee: req.body.nom_mosquee,
        ville:req.body.ville,
        type: "admin",
        pictureName:req.body.imagename,
        numero_telephone:req.body.numero_telephone,
        verifier:"true"
    });
    try {
        console.log("hahaahha");
        const AdminCreated = await Admin.save();
        console.log( AdminCreated);
    sendToken(AdminCreated, 201, req, res);
    res.json(AdminCreated);

    }catch(err){
        res.status(400).json(err.message);

    }




});
/**update profil */

router.put("/:pseudo", (async (req, res) => {



  let pseudo = req.params.pseudo;

  let upUser = await AdminModel.findOne({ pseudo });

  (upUser.pseudo = req.body.pseudo),
    (upUser.email = req.body.email),
    (upUser.mot_de_passe = req.body.mot_de_passe),

    (upUser.nom = req.body.nom),
    (upUser.prenom = req.body.prenom),
    (upUser.cin = req.body.cin);


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
     (upUser.nom_mosquee=req.body.nom_mosquee) ,
    (upUser.nom = req.body.nom),
    (upUser.prenom = req.body.prenom),
    (upUser.cin = req.body.cin),
    (upUser.numero_telephone=req.body.numero_telephone);

  const upuser = await upUser.save();
  res.status(200).json(upuser);

})
);
/**ban profil */

router.put("/ban_mosquee/:pseudo", (async (req, res) => {



  let pseudo = req.params.pseudo;

  let upUser = await AdminModel.findOne({ pseudo });
 

    (upUser.verifier="false")


  const upuser = await upUser.save();
 
  res.status(200).json(upuser);

})
);
/**reactiver profil */

router.put("/reactiver_mosquee/:pseudo", (async (req, res) => {



  let pseudo = req.params.pseudo;

  let upUser = await AdminModel.findOne({ pseudo });
 

    (upUser.verifier="true")


  const upuser = await upUser.save();
 
  res.status(200).json(upuser);

})
);
/** */
router.post("/login", async (req, res) => {
    console.log("dkhalet lel login");

    let  pseudo = req.body.pseudo;
    let mot_de_passe = req.body.mot_de_passe;
    console.log(pseudo);
    console.log(mot_de_passe);
    try {
        console.log("dkhalet lel try");

        const user = await AdminModel.findOne({ pseudo });
        if (user.mot_de_passe === mot_de_passe) {
            console.log("dkhalet lel if el shihaa");
            console.log(user);

            sendToken(user, 200, req, res);
        }else {
            res.status(400).json({message:"login Failed"})
        }
    } catch (err){
res.status(400).json(err.message)
    }
}) 
/**  */

router.get("/", async (req, res) => {
  console.log("dkhal lel get all admin");
  let type="admin"
  const AdminFind = await AdminModel.find({type});
  res.json(AdminFind);
});
/**/ 
router.delete("/:pseudo", async (req, res) => {
  pseudo =req.params.pseudo;
  let adminDelete = await AdminModel.findOneAndRemove({ pseudo })
  res.json(adminDelete);
});

/**get all mosque in city */
router.get("/all_mosquee/:ville", async (req, res) => {
  console.log("dkhal lel *get all mosque in city");
  let ville=req.params.ville;
 

  const AdminFind = await AdminModel.find({ville});
 
 
  console.log(AdminFind)

  res.json(AdminFind);
});
/** get villes  */
router.get("/all_ville", async (req, res) => {
  console.log("dkhal lel get all admin");
  let type="admin";
  const AdminFind = await AdminModel.find({type});
  let listDeVille =[];
  let same =false;
  for (var i = 0; i < AdminFind.length; i++) {
    for(var j=0 ; j < listDeVille.length ; j++){
        if(AdminFind[i].ville.localeCompare(listDeVille[j])===0){
          same=true;
          console.log(same)
        }
    }
    if(!same){
      listDeVille.push(AdminFind[i].ville)

    }
    same=false;
  }
  console.log(i)
  res.json(listDeVille);
});
 module.exports = router;
