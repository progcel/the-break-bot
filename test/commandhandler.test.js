const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
const ApiCaller = require('../apicaller')
const CommandHandler = require('../commandhandler');

describe('CommandHandler', function () {
  const apiCaller = new ApiCaller();
  const commandHandler = new CommandHandler(apiCaller);

  afterEach(function () {
    sinon.restore();
  });

  it('handles br video', async function () {
    // Arrange
    sinon.stub(apiCaller, "getVideoInfo").returns(Promise.resolve({url: "https://www.youtube.com/watch?v=1"}));

    // Act
    const result = await commandHandler.handle('br video');

    // Assert
    expect(result).to.eql("https://www.youtube.com/watch?v=1");
  });

  it('handles br stats', async function () {
    // Arrange
    sinon.stub(apiCaller, "getStats").returns(Promise.resolve({viewCount: 1, subscriberCount: 2}));

    // Act
    const result = await commandHandler.handle('br stats');

    // Assert
    expect(result).to.eql('these are the latest Break numbers:\n' +
                           'Total views: 1\n' +
                           'Total subscribers: 2');
  });

  it('returns nothing for unsupported command', async function () {
    // Act
    const result = await commandHandler.handle('br aaa');

    // Assert
    expect(result).to.eql(undefined);
  });

  it('returns an error if br stats goes wrong', async function () {
    // Arrange
    sinon.stub(apiCaller, "getStats").returns(undefined);

    // Act
    const result = await commandHandler.handle('br stats');

    // Assert
    expect(result).to.eql(`something went wrong \:sob: ${process.env.DEVELOPER_ID}`);
  });

  it('returns an error if br video goes wrong', async function () {
    // Arrange
    sinon.stub(apiCaller, "getVideoInfo").returns(undefined);

    // Act
    const result = await commandHandler.handle('br video');

    // Assert
    expect(result).to.eql(`something went wrong \:sob: ${process.env.DEVELOPER_ID}`);
  });
});
