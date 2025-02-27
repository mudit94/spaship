const chart = require("../../models/event");

const getLatestActivitiesService = async (matchRequest, limitRequest, skipRequest) => {
  try {
    const response = await fetchLatestActivitiesByProperty(matchRequest, limitRequest, skipRequest);
    bindResponse(response);
    return response;
  } catch (e) {
    return { Error: e };
  }
};

function bindResponse(response) {
  const codeMap = {
    WEBSITE_CREATE: "deployed over",
    WEBSITE_DELETE: "deleted from",
    WEBSITE_UPDATE: "updated from",
  };
  let i = 1;
  response.forEach((item) => {
    item.id = i++;
    item.createdAt = item.createdAt.toTimeString().substring(0, 8) + " " + item.createdAt.toDateString();
    actvitiesText(item, codeMap);
  });
}

async function fetchLatestActivitiesByProperty(matchRequest, limitRequest, skipRequest) {
  return await chart.aggregate([
    {
      $match: matchRequest,
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        spaName: "$spaName",
        propertyName: "$propertyName",
        code: "$code",
        branch: "$branch",
        env: "$env",
        createdAt: "$createdAt",
        _id: 0,
      },
    },
    {
      $limit: limitRequest.limit,
    },
    {
      $skip: skipRequest.skip,
    },
  ]);
}

function actvitiesText(item, codeMap) {
  item.latestActivityHead = " has been " + item.code + " ";
  item.latestActivityTail = " at " + item.createdAt.toString().slice(0, 24) + " in " + item.env;
}

module.exports = { getLatestActivitiesService };
