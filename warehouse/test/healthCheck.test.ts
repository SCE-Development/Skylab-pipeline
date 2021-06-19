import { expect } from "chai";
import { agent as request } from "supertest";
import { ExpressServer } from "../src/utils/Server";
import { DatabaseConnection } from "../src/utils/DB";
import sinon from "sinon";

// let connection: any = null;
let app: ExpressServer;
const sandbox = sinon.createSandbox();

describe("Health Check testing", () => {
  let connectionStub: sinon.SinonStub<[], Promise<boolean>>;
  let healthCheckStub: sinon.SinonStub<[], boolean>;
  let closeConnectionStub: sinon.SinonStub<[done?: any], void>;
  before((done) => {
    connectionStub = sandbox.stub(DatabaseConnection.prototype, "connect");
    healthCheckStub = sandbox.stub(DatabaseConnection.prototype, "healthCheck");
    closeConnectionStub = sandbox.stub(DatabaseConnection.prototype, "close");
    app = new ExpressServer(__dirname + "/../src/routes/", 8000);
    app.initializeEndpoints();
    app.connectServer();
    done();
  });
  after((done) => {
    if (connectionStub) connectionStub.restore();
    if (healthCheckStub) healthCheckStub.restore();
    if (closeConnectionStub) closeConnectionStub.restore();
    sandbox.restore();
    app.closeConnection(done);
  });
  describe("/GET successful healthcheck", () => {
    it("Should always succeed", async () => {
      await connectionStub.resolves(true);
      healthCheckStub.returns(true);
      const res = await request(app.app).get("/healthCheck");
      expect(res.status).to.equal(200);
    });
  });

  describe("/GET failed healthcheck", () => {
    it("Should always fail", async () => {
      await connectionStub.resolves(true);
      healthCheckStub.returns(false);
      const res = await request(app.app).get("/healthCheck");
      expect(res.status).to.equal(503);
    });
  });
});
