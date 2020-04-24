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
      console.log(e);
      return false;
    }

    if (videos.length > 0) {
      let currentPublishedAt = videos[0].published_at;

      if (publishedAtInteger > currentPublishedAt) {
        try {
          await db.none(
            'UPDATE videos SET published_at = $1, url = $2 WHERE published_at = $3',
            [publishedAtInteger, url, currentPublishedAt]
          );
          return true;
        }
        catch(e) {
          console.log(e);
          return false;
        }
      }
      else {
        return false;
      }
    }
    else {
      try {
        await db.none(
          'INSERT INTO videos(url, published_at) VALUES ($1, $2)',
          [url, publishedAtInteger]
        );
      }
      catch(e) {
        console.log(e);
      }
      finally {
        return false;
      }
    }
  }
};
