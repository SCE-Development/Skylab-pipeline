import { expect } from "chai";
import { agent as request } from "supertest";
import sinon from "sinon";
import { ExpressServer } from '../src/utils/Server';
import { DatabaseConnection } from '../src/utils/DB';


// const app = new ExpressServer(__dirname + '/../src/routes/', 8000);
// app.initializeEndpoints();
let app: any = null;
const sandbox = sinon.createSandbox();

describe("Health Check testing", () => {
  describe("/GET successful healthcheck", () => {
    let dbStub = null;
    before((done) => {
      app = new ExpressServer(__dirname + '/../src/routes/', 8000);
      app.initializeEndpoints();
      done();
    })
    it("Should always succeed", async () => {
      const res = await request((app as ExpressServer).app)
        .get('/healthCheck');
      expect(res.status).to.equal(200);
    });
    after((done) => {
      (app as ExpressServer).closeServer();
      
      done();
    })
  });

  // describe("/GET failed healthcheck", () => {
  //   // before((done) => {
  //   //   sinon.stub();
  //   //   app = new ExpressServer(__dirname + '/../src/routes/', 8000);
  //   //   app.initializeEndpoints();
  //   //   done();
  //   // })
  //   it("Should always fail", async () => {
  //     const res = await request((app as ExpressServer).app)
  //       .get('/healthCheck');
  //     expect(res.status).to.equal(503);
  //   });
  //   // after((done) => {
  //   //   (app as ExpressServer).closeServer()
  //   //   done()
  //   // })
  // });
});
