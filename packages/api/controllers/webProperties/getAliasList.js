const alias = require("../../models/alias");

module.exports = async function getAliasList(req, res, next) {
  try {
    const { propertyName } = req?.params;
    if (propertyName) {
      const response = await alias.find({ propertyName: propertyName });
      return res.status(200).json(response);
    }
    const response = await alias.find();
    if (response.length === 0) return res.status(200).json({ message: "No data avaliable." });
    return res.status(200).json(response);
  } catch (e) {
    next(err);
  }
};
