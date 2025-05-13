import { clearFile } from "./CacheDb";
import { query } from "./db";
import md5 from "blueimp-md5";

const getCityPlaceIdSql = (place_id: string) => {
  const sql = `SELECT * FROM cities WHERE place_id = ?`;

  const params = [place_id];
  return { sql, params, fileName: md5(sql + JSON.stringify(params)) };
};

export const getCityData = async (db: any, place_id: string) => {
  const sql = `SELECT * FROM cities WHERE place_id = ?`;

  const params = [place_id];
  const [result] = await query(db, sql, params, 60 * 60 * 24);

  return result;
};

export const saveCity = async (db: any, place: any) => {
  try {
    const prev = await getCityData(db, place.place_id);

    if (prev) {
      return prev.city_id;
    }

    const { fileName } = getCityPlaceIdSql(place.place_id);

    await clearFile(fileName);
    const componentForm: any = {
      locality: "long_name", // city
      administrative_area_level_1: "short_name", // state
      administrative_area_level_2: "long_name", // county
      country: "short_name",
      street_number: "long_name",
      route: "long_name",
      postal_code: "long_name",
      postal_code_suffix: "long_name",
    };

    const obj: any = {};
    obj["place_id"] = place.place_id;
    let val2 = "";
    obj.formatted_address = place.formatted_address;
    obj.lat = place.geometry.location.lat;
    obj.lng = place.geometry.location.lng;

    for (const elm of place.address_components) {
      let addressType = elm.types[0];
      console.log("addressType: ", addressType);
      if (componentForm[addressType]) {
        const val = elm[componentForm[addressType]];
        if (addressType === "locality") {
          addressType = "city";
        } else if (addressType === "administrative_area_level_1") {
          addressType = "state";
          val2 = elm["long_name"];
          obj["state_long"] = val2;
        } else if (addressType === "administrative_area_level_2") {
          addressType = "county";
        } else if (addressType === "country") {
          val2 = elm["long_name"];
          obj["country_long"] = val2;
        }
        obj[addressType] = val;
      }
    }

    const dt = new Date();
    const dtStr = dt.toISOString();
    const sql =
      "INSERT INTO cities (city, province, county, country, place_id, createdAt, updatedAt, status, show_record, deleted, lat, lng, data, formatted_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const result = await db.query(sql, [
      obj["city"],
      obj["state"],
      obj["county"],
      obj["country"],
      obj["place_id"],
      dtStr,
      dtStr,
      1,
      1,
      0,
      obj["lat"],
      obj["lng"],
      JSON.stringify(place),
      obj["formatted_address"],
    ]);

    return result[0].insertId;
  } catch (err: any) {
    console.log(JSON.stringify(err));
  }
};

export const getModuleData = async (db: any) => {
  const sql = `SELECT * FROM modules ORDER BY name ASC`;

  const params: any = [];
  const result = await query(db, sql, params, 60 * 60 * 24);

  return result;
};

export const getModuleDataSingleMultiple = async (db: any, ids: number[]) => {
  const sql = `SELECT * FROM modules WHERE module_id in (?) ORDER BY name ASC`;

  const params: any = [ids];
  const result: any = await query(db, sql, params, 60 * 60 * 24);

  const obj: any = {};
  for (const elm of result) {
    obj[elm.module_id] = elm;
  }

  return { ids, result, obj };
};

export const getModuleDataSingle = async (db: any, module_id: number) => {
  const sql = `SELECT * FROM modules WHERE module_id = ?`;

  const params: any = [module_id];
  const [result] = await query(db, sql, params, 60 * 60 * 24);

  return result;
};
