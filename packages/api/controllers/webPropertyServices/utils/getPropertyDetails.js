const application = require("../../../models/application");

const getPropertyDetails = async (req, res, next) => {
  try {
    if (req?.params.propertyName && req?.params.spaName)
      res.status(200).json(
        await getPropertyDetailsService({
          propertyName: req.sanitize(req.params.propertyName),
          name: req.sanitize(req.params.spaName),
        })
      );
    else if (req?.params.propertyName)
      res.status(200).json(
        await getPropertyDetailsService({
          propertyName: req.sanitize(req.params.propertyName),
        })
      );
    else res.status(200).json(await application.find());
  } catch (err) {
    next(err);
  }
};

const getPropertyDetailsService = async (props) => {
  const response = await fetchSearchResultForSPA(props);
  if (response.length === 0) return { message: "Searched SPA is not avaliable." };
  bindResponse(response);
  return response;
};

function bindResponse(response) {
  let i = 1;
  response.forEach((item) => {
    item.id = i++;
  });
}

async function fetchSearchResultForSPA(props) {
  return await application.aggregate([
    {
      $match: props,
    },
    {
      $project: {
        propertyName: "$propertyName",
        name: "$name",
        path: "$path",
        ref: "$ref",
        env: "$env",
        updatedAt: "$updatedAt",
        _id: 0,
      },
    },
    {
      $sort: { propertyName: 1, name: 1, env: 1 },
    },
  ]);
}

module.exports = { getPropertyDetails, getPropertyDetailsService };
