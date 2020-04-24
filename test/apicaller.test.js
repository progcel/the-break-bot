const axios = require('axios');
const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
const logger = require('../logger');
const ApiCaller = require('../apicaller');

describe('ApiCaller', function () {
  const apiCaller = new ApiCaller();
  
  afterEach(function () {
    sinon.restore();
  });

  it('fetches video info', async function () {
    // Arrange
    json = {
      "data": {
        "items": [
          {
            "id":
            {
              "videoId": "1"
            },
            "snippet":
            {
              "publishedAt": "2000-01-01T00:00:00.000Z"
            }
          }
        ]
      }
    }
    sinon.stub(axios, "get").returns(Promise.resolve(json));

    // Act
    const result = await apiCaller.getVideoInfo();

    // Assert
    expect(result).to.eql({
      "url": "https://www.youtube.com/watch?v=1",
      "publishedAt": "2000-01-01T00:00:00.000Z",
    });
  });

  it('fetches stats', async function () {
    // Arrange
    json = {
      "data": {
        "items": [
          {
            "statistics":
            {
              "viewCount": "1",
              "subscriberCount": "2",
            }
          }
        ]
      }
    }
    sinon.stub(axios, "get").returns(Promise.resolve(json));

    // Act
    const result = await apiCaller.getStats();

    // Assert
    expect(result).to.eql({
      "viewCount": "1",
      "subscriberCount": "2",
    });
  });

  it('returns nothing when video info fails to be fetched', async function () {
    // Arrange
    sinon.stub(axios, 'get').throws();
    sinon.stub(logger, 'logError');

    // Act
    const result = await apiCaller.getVideoInfo();

    // Assert
    expect(result).to.be.an('undefined');
  });

  it('returns nothing when stats fail to be fetched', async function () {
    // Arrange
    sinon.stub(axios, 'get').throws();
    sinon.stub(logger, 'logError');

    // Act
    const result = await apiCaller.getStats();

    // Assert
    expect(result).to.be.an('undefined');
  });
});
