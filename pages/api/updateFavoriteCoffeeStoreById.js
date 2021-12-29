import {
  findRecordByFilter,
  getMinifiedRecords,
  table,
} from "../../lib/airtable";

const updateFavoriteCoffeeStoreById = async (req, res) => {
  try {
    if (req.method === "PUT") {
      const { id } = req.body;

      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          const incrementVoting = records[0].voting + 1;

          const recordId = records[0].recordId;

          const updating = await table.update([
            {
              id: recordId,
              fields: {
                voting: incrementVoting,
              },
            },
          ]);

          if (updating) {
            const minifiedRecords = getMinifiedRecords(updating);
            res.json(minifiedRecords);
          }
        } else {
          res.json({ message: "Could not get this" });
        }
      } else {
        res.status(400).json({ message: "There is no id as body" });
      }
    } else {
      res.json({ message: "get" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default updateFavoriteCoffeeStoreById;
