const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL);

module.exports = {
  shouldNotify: async function (url, publishedAt) {
    let publishedAtInteger = Date.parse(publishedAt);

    let videos;
    try {
      videos = await db.any('SELECT * FROM videos;');
    }
    catch(e) {
      console.log(err);
      return false;
    }

    if (videos.length > 0) {
      let currentPublishedAt = videos[0].published_at;

      if (publishedAtInteger > currentPublishedAt) {
        try {
          db.none(`UPDATE videos SET published_at = ${publishedAtInteger}, url = '${url}' WHERE published_at = ${currentPublishedAt};`);
          return true;
        }
        catch(e) {
          console.log(err);
          return false;
        }
      }
      else {
        return false;
      }
    }
    else {
      try {
        db.none(`INSERT INTO videos(url, published_at) VALUES ('${url}', ${publishedAtInteger})`);
      }
      catch(e) {
        console.log(err);
      }
      finally {
        return false;
      }
    }
  }
};
