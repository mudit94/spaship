const { Router } = require("express");
const produceEvent = require("../controllers/operatorServices/produceEvent");
const analyzeRepository = require("../controllers/webProperties/analyzeRepository");
const getSPAList = require("../controllers/webProperties/getSPAList");
const getWebPropertyList = require("../controllers/webProperties/getWebPropertyList");
const getAliasList = require("../controllers/webProperties/getAliasList");
const gitOperations = require("../controllers/webProperties/gitOperations");
const saveAlias = require("../controllers/operatorServices/saveAlias");
const getPropertyDetails = require("../controllers/webPropertyServices/utils/getPropertyDetails");

const router = new Router();

router.post("/", gitOperations);

router.get("/list", getWebPropertyList.getWebPropertyList);

router.get("/getspalist/:webPropertyName", getSPAList.getSPAList);

router.post("/analyze/repository", analyzeRepository);

router.get("/activities/:id", produceEvent);

router.post("/alias", saveAlias);

router.get("/alias/list", getAliasList);

router.get("/alias/list/:propertyName", getAliasList);

router.get("/get/applications", getPropertyDetails.getPropertyDetails);

router.get("/get/applications/:propertyName", getPropertyDetails.getPropertyDetails);

router.get("/get/applications/:propertyName/:spaName", getPropertyDetails.getPropertyDetails);

module.exports = router;
