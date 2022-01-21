import {
  getMinifiedRecords,
  table,
  findRecordByFilter,
} from "../../lib/airtable";

const createCoffeeStores = async (req, res) => {
  try {
    const { id, name, neighbourhood, address, imgUrl, voting } = req.body;

    if (id) {
      if (req.method === "POST") {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          res.json(records);
        } else {
          if (id && name) {
            const createRecord = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighbourhood,
                  voting,
                  imgUrl,
                },
              },
            ]);

            const records = getMinifiedRecords(createRecord);
            res.json(records);
          } else {
            res.status(400).json({ message: "Id or name is missing" });
          }
        }
      } else {
        res.json({ message: "get" });
      }
    } else {
      res.status(400).json({ message: "Id is missing" });
    }
  } catch (err) {
    res.status(500);
    res.json({ message: err.message });
  }
};

export default createCoffeeStores;
